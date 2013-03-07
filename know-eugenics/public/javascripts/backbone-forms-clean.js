(function(window, Backbone, _, $, Handlebars){

  Forms = {};

  var confirmation = require('bmcmahen-confirmation'),
      spinner = require('bmcmahen-canvas-loading-animation');

  // The field types that are required by each field type, and
  // each prod. The app uses these to determine what fields
  // are necessary to include, depending on the document type
  // and the prods that it's part of.
  var documentTypes = ['Event', 'Idea', 'Institution', 'Person', 'Place', 'Publication'];

  // Maps type field to pluralized form
  var typeToParam = {
    'event' : 'events',
    'idea' : 'ideas',
    'institution' : 'institutions',
    'person' : 'people',
    'place' : 'places',
    'publication' : 'publications'
  };

  // Field Type Schemas
  var fieldTypes = {

      required : function() {
        return {
          title : { widget: 'text', label: 'Title', required: true},
          type : { widget: 'select', label: 'Document Type', options: documentTypes },
          shortDescription: {widget: 'text', label: 'Short Description', required: true},
          fullDescription: {widget: 'textarea', label: 'Full Description', required: true},
          image: {widget: 'image', label: 'Image' },
          resources: {widget: 'formset', label: 'Link', editable: true, fields : [{
            widget: 'text', name: 'resource', label: 'Resource', required: true
          }, {
            widget: 'text', name: 'resourceName', label: 'Resource Name'
          }]},
          prods: {widget: 'checkbox', fields: [{
            timeline: {
              widget: 'checkbox', label: 'Timeline', value: ''
            },
            heroes: {
              widget: 'checkbox', label: 'Heroes and Villains', value: ''
            }
          }]}
        };
      },

      event : function() {
        return {
          date: { widget: 'text', label: 'Date', className:'date', helpText: 'Format: MM/DD/YYYY' }
        };
      },

      person : function() {
        return {
          dateOfBirth: { widget: 'text', label: 'Date of Birth', className: 'dateOfBirth'},
          dateOfDeath: { widget: 'text', label: 'Date of Death', className: 'dateOfDeath'}
        };
      },

      publication : function() {
        return {
          yearOfPublication: { widget: 'text', label : 'Year of Publication'},
          monthOfPublication: { widget: 'text', label: 'Month of Publication'},
          author: {widget: 'text', label: 'Author'},
          publisher: {widget: 'text', label: 'Publisher'}
        };
      },

      timeline : function() {
        return {
          date: { widget: 'text', className:'date', helpText: 'Format: MM/DD/YYYY' },
          startDate : { widget: 'text', label: 'Date Range (Start Date)',
           helpText: 'If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY.'},
          endDate : { widget: 'text', label: 'Date Range (End Date)',
          helpText: 'If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY.'}
        };
      },

      heroes : function() {
        return {
          heroQuote: { widget: 'textarea', label: 'Hero Quote', className: 'hero quote'},
          heroQuoteSource: { widget: 'text', label: 'Hero Quote Citation', className: 'citation'},
          villainQuote: { widget: 'textarea', label: 'Villain Quote', className: 'villain quote'},
          villainQuoteSource: { widget: 'text', label: 'Villain Quote Citation', className: 'citation'},
          ambiQuote: {widget: 'textarea', label: 'Ambiguous Quote', className: 'ambiquote quote'},
          ambiQuoteSource: { widget: 'text', label: 'Ambiguous Quote Source', className: 'citation' }
        };
      }

    };



    // Field Model
    var FieldModel = Forms.FieldModel = Backbone.Model.extend({

      // Our validations will go here. If the validation exists on that
      // field, then it will run the validation, returning 'TRUE' if
      // it fails validation. It sets an 'error' as an attribute if it fails,
      // or unsets the 'error' attribute if it passes.
       validateModel: function(attrs, options){
        attrs = attrs || this.toJSON();

        // Field is required
        if (attrs.required){
          if (attrs.value == null || attrs.value === '') {
            this.set('error', 'This field is required.');
            return true;
          }
          if (this.has('error'))
            this.unset('error');
        }
      }

    });

    // Our formset with be a FormCollection
    var FormCollection = Forms.FormCollection = Backbone.Collection.extend({
      model: FormModel
    });

    // Our forms will be a formModel which will be a fieldCollection.
    var FormModel = Forms.FormModel = Backbone.Model.extend();

    // Field Collection
    var FieldCollection = Forms.FieldCollection = Backbone.Collection.extend({

      model: FieldModel,

      saveCollection: function(){
        var json = {};
        this.each(function(model){
          var val = model.get('value');
          if (val)
            json[model.get('name')] = model.get('value');
        });

        console.log(json);
        // this.formModel.setAndSave(json);
      },

      // Generate a collection of field models that correspond
      // either to the supplied Form attributes, or provide
      // the default form attributes for new submission.
      generateFieldModels: function(){
        var attr = this.formModel.toJSON();

        this.type = attr.type;
        this.prods = attr.prods;

        var fields = this.determineRequiredFields({
          type: attr.type,
          prods: attr.prods
        });

        _.each(fields, function(field, key){
          field.name = key;
          if (key === 'prods') {
            _.each(field.fields[0], function(p, k){
              if (_.contains(attr.prods, k)){
                p.value = 'checked';
              }
              p.name = k;
            });

          // XXX Implement fieldsets
          } else if (field.widget === 'fieldset') {
            field.subfields = _.map(field.fields, function(subfield, key){
              subfield.name = key;
              return new FieldModel(subfield);
            });

          } else if (!_.isUndefined(attr[key])) {
            field.value = attr[key];
          }
          this.add(field);
        }, this);

        return this;
      },

      // This determines which fields are required
      // depending upon the type, and prods selected.
      determineRequiredFields: function(options) {
        var defaultFields = fieldTypes.required(),
            prods = options.prods,
            type = options.type,
            toIterate = _.union(type, prods);

        _.each(toIterate, function(required){
          if (fieldTypes[required])
            _.extend(defaultFields, fieldTypes[required]());
            _.each(defaultFields, function(field, name){
              field.name = name;
            });
        });

        return defaultFields;
      },

      alterTypes: function(newType){
        if (this.type === newType)
          return;

        // Determine our new field set
        var fields = this.determineRequiredFields({
          type : newType,
          prods: this.prods
        });

        // and which fields need to be removed / added
        this.remove(this.fieldsToRemove(fields));
        this.add(this.fieldsToAdd(fields));
        this.type = newType;
      },

      // When adding a prod, determine the required fields
      // and add them to the collection.
      addProd: function(prodName){
        // update the model.
        var model = this.where({name : 'prods'}),
            arr = model[0].get('fields');

        arr[0][prodName].value = 'checked';

        // Determine which fields to add
        var newProds = _.clone(this.prods);
        newProds.push(prodName);

        var fields = this.determineRequiredFields({
          prods: newProds,
          type: this.type
        });

        this.add(this.fieldsToAdd(fields));
        this.prods = newProds;
      },

      // When removing a prod, determine which fields
      // are unique to that prod, and remove them.
      removeProd: function(prodName){
        // update the model
        var model = this.where({name : 'prods' }),
            arr = model[0].get('fields');

        arr[0][prodName].value = '';

        // determine our new fields
        var newProds = _.without(this.prods, prodName),
            fields = this.determineRequiredFields({
              prods: newProds,
              type: this.type
            });

        var toRemove = this.fieldsToRemove(fields);
        this.remove(toRemove);
        this.prods = newProds;
      },

      // Given a new set of fields, determine which fields
      // from the old set should be removed.
      fieldsToRemove: function(newFields){
        return this.filter(function(obj, i){
          var field = obj.toJSON();
          if (!newFields[field.name]) return true;
        });
      },

      // Given a new set of fields, determine which fields
      // need to be added to the old set.
      fieldsToAdd: function(newFields){
        var collection = this.toJSON();
        return _.filter(newFields, function(obj, key){
          return ! _.findWhere(collection, {name : key});
        }, this);
      }
    });

    // Form View
    var FormView = Forms.FormView = Backbone.View.extend({

      tagName: 'form',

      className: 'myForm',

      id: 'myForm',

      events: {
        'submit' : 'saveForm',
        'change select' : 'alterType',
        'click .prod' : 'alterProds',
        'click .delete' : 'deleteDocument'
      },

      initialize: function(options) {
        this.collection = options.collection;
        this.dataModel = options.dataModel;
        if (options.formCollection)
          this.formCollection = options.formCollection;

        if (options.formModel) {
          this.formModel = options.formModel;
        }

        if (options.isBase) this.isBase = true;

        // We only render/destroy new/destroyed views respectively, instead
        // of rerendering the entire thing.
        this.listenTo(this.collection, 'add', this.addChild);
        this.listenTo(this.collection, 'remove', this.removeChild);
      },

      // When adding a field, create it, push it to our children list,
      // and render it before our save button.
      addChild: function(child){
        var view = new FieldView({ model : child });
        this.children.push(view);
        this.$el.find('#save-form').before(view.render().el);
      },

      // When removing a child, determine which views belong to
      // which model, and delete those views. Also return a new children
      // list without those views.
      removeChild: function(childModel){
        this.children = _.reject(this.children, function(child, i){
          if (child.model.cid === childModel.cid) {
            child.close();
            return true;
          }
        });
      },

      // Our generic close children function. Iterates through each
      // of our children views, and closes them.
      closeChildren: function(){
        if (this.children) {
          _.each(this.children, function(view){
            view.close();
          });
        }
        this.children = [];
      },

      close: function(){
        this.remove();
        this.unbind();
      },

      removeFormElement: function(e){
        e.preventDefault();
        var model = this.formModel;
        var collection = this.formCollection;
        collection.remove(model);
      },

      // Except for the initial rendering of the form, this
      // should never be called. Form rerending should be done at
      // the level of field views.
      render: function(){
        this.closeChildren();

        var elements = this.collection.map(function(model){

          // What should we do with a formset?
          if (model.get('widget') === 'formset') {
            var formset = new FormsetView({model: model});
            this.children.push(formset);
            return formset.render().el;
          } else {
            var attr = { model : model };
            var view = new FieldView(attr);
            this.children.push(view);
            return view.render().el;
          }
        }, this);

        this.$el.html(elements);

        // If we have a formset, then append the remove button
        if (this.formModel) {
          this.$el.append('<button class="remove-form">remove</button>');
          $(this.$el.find('button.remove-form')).on('click', _.bind(this.removeFormElement, this));
        }

        // To do: Make this less ugly.
        if (this.isBase){
          this.$el.append('<input type="submit" id="save-form" class="btn btn-primary" value="Save">');
          if (this.dataModel && !this.dataModel.isNew()) {
            this.$el.append('<a id="delete-form" class="delete btn btn-danger pull-right">Delete</a>');
          }
        }

        return this;
      },

      // Checks to ensure that our fields validate, and if they do,
      // then starts the saving process.
      saveForm: function(e){
        e.preventDefault();
        this.parseForm();

        var valid = true;

        _.each(this.children, function(child){
          var fieldValid;
          if (child.model.get('widget') === 'formset') {
            console.log('validate Formsets');
          } else {
            fieldValid = child.model.validateModel();
            if (fieldValid)
              valid = false;
          }
        });

        if (!valid){
          $('#save-form').addClass('disabled');
          this.collection.saveCollection();
        }
      },

      // Sets each model in our form to have the value as
      // found in the field view.
      parseForm: function(){
        _.each(this.children, function(child){
          var widget = child.model.get('widget');
          var value;

          if (widget === 'formset'){
            value = child.parseFormset();
          } else {
            value = child.parseField();
          }

          // we've already set the image model, presumably,
          // to the appropriate value.
          if (widget !== 'image')
            child.model.set('value', value);
        }, this);
      },

      // Changes the document type -- e.g., 'Event', 'Idea'
      alterType: function(e){
        var type = $(e.currentTarget).find(':selected').val();
        this.collection.alterTypes(type.toLowerCase());
      },

      // Either add or remove the prod from our Prods list
      alterProds: function(e){
        var $checkbox = $(e.currentTarget).find('input'),
            isChecked = $checkbox.attr('checked'),
            name = $checkbox.attr('name');

        if (isChecked) this.collection.addProd(name);
        else this.collection.removeProd(name);
      },

      // Deletes an entry when in edit mode.
      // To Do: Also delete the Filepicker image, if it exists.
      deleteDocument : function(e){
        e.preventDefault();
        var self = this;

        var confirm = confirmation({
          title: 'Delete Document',
          content: 'Are you sure you want to delete this document?',
          okay: 'Delete',
          cancel: 'Cancel'
        }).effect('slide')
          .show()
          .okay(function(e){
            // Set loading indicator
            $('#delete-form').addClass('disabled');
            self.dataModel.destroy({wait: true});
          });
      }

    });

    // Field View
    var FieldView = Forms.FieldView = Backbone.View.extend({

      tagName: 'div',

      className: 'form-field',

      events: {
        'click #add-image': 'addImage',
        'click #change-image': 'addImage',
        'change input.image-input': 'uploadImage'
      },

      initialize: function(attr){
        if (attr.formCollection)
          this.formCollection = attr.formCollection;

        this.listenTo(this.model, 'invalid', this.render);
        this.listenTo(this.model, 'change:error', this.render);

        if (this.model.get('widget') === 'image')
          this.listenTo(this.model, 'change', this.render);
      },

      render: function() {
        var widget = this.model.get('widget'), template;

        if (widget === 'formset'){
          template = '';
        } else {
          template = this.fieldmap[widget]({
            object: this.model.toJSON()
          });
        }

        this.$el.html(template);
        return this;
      },

      fieldmap: {
        'textarea' : Handlebars.compile($('#textarea').html()),
        'text' : Handlebars.compile($('#text').html()),
        'checkbox' : Handlebars.compile($('#checkbox').html()),
        'select' : _.template($('#select').html()),
        'image': Handlebars.compile($('#image').html())
      },

      // Handle checkboxes and select menus differently from our
      // regular text/textarea inputs.
      parseField: function(){
        var widget = this.model.get('widget')
          , $input = this.$el.find(':input[name]:enabled');

        if (widget === 'checkbox') {
          var prods = [];
          $input.each(function(checkbox){
            if ($(this).attr('checked')){
              prods.push($(this).attr('name'));
            }
          });
          return prods;
        }

        if (widget === 'select')
          return this.$el.find('option:selected').val().toLowerCase();

        return $input.val();
      },

      // Remove the view from the DOM.
      close: function(){
        this.remove();
        this.unbind();
      },

      // Triggers a click on our hidden input field.
      addImage: function(e){
        e.preventDefault();
        $('input.image-input').trigger('click');
      },

      // Use Filepicker to upload the image and retrieve
      // the appropriate meta data. This actually sets
      // our model to have the appropriate fields, because
      // it depends on it for automatically updating
      // our field view.
      uploadImage: function(e){
        e.preventDefault();
        var fileList = e.currentTarget.files
          , self = this
          , image;

        var currentImage = this.model.get('value');
        if (currentImage){
          filepicker.remove(currentImage);
          self.model.set('value', false);
        }

        this.model.set('loading', true);

        filepicker.store(fileList[0], function(fp){
          image = fp;
          filepicker.stat(fp, {width: true, height: true}, function(metadata){
            image.metadata = metadata;
            self.model.set('loading', false);
            self.model.set('value', image);
          });
        });
      },

      removeField: function(e){
        e.preventDefault();
        console.log(this.formCollection, this.model);
        if (this.formCollection.length > 1)
          this.formCollection.remove(this.model);
      }
    });

    // Formsets -> Handle arrays.
    var FormsetView = Forms.FormsetView = Backbone.View.extend({

      tagName: 'div',

      className: 'formsetView',

      events: {
        'click .add-another' : 'addAnother'
      },

      initialize: function(options){
        this.views = [];
        var model = this.model = options.model;
        var fields = this.fields = this.model.get('fields');

        var formCollection = this.formCollection = new Backbone.Collection();
        var form = new Backbone.Model(fields);

        formCollection.add(form);

        formCollection.each(function(form){
          var fieldCollection = new FieldCollection();
          _.each(form.attributes, function(attr){
            fieldCollection.add(attr);
          });
          var view = new FormView({
            collection: fieldCollection,
            formCollection: formCollection,
            formModel: form
          });
          this.views.push(view);
        }, this);

        this.listenTo(this.formCollection, 'add', this.formAdded);
        this.listenTo(this.formCollection, 'remove', this.formRemoved);
      },

      render: function(){
        this.closeChildren();

        var elements = _.map(this.views, function(view){
          this.children.push(view);
          return view.render(true).el;
        }, this);

        this.$el.html(elements);
        this.$el.append('<button class="btn add-another">Add Another</button>');
        return this;
      },

      parseFormset: function(){
        var parsed = _.map(this.views, function(child){
          child.parseForm();
          var formvals = {};
          _.each(child.children, function(childView, i){
            formvals[childView.model.get('name')] = childView.model.get('value');
          });
          return formvals;
        });
        return parsed;
      },

      formAdded: function(model){
        console.log('formAdded');
      },

      formRemoved: function(model){
        this.views = _.reject(this.views, function(view, i){
          if (view.formModel.cid === model.cid) {
            view.close();
            return true;
          }
        });
      },

      closeChildren: function(){
        if (this.children) {
          _.each(this.children, function(view){
            view.closeChildren();
          });
        }
        this.children = [];
      },

      addAnother: function(e){
        e.preventDefault();

        var newFields = _.map(this.fields, function(field){
          return _.clone(field);
        }, this);

        var formModel = new Backbone.Model(newFields);
        this.formCollection.add(formModel);

        var collection = new FieldCollection();
        collection.add(newFields);

        var view = new FormView({
          collection: collection,
          formCollection: this.formCollection,
          formModel: formModel
        });

        this.views.push(view);
        this.$el.find('button.add-another').before(view.render().el);
      }

    });


    // Data Model - retrieves content/saves content from the
    // server and constructs the form.
    var DataModel = Forms.DataModel = Backbone.Model.extend({
      idAttribute: '_id',

      urlRoot: '/documents',

      defaults: {
        type: 'event',
        title: '',
        shortDescription: '',
        fullDescription: '',
        prods: []
      },

      initialize: function(attr, options){
        var self = this;
        this.urlRoot = options.urlRoot;

        this.on('request', this.showSpinner);
        this.on('sync', this.hideSpinner);
        this.on('destroy', this.redirectPage);

        function buildForm(){
          self.fieldCollection = new FieldCollection();
          self.fieldCollection.formModel = self;
          self.fieldCollection.generateFieldModels();

          var view = new FormView({
            collection: self.fieldCollection,
            dataModel: self,
            isBase: true
          });
          view.render();
          $('#form-wrapper').append(view.el);

          console.log(self.fieldCollection.toJSON());
        }

        if (! this.isNew()) {
          this.fetch({ success: function(res) {
            buildForm();
          }});
        } else {
          buildForm();
        }
      },

      setAndSave: function(json){
        // Remove empty fields from our form model
        var formModel = this.toJSON()
          , self = this;

        // this also borks our _id
        _.each(formModel, function(obj, key){
          if (! _.has(json, key) && key !== '_id' && key !== 'created')
            this.unset(key);
        }, this);

        this.set(json);
        console.log('hello?', this);


        this.save({}, { success: function(model, xhr, options){
          var typeString = typeToParam[self.get('type')]
            , id = model.id
            , host = window.location.host;

          window.location = 'http://' + host + '/database/' + typeString + '/' + id;
        }});
      },

      showSpinner: function(){
        var loading = this.loading = spinner({
          color: '245, 245, 245',
          width: 50,
          height: 40,
          number: 12,
          radius: 10,
          dotRadius: 2.1
        });

        $('#loading-wrapper').html(loading.canvas);
      },

      hideSpinner: function(){
        $('#loading-wrapper').html('');
      },

      // Redirect to where the element was listed.
      redirectPage: function(){
        var host = window.location.host
          , pathname = window.location.pathname
          , prods = ['heroes-and-villains', 'timeline'];

        // This is a silly hack.
        var arr = pathname.split('/');
        if (_.contains(prods, arr[2])) {
          window.location = 'http://' + host + '/database/prods/' + arr[2];
        } else {
          window.location = 'http://' + host + '/database/' + arr[2];
        }
      }

    });

})(window, Backbone, _, $, Handlebars);
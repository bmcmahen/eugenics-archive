(function(window, Backbone, _, $, Handlebars){
  
  Forms = {};

  var confirmation = require('bmcmahen-confirmation')
    , spinner = require('bmcmahen-canvas-loading-animation');

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
  }

  // Field Type Schemas
  var fieldTypes = {

      required : function() {
        return {
          title : { widget: 'text', label: 'Title', required: true},
          type : { widget: 'select', label: 'Document Type', options: documentTypes },
          shortDescription: {widget: 'text', label: 'Short Description', required: true},
          fullDescription: {widget: 'textarea', label: 'Full Description', required: true},
          image: {widget: 'image', label: 'Image' },
          link: {widget: 'formset', label: 'Link', fields : [{
            widget: 'text', label: 'Link Name'
          },{
            widget: 'text', label: 'URL'
          }]},
          prods: {widget: 'checkbox', fields: [{
            timeline: {
              widget: 'checkbox', label: 'Timeline', value: ''
            },
            heroes: {
              widget: 'checkbox', label: 'Heroes and Villains', value: ''
            }
          }]}
        }
      },

      event : function() {
        return {
          date: { widget: 'text', label: 'Date', className:'date', helpText: 'Format: MM/DD/YYYY' }
        }
      },

      person : function() {
        return {
          dateOfBirth: { widget: 'text', label: 'Date of Birth', className: 'dateOfBirth'},
          dateOfDeath: { widget: 'text', label: 'Date of Death', className: 'dateOfDeath'}
        }
      },

      publication : function() {
        return {
          yearOfPublication: { widget: 'text', label : 'Year of Publication'},
          monthOfPublication: { widget: 'text', label: 'Month of Publication'},
          author: {widget: 'text', label: 'Author'},
          publisher: {widget: 'text', label: 'Publisher'}
        }
      },

      timeline : function() {
        return {
          date: { widget: 'text', className:'date', helpText: 'Format: MM/DD/YYYY' },
          startDate : { widget: 'text', label: 'Date Range (Start Date)',
           helpText: 'If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY.'},
          endDate : { widget: 'text', label: 'Date Range (End Date)', 
          helpText: 'If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY.'}
        }
      },

      heroes : function() {
        return {
          heroQuote: { widget: 'textarea', label: 'Hero Quote', className: 'hero quote'},
          villainQuote: { widget: 'textarea', label: 'Villain Quote', className: 'villain quote'},
          ambiQuote: {widget: 'textarea', label: 'Ambiguous Quote', className: 'ambiquote quote'},
          date : { widget: 'text', label: 'Date (MM/DD/YYYY)', className: 'date'}
        }
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

        this.formModel.setAndSave(json);
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

          // XXX need to think about how to best implement fieldsets.
          // 
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
        var defaultFields = fieldTypes.required()
          , prods = options.prods 
          , type = options.type
          , toIterate = _.union(type, prods);

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
          return

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
        var model = this.where({name : 'prods'})
          , arr = model[0].get('fields');

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
        var model = this.where({name : 'prods' })
          , arr = model[0].get('fields');

        arr[0][prodName].value = '';

        // determine our new fields
        var newProds = _.without(this.prods, prodName)
          , fields = this.determineRequiredFields({
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
          if (!newFields[field.name]) return true
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

      // Except for the initial rendering of the form, this
      // should never be called. Form rerending should be done at 
      // the level of field views. 
      render: function(){
        this.closeChildren();

        var elements = this.collection.map(function(model){

          // if we have a formset, then create a new FormsetView?
          if (model.get('widget') === 'formset') {
            console.log(model);
          }

          var view = new FieldView({ model : model});
          this.children.push(view);
          return view.render().el;
        }, this);

        this.$el.html(elements);

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
          var fieldValid = child.model.validateModel();
          if (fieldValid)
            valid = false; 
        });

        if (valid){
          $('#save-form').addClass('disabled');
          this.collection.saveCollection(); 
        }
      },

      // Sets each model in our form to have the value as
      // found in the field view. 
      parseForm: function(){
        _.each(this.children, function(child){
          var value = child.parseField();

          // we've already set the image model, presumably,
          // to the appropriate value. 
          if (child.model.get('widget') !== 'image')
            child.model.set('value', value);
        });
      },

      // Changes the document type -- e.g., 'Event', 'Idea'
      alterType: function(e){
        this.parseForm();
        var type = $(e.currentTarget).find(':selected').val();
        this.collection.alterTypes(type.toLowerCase()); 
      },

      // Either add or remove the prod from our Prods list
      alterProds: function(e){
        var $checkbox = $(e.currentTarget).find('input')
          , isChecked = $checkbox.attr('checked')
          , name = $checkbox.attr('name'); 

        this.parseForm();
        isChecked 
          ? this.collection.addProd(name) 
          : this.collection.removeProd(name);
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
      },

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

      initialize: function(){
        this.listenTo(this.model, 'invalid', this.render);
        this.listenTo(this.model, 'change:error', this.render);

        if (this.model.get('widget') === 'image')
          this.listenTo(this.model, 'change', this.render);
      },

      render: function() {
        var widget = this.model.get('widget')
          , template;

        if (widget === 'formset'){
          //var formset = new FormsetView({ model: this.model });
          template = '' 
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
      }
    });

    // XXX Experimental view. The idea is to have multiple field collections
    // each with their own form view, and subsequently, with their own field
    // view. The difficulty is determining where these interface with the main
    // form. 
    var FormsetView = Forms.FormsetView = Backbone.View.extend({

      tagName: 'div',
      
      className: 'formsetView',

      events: {
        'click .add-another' : 'addAnother'
      },

      initialize: function(options){
        
        this.views = [];

        // each 
        var collection = new FieldCollection();
        this.fields = fields; 

        // this.fields is our default fields
        var fields = options.model.get('fields');
        this.fields = _.map(fields, function(field, name){
          field.name = name; 
          return new FieldModel(field);
        }, this);

        collection.add(this.fields);

        var view = new FormView({
          collection: collection
        });
        this.views.push(view);

        // this.listenTo(this.collection, 'add', this.render);
        // this.listenTo(this.collection, 'remove', this.render);
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
          return field.clone();
        }, this); 

        var collection = new FieldCollection();
        collection.add(newFields);

        var view = new FormView({
          collection: collection
        });
        this.views.push(view);
        this.render(); 
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


        _.each(formModel, function(obj, key){
          if (! _.has(json, key))
            this.unset(key);
        }, this);

        this.set(json);
        console.log('hello?');

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
      }

    });

})(window, Backbone, _, $, Handlebars);
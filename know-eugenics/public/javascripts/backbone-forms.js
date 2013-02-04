// This should be wrapped in a module

(function(window, Backbone, _, $){

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
          title : { widget: 'text', label: 'Title' , required: true},
          type : { widget: 'select', label: 'Document Type', options: documentTypes },
          shortDescription: {widget: 'text', label: 'Short Description'},
          fullDescription: {widget: 'textarea', label: 'Full Description'},
          image: {widget: 'image', label: 'Image' },
          link: {widget: 'formset', label: 'Link', fields : [{
            widget: 'text', label: 'Link Name', required: true
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
          date: { widget: 'text', label: 'Date (MM/DD/YYYY)', className:'date' },
          startDate : { widget: 'text', label: 'Start Date'},
          endDate : { widget: 'text', label: 'End Date' }
        }
      },

      heroes : function() {
        return {
          heroQuote: { widget: 'text', label: 'Hero Quote', className: 'hero'},
          villainQuote: { widget: 'text', label: 'Villain Quote', className: 'villain'},
          ambiQuote: {widget: 'text', label: 'Ambiguous Quote', className: 'ambiquote'},
          date : { widget: 'text', label: 'Date (MM/DD/YYYY)', className: 'date'}
        }
      }

    };




  // Form Model
  // 
  // Invoked using: 
  // var model = new FormModel({type: 'event', prods: ['timeline'], title: 'my title'});
  // 
  // It will automatically generate any fields that this
  // document needs in order to be displayed/edited. 
  // An empty model can also be invoked for a new document. 
  // 
  // When attributes of FormModel change, generateFields()
  // is called, which generates our... fields! The FormView
  // will need to be created in order to render these fields. 

  var FormModel = Forms.FormModel = Backbone.Model.extend({

    // All forms will include these attributes.

    defaults: {

      type: 'event',
      title: '',
      shortDescription: '',
      fullDescription: '',
      prods: []

    }

  });

  // Field Collection
  var FieldCollection = Forms.FieldCollection = Backbone.Collection.extend({

    initialize: function(options){
      this.formModel = options.model; 
    },

    // Look at our Form Model for the appropriate values. If they are
    // in there, append them to the field. 
    addValuesToFields : function(){

       _.each(this.fields, function(obj, key){

        // If we are dealing with prods, we need to
        // iterate a layer deeper
        if (key === 'prods') {

          _.each(obj[0], function(p, k){
            if (_.contains(this.get('prods'), k)){
              console.log(p);
              p.value = 'checked';
            };
          }, this);

        // Otherwise, populate it as usual. 
        } else if (!_.isUndefined(this.get(key))) {
          obj.value = this.get(key);
        }

      }, this);
    },

    // Creates a collection of fields that correspond
    // either to supplied attributes, or provide the
    // default form attributes for new submission. 
    generateFields : function(){
      var attr = this.formModel.toJSON()
        , fields = fieldTypes.required()
        , toIterate = _.union(attr.type, attr.prods);

      _.each(toIterate, function(req){
        if (fieldTypes[req])
          _.extend(fields, fieldTypes[req]());
      }, this);

      _.each(fields, function(field){
        console.log(field);
        var field = new FieldModel(field);
        this.add(field);
      }, this);

      console.log('hello', this);
      //this.addValuesToFields(); 
      return this; 
    }

  });

  var FormView = Forms.FormView = Backbone.View.extend({

    tagName: 'form',

    className: 'myForm',

    id: 'myForm',

    events: {
      'submit' : 'saveForm',
      'click .prod' : 'alterProds',
      'click .delete' : 'deleteDocument',
      'change select' : 'alterType',
      'click #add-image' : 'addImage',
      'click #change-image' : 'changeImage'
    },

    initialize: function(opt) {
      //this.dataModel = opt.dataModel; 
      this.collection = opt.collection;
      this.listenTo(this.collection, 'change', this.render);
      //this.listenTo(this.dataModel, 'destroy', this.renderDestroyed);
    },

    closeChildren: function(){
      if (this.children){
        _.each(this.children, function(view){
          view.close();
        });
      }
      this.children = [];
      this.formsets = [];
    },

    render : function() {

      this.closeChildren();

     this.collection.map(function(model){
      console.log(model.toJSON());
     });

      var elements = this.collection.map(function(model, key){

        console.log(model.toJSON());

      // Handle formsets
      if (model.get('widget') === 'bformset') {
          var form = [];
          var els = _.map(model.get('fields'), function(obj, i){
            var view = new FieldView({ model : model });
            form.push(view);
            return view.render().el; 
          });
          this.formsets.push(form);
          return els; 

      // Handle regular fields
      } else {
        console.log(model);
        var view = new FieldView({ model: model });
        this.children.push(view);
        return view.render().el; 
      }
    }, this);

      this.$el.html(elements);
      this.$el.append('<input type="submit" id="save-form" class="btn btn-primary" value="Save">');
      if (! this.dataModel.isNew()) {
        this.$el.append('<a id="delete-form" class="delete btn btn-danger pull-right">Delete</a>');
      }

      return this; 
    },

    // If we destroy the database entry, redirect our page
    // to the collection of documents that this belonged to. 
    renderDestroyed : function(){
      var host = window.location.host;
      window.location = 'http://' + host + '/database/' + typeToParam[this.dataModel.get('type')];
    },


    // Each form element is contained within a .form-element
    // div. Each formset is contained within a .formset div. 
    // The checkboxes need to be handled separately.
    parseForm : function() {
      _.each(this.children, function(child){
        var value = child.parseField();
        console.log(child.key, value);
      }, this);
    },


    // Shared function for unsetting certain fields on the date
    // model. It determines which fields should be removed
    // and removes the data associated with them.
    unsetDataModel: function(fields){
      var unique = [];

      // Create an array of fields removed
      for (key in fields) {
        if (!this.model.fields[key])
          unique.push(key);
      }

      // Unset the data model. 
      _.each(unique, function(key){
        this.dataModel.unset(key, {silent: true});
      }, this);
    },

    // When submitting the form, it's parsed, set,
    // and saved. If this is successful, we redirect
    // to the created/edited entry
    saveForm : function(e){
      var self = this; 

      e.preventDefault();
      $('#save-form').addClass('disabled');

      var parsed = this.parseForm();
      console.log(parsed);

      // this.dataModel.set(parsed);

      // this.dataModel.save({}, { success: function(model, xhr, options){
      //   var typeString = typeToParam[self.dataModel.get('type')]
      //     , id = model.id;

      //   var host = window.location.host;
      //   window.location = 'http://' + host + '/database/' + typeString + '/' + id;
     
      // }}); 
    },

    // Deletes an entry (when editing it!)
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

    addImage : function(e) {
      e.preventDefault();
      var self = this; 

      filepicker.pickAndStore({}, {}, function(fpfile){
        this.dataModel.set({image : fpfile});
      });
    },

    changeImage: function(e) {
      console.log('trying to change image');
    },

     // Activated when a prod is either added or removed. Used
    // for adding or removing the necessary fields. 
    alterProds : function(e) {
      var $checkbox = $(e.currentTarget).find('input')
        , isChecked = $checkbox.attr('checked'); 

      this.model.set(this.parseForm());

      // I need to unset attributes that have been removed
      // through deselecting a prod. 
      if (!isChecked) {
        var name = $checkbox.attr('name')
          , fields = fieldTypes[name]();

        this.unsetDataModel(fields);
      }
    },

    // Activated when the Document Type field is changed. This adds
    // or removes the necessary fields associated with the document
    // type. 
    alterType : function(e) {
      var type = $(e.currentTarget).find(':selected').val();
      this.model.set(this.parseForm());
      this.unsetDataModel(fieldTypes[type]);
    },

  });

  // Field Model
  var FieldModel = Forms.FieldModel = Backbone.Model.extend({

  });

  // Field View
  var FieldView = Forms.FieldView = Backbone.View.extend({

    tagName: 'div',

    className: 'form-field',

    render: function(){
      var widget = this.model.get('widget');
      console.log(this.model.toJSON());
      var template = this.fieldmap[widget]({ key: this.key, attr: this.object });
      this.$el.html(template);
      return this; 
    },

    close: function(){
      this.remove();
      this.unbind();
    },

    // Maps widget types to templates that are contained within
    // the DOM. 
    fieldmap :  {
      'textarea' : Handlebars.compile($('#textarea').html()),
      'text' : Handlebars.compile($('#text').html()),
      'checkbox' : Handlebars.compile($('#checkbox').html()),
      'select' : _.template($('#select').html()),
      'image': _.template($('#image').html())
    },

    // Returns the value of each field, with special
    // treatment for checkboxes & select.
    parseField : function(){
      var widget = this.object.widget
        , $input = this.$el.find(':input[name]:enabled');

      if (widget === 'checkbox' && $input.attr('checked'))
        return true;
     
      if (widget === 'select')
        return this.$el.find('option:selected').val().toLowerCase();

      return $input.val();
    }

  });

  // Data Model
  // 
  // This contains the attributes of each document, which will be synced
  // with the server.

  var DataModel = Forms.DataModel = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/documents',

    initialize: function(attr, options){

      var self = this; 

      this.urlRoot = options.urlRoot; 

      this.on('request', this.showSpinner);
      this.on('sync', this.hideSpinner);

      // Build an empty or populated form
      function buildForm(){

        self.formModel = new FormModel(self.toJSON());
        self.fieldCollection = new FieldCollection({model : self.formModel});
        console.log(self.fieldCollection);
        var fv = self.formView = new FormView({
          collection: self.fieldCollection
        });

        fv.render(); 
        $('#form-wrapper').append(fv.el);
      };

      // Only fetch if we are editing a document. 
      if (!this.isNew()) {
        this.fetch({ success: function(res) {
          buildForm(); 
        }});
      } else {
        buildForm(); 
      }

    },

    // Creates a spinner to indicate loading
    // Should be in separate view
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

  window.Forms = Forms; 

})(window, Backbone, _, $);
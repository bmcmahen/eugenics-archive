// This should be wrapped in a module

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
        title : { widget: 'text', label: 'Title' },
        type : { widget: 'select', label: 'Document Type', options: documentTypes },
        shortDescription: {widget: 'text', label: 'Short Description'},
        fullDescription: {widget: 'textarea', label: 'Full Description'},
        image: {widget: 'image', label: 'Image' },
        timeline: {widget: 'checkbox', label: 'Timeline', value: ''},
        heroes: {widget: 'checkbox', label: 'Heroes and Villains', value: ''}
      }
    },

    event : function() {
      return {
        date: { widget: 'text', label: 'Date (MM/DD/YYYY)', className:'date' }
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
        villainQuote: { widget: 'text', label: 'Villain Quote', className: 'villain'}
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

var FormModel = Backbone.Model.extend({

  initialize: function(attributes, options){

    this.on('change', this.generateFields);
    this.generateFields();

  },

  // All forms will include these attributes.

  defaults: {

    type: 'event',
    title: '',
    shortDescription: '',
    fullDescription: '',
    prods: []

  },

  // Creates a collection of fields that correspond
  // either to supplied attributes, or provide the
  // default form attributes for new submission. 

  generateFields : function(){
    
    var attr = this.toJSON()
      , fields = fieldTypes.required()
      , toIterate = _.union(attr.type, attr.prods);

    _.each(toIterate, function(req){
      if (fieldTypes[req])
        _.extend(fields, fieldTypes[req]());
    }, this);

    this.fields = fields; 
    this.addValuesToFields(); 

    return this; 

  },


  // This isn't very efficient, but should be good enough!
  // It loops through our fields and looks through our attributes
  // adding any if they exist. 

  addValuesToFields : function(){

   _.each(this.fields, function(obj, key){

    if (!_.isUndefined(this.get(key))) {
      obj.value = this.get(key);
    } else if (_.contains(this.get('prods'), key)){
      obj.value = 'checked';
    }

   }, this);

  }

});


var FormView = Backbone.View.extend({

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
    this.dataModel = opt.dataModel; 
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.dataModel, 'destroy', this.renderDestroyed);
  
  },

  render : function() {
     var html = [];

    _.each(this.model.fields, function(obj, key){
      var widget = this.fieldmap[obj.widget]({name: key, attr: obj});
      if (typeof widget != 'undefined') {
        html[html.length] = widget; 
      }
    }, this);

    html.push('<input type="submit" id="save-form" class="btn btn-primary" value="Save">');

    this.$el.html(html.join(''));

    if (!this.dataModel.isNew())
      this.$el.append('<a id="delete-form" class="delete btn btn-danger pull-right">Delete</a>');

    return this; 
  },

  // If we destroy the database entry, redirect our page
  // to the collection of documents that this belonged to. 
  
  renderDestroyed : function(){
    var host = window.location.host;
    window.location = 'http://' + host + '/documents/' + typeToParam[this.dataModel.get('type')];
  },

  // This really sucks. I should precompile the templates as functions and then reference
  // them instead of having ugly strings. 

  fieldmap :  {

    'textarea' : _.template('<label for="<%= name %>"><%= attr.label %><textarea id="<%= name %>" name="<%= name %>"><%= attr.value %></textarea></label>'),

    'text' : _.template('<label for="<%= name %>"><%= attr.label %><input id="<%= name %>" type="text" name="<%= name %>" value="<%= attr.value %>"></label>'),

    'checkbox' : _.template('<label class="prod <%= name %>"><input type="checkbox" name="<%= name %>" <%= attr.value %> ><%= attr.label %></label>'),

    'select' : _.template('<label class="<%= name %>"><%= attr.label %><select>' +
                          '<% _.each(attr.options, function(val) { %>' +
                          '<option value="<%= val %>" <% if (val.toLowerCase() == attr.value) { %> selected <% } %> > <%= val %></option> <% }); %>' +
                          '</select></label>'),
    'image': _.template('<% if (attr.value) { %> ' +
                        '<a id="change-image" href="#">Change Image</a>' +
                        '<% } else { %> <a id="add-image" href="#"> Add Image </a> <% } %>')
    
  },

  // This is ugly. But basically, it looks in the DOM for each
  // input element, and creates an object with name/value
  // pairing. 
  parseForm : function() {

    var json = {}
      , prods = [];

    this.$el.find(':input[name]:enabled').each( function(){

      var self = $(this)
        , name = self.attr('name');

      // Treat checkboxes differently
      if (self.is(':checkbox')) {
        if (self.attr('checked')) {
          prods.push(name);
        }
      } else {
        var val = self.val();
        if (val) {
         json[name] = self.val();          
        }
      }

    });

    json.type = this.$el.find('option:selected').val().toLowerCase(); 

    json.prods = prods; 
    return json; 

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
    this.dataModel.set(parsed);

    this.dataModel.save({}, { success: function(model, xhr, options){
      
      var typeString = typeToParam[self.dataModel.get('type')]
        , id = model.id;

      var host = window.location.host;
      window.location = 'http://' + host + '/documents/' + typeString + '/' + id;
   
    }}); 

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
  }

});


// Data Model
// 
// This contains the attributes of each document, which will be synced
// with the server.

var DataModel = Backbone.Model.extend({

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
      var fv = self.formView = new FormView({
        model: self.formModel,
        dataModel: self
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


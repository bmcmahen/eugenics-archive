// XXX To do: 
// 
// 
//  Validation

var confirmation = require('bmcmahen-confirmation');

// The field types that are required by each field type, and 
// each prod. The app uses these to determine what fields
// are necessary to include, depending on the document type
// and the prods that it's part of. 

var fieldTypes = {

    required : function() {
      return {
        title : {widget: 'text', label: 'Title'},
        shortDescription: {widget: 'text', label: 'Short Description'},
        fullDescription: {widget: 'textarea', label: 'Full Description'},
        timeline: {widget: 'checkbox', label: 'Timeline', value: ''},
        heroes: {widget: 'checkbox', label: 'Heroes and Villains', value: ''}
      }
    },

    event : function() {
      return {
        date: { widget: 'text', label: 'Date', className:'date' }
      }
    },

    timeline : function() {
      return {
        date: { widget: 'text', label: 'Date', className:'date' },
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



// 
// 
// Form Model
// 
// Invoked using: 
// var model = new FormModel({type: ['event'], prods: ['timeline'], title: 'my title'});
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

    type: ['event'],
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
    'click .delete' : 'deleteDocument'
  },

  initialize: function(opt) {
    this.dataModel = opt.dataModel; 
    this.listenTo(this.model, 'change', this.render);
  },

  render : function() {
     var html = '';

    _.each(this.model.fields, function(obj, key){
      var widget = this.fieldmap[obj.widget]({name: key, attr: obj});
      if (typeof widget != 'undefined')
        html += widget;
    }, this);

    html += '<input type="submit" class="btn btn-primary" value="Save">';

    this.$el.html(html);
    this.$el.append('<a class="delete btn btn-danger">Delete</a>')
    return this; 
  },

  fieldmap :  {

    'textarea' : _.template('<label for="<%= name %>"><%= attr.label %><textarea id="<%= name %>" name="<%= name %>"><%= attr.value %></textarea></label>'),

    'text' : _.template('<label for="<%= name %>"><%= attr.label %><input id="<%= name %>" type="text" name="<%= name %>" value="<%= attr.value %>"></label>'),

    'checkbox' : _.template('<label class="prod <%= name %>"><%= attr.label %><input type="checkbox" name="<%= name %>" <%= attr.value %> ></label>')
    
  },

  // this... is ugly. 
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

    json.prods = prods; 
    return json; 
  },

  // Activated when a prod is either added or removed. Used
  // for adding or removing the necessary fields. 
  
  alterProds : function(e) {

    var $checkbox = $(e.currentTarget).find('input')
      , isChecked = $checkbox.attr('checked')
      , prods = this.model.get('prods')
      , parsed = this.parseForm(); 

    this.model.set(parsed);

    // I need to unset attributes that have been removed
    // through deselecting a prod. 
  
    if (!isChecked) {

      var name = $checkbox.attr('name')
        , fields = fieldTypes[name]()
        , unique = []; 

      // Create an array of fields removed
    
      for (key in fields){
        if (!this.model.fields[key])
          unique.push(key);
      }
      
      // I'm unsetting the data model. I'm not sure if this
      // is the best approach, as it could complicate validation
      // and logic. 
      
      _.each(unique, function(key){
        this.dataModel.unset(key, {silent: true});
      }, this);
    }

  },

  saveForm : function(e){
    e.preventDefault();
    var parsed = this.parseForm();
    this.dataModel.set(parsed);
    this.dataModel.save(); 
  },

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
        self.dataModel.destroy(); 
      });
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
    this.fetch({ success: function(res){

      self.formModel = new FormModel(self.toJSON());
      self.formView = new FormView({
        model: self.formModel, 
        dataModel: self
      });
      self.formView.render(); 
      $('#form-wrapper').append(self.formView.el);
    }});

    this.on('sync', function(model, resp, options){
     console.log('synced', resp);
    }, this);

    this.on('error', function(){
      console.log('error');
    });

  }

});

// Eventually this sort of thing will go in the Backbone router
// which will be included on every page. This way, if I'm looking at
// a list of documents in regular html, but want to edit one. Then I'll 
// just point the URL to something that triggers a function in backbone
// with a unique identifier. 


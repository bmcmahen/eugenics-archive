// TO DO:
// 
// Bind events to onsubmit, which will need to be done
// after the element is rendered. 
// 
// Parse the form, and perform PUT, POST, DELETE


// I need to create a schema for each type, then determine
// what additional fields are required due to the applications
// tag. I need to dynamically add new fields when an application
// is selected, and then be able to parse that form into an object
// on submission. 

// Dependencies
var events = require('component-events')
  , domify = require('component-domify');

// API
var createForm = function(attributes, requiredFields) {
  attributes = attributes || {};
  required = requiredFields || [];
  return new Formset(attributes, required)
    .determineFields();
};


// Constructor
var Formset = function(attributes, required){
  this.attributes = attributes;
  this.required = required; 

  this.fields = {
    title : {widget: 'text'},
    shortDescription: {widget: 'text'},
    fullDescription: {widget: 'textarea'}
  };

};

// Functions
_.extend(Formset.prototype, {

  // Cycle through (1) Form Types, (2) App Field Requirements
  // and extend the field object with each required type
  // leaving us with one object that contains a list of the required
  // fields. 
  determineFields: function(required) {

    var self = this
      , required = required || this.required; 
    
    _.each(required, function(required){
      _.extend(self.fields, self.requiredFields[required]);
    });

    return this; 

  },

  requiredFields : {

    'event' : {
      date: { widget: 'text', label: 'Date', className:'date' }
    },

    'timeline' : {
      date: { widget: 'text', label: 'Date', className:'date' },
      startDate : { widget: 'text', label: 'Start Date'},
      endDate : { widget: 'text', label: 'End Date' }
    }

  },

  // If we are editing a document, then we need to add values
  // to the appropriate field. 
  addValues : function(){

    var self = this; 

    _.each(this.attributes, function(value, key){
      self.fields[key].value = value; 
    });

  }

});


// Form View
var FormView = function(model) {
  if (!model)
    throw new TypeError('form-view required a form-model');
  
  this.model = model;

};


_.extend(FormView.prototype, {

  // This should eventually use a template system. 
  render : function() {
    var html = '<form id="myform">'
      , fieldMap = {
        'textarea' : '<textarea>a text area</textarea>',
        'text': '<input type="text">'
      };

    _.each(this.model.fields, function(obj, key){
      var widget = fieldMap[obj.widget];
      if (typeof widget != 'undefined')
        html += widget;
    });

    html += '<input type="submit"></form>';
    this.el = html;
    $('#formset').append(this.el);
    this.bind(); 
    return this; 
  },

  bind : function() {
    this.events = events(this.el, this);
    console.log(this.el);
    this.events.bind('onsubmit');
  },

  onsubmit : function() {
    console.log('i submitted it!');
  }
});

var myform = createForm({},['event', 'timeline']);
var myformview = new FormView(myform);
myformview.render(); 

var div = document.getElementById('formset');
div.innerHTML = div; 

console.log(myform, myformview);
// I need to create a schema for each type, then determine
// what additional fields are required due to the applications
// tag. I need to dynamically add new fields when an application
// is selected, and then be able to parse that form into an object
// on submission. 

var Formset = function(attributes){
  var attributes = (attributes || {});

  this.fields = {
    title : {widget: 'text'},
    shortDescription: {widget: 'text'},
    fullDescription: {widget: 'textarea'}
  };

};

_.extend(Formset.prototype, {

  determineFields: function(required) {

    var self = this; 

    // Cycle through (1) Form Types, (2) App Field Requirements
    // and extend the field object with each required type
    // leaving us with one object that contains a list of the required
    // fields. 
    
    _.each(required, function(required){
      _.extend(self.fields, self.requiredFields[required]);
    });

    this.formArray = _.toArray(this.fields);

    return this; 
  },

  requiredFields : {

    'event' : {
      date: { type: 'text', label: 'Date', className:'date' }
    },

    'timeline' : {
      date: { type: 'text', label: 'Date', className:'date' },
      startDate : { type: 'text', label: 'Start Date'},
      endDate : { type: 'text', label: 'End Date' }
    }

  }
  

});
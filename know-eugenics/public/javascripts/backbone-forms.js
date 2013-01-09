
var FormModel = Backbone.Model.extend({

  initialize: function(attributes, options){

    var type = attributes.type || [];
    this.set('type', type);

    var prods = attributes.prods || [];
    this.set('prods', prods);

    this.on('change', this.determineFields);
    this.determineFields();
  },

  defaults: {
    fields : {
      title : {widget: 'text'},
      shortDescription: {widget: 'text'},
      fullDescription: {widget: 'textarea'},
      prods: {
        widget: 'checkbox', 
        options: ['timeline', 'heroes']
      }
    }
  },

  determineFields : function(){
    var fields = this.get('fields')
      , type = this.get('type')
      , prods = this.get('prods')
      , self = this;

    type.push(prods);

    _.each(type, function(req){
      _.extend(fields, self.requiredFields[req]);
    });

    this.set('fields', fields);
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

  addValues : function(){
   // Add values here
  }

});


var FormView = Backbone.View.extend({

  tagName: 'form',

  className: 'myForm',

  id: 'myForm',

  events: {
    'submit' : 'parseForm',
    'click #btn' : 'alterProds'
  },

  initialize: function() {
    console.log('formview initialized');
    this.listenTo(this.model, 'change', this.render);
  },

  render : function() {
     var html = ''
      , fieldMap = {
        'textarea' : '<textarea>a text area</textarea>',
        'text': '<input type="text">',
        'checkbox': '<input type="button" id="btn" value="add timeline">'
      };

    _.each(this.model.get('fields'), function(obj, key){
      var widget = fieldMap[obj.widget];
      if (typeof widget != 'undefined')
        html += widget;
    });

    html += '<input type="submit">';

    this.$el.html(html);
    return this; 
  },

  parseForm : function(e) {
    e.preventDefault();
    console.log('parseform called');
  },

  alterProds : function(e) {
    console.log('add timeline!');
    var prods = this.model.get('prods');
    prods.push('timeline');

    this.model.set(prods);

    // I could also just serialize the form, set the attributes
    // to the data model, and then determine the fields -- 
    // this will then allow me to redraw with the current
    // values, without losing data. [PROBABLY EASIEST APPROACH]
    // 
    // (1) Determine what fields need to be added.
    // (2) Add them to the model? 
    // (3) This will automatically rerender the entire form.
    // What is probably better, is to have a collection of
    // fields -- when a field is added, then that field is appended
    // instead of redrawing the entire form?
  }

});

var formModel = new FormModel({type: ['event'], prods: []});
var formView = new FormView({model: formModel});
formView.render(); 
console.log(formModel, formView);

$('body').append(formView.el);
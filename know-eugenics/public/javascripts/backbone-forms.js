// XXX To do: When forms are removed (switching prod) the values
// aren't actually removed from the model? 


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
    }

  };

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
    'submit' : 'parseForm',
    'click .prod' : 'alterProds'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render : function() {
     var html = '';

    _.each(this.model.fields, function(obj, key){
      var widget = this.fieldmap[obj.widget]({name: key, attr: obj});
      if (typeof widget != 'undefined')
        html += widget;
    }, this);

    html += '<input type="submit" class="btn btn-primary">';

    this.$el.html(html);
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

    console.log('parsing results', json);

    return json; 
  },

  alterProds : function(e) {

    var $checkbox = $(e.currentTarget).find('input')
      , isChecked = $checkbox.attr('checked')
      , prods = this.model.get('prods');

    var parsed = this.parseForm(); 

    // if (isChecked) {
    //   prods.push($checkbox.attr('name'));
    // } else {
    //   // pull
    // }

    this.model.set(parsed);


    // (1) ParseForm and attach value attributes to the model.
    // 
    

    // var prods = this.model.get('prods');
    // prods.push('timeline');

    // this.model.set(prods);

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

var formModel = new FormModel({type: ['event'], prods: [], title: 'my title', shortDescription: 'a short description.'});
console.log(formModel);
var formView = new FormView({model: formModel});
formView.render(); 
// console.log(formModel, formView);

 $('body').append(formView.el);
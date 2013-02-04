var Router = Backbone.Router.extend({

  routes: {
    'database/:doctype/edit/:id' : 'editDocument',
    'database/new' : 'newDocument'
  },

  editDocument: function(doctype, id){
    var urlRoot = '/api/documents/'+ doctype;
    var data = new Forms.DataModel({ _id : id }, {urlRoot : urlRoot});
  },

  newDocument: function(type){
    var urlRoot = '/api/documents/new';
    var data = new Forms.DataModel({}, { urlRoot: urlRoot });
  }

});

var myRouter = new Router();
Backbone.history.start({pushState: true});
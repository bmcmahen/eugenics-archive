var Router = Backbone.Router.extend({

  routes: {
    'documents/:doctype/edit/:id' : 'editDocument',
    'documents/new/:type' : 'newDocument'
  },

  editDocument: function(doctype, id){
    console.log('edit document', doctype, id);
    var urlRoot = '/api/documents/'+ doctype;
    var data = new DataModel({ _id : id }, {urlRoot : urlRoot});
  },

  newDocument: function(type){
    var data = new DataModel([type]);
  }

});

var myRouter = new Router();
Backbone.history.start({pushState: true});
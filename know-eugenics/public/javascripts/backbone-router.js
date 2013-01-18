var Router = Backbone.Router.extend({

  routes: {
    'database/:doctype/edit/:id' : 'editDocument',
    'database/new' : 'newDocument'
  },

  editDocument: function(doctype, id){
    console.log('edit document', doctype, id);
    var urlRoot = '/api/documents/'+ doctype;
    var data = new DataModel({ _id : id }, {urlRoot : urlRoot});
  },

  newDocument: function(type){
    console.log('new document');
    var urlRoot = '/api/documents/new';
    var data = new DataModel({}, { urlRoot: urlRoot });
  }

});

var myRouter = new Router();
Backbone.history.start({pushState: true});
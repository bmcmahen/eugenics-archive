var Documents = require('../database').Document;

// Maps type urls to type
var paramToType = {
  'events' : 'event',
  'ideas' : 'idea',
  'institutions' : 'institution',
  'people' : 'person',
  'places' : 'place',
  'publications' : 'publication'
}

// Maps prod urls to prod
var paramToProd = {
  'heroes-and-villains' : 'heroes',
  'timeline' : 'timeline'
}

var init = function(app){

  // If an id is present in the route, then I'll query for that
  // document and cache it in req.doc

  app.param('id', function(req, res, next, id){
    Documents.findById(id, function(err, doc){
      if (err) {
        next(err);
      } else if (doc) {
        req.doc = doc; 
        next();
      } else {
        next(new Error('failed to load document'));
      }
    }); 
  });

  // If a collection is present in the route, then I map
  // it to the non-pluralized form, and cache it. 
  
  app.param('collection', function(req, res, next, col){
    req.type = paramToType[col];
    next(); 
  });

  app.param('prod', function(req, res, next, prodName){
    console.log(prodName);
    Documents.find({ prods: paramToProd[prodName] })
      .sort({ title: 'asc' })
      .exec(function(err, prods){
        if (err) {
          next(err);
        }
          
        req.prods = prods;
        next();

    });
  });

}; 

module.exports = init; 
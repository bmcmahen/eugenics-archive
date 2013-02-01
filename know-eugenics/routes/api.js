var Documents = require('../database').Document
  , _ = require('underscore'); 

var init = function(app){

  // New Database Documents
  app.post('/api/documents/:doctype', function(req, res){
    
    var content = req.body
      , doc = new Documents(content);

    doc.save(function (err){
      if (!err) {
        res.send(200, doc.toJSON());
      } else {
        res.send(err);
      }
    });

  });


  // Retrieves JSON for document that we are editing
  app.get('/api/documents/:doctype/:id', function(req, res){
    
    if (req.doc) {
      res.send(req.doc);
    }

  });


  // Submits an Edit of the document
  app.put('/api/documents/:doctype/:id', function(req, res){
   
   if (req.doc) {

    _.extend(req.doc, req.body);

    req.doc.save(function(err){
      if (!err)
        return res.send(req.doc);
      return res.send(500);
    });

   }
  
  });


  // Deletes a document
  app.delete('/api/documents/:doctype/:id', function(req, res){

    if (req.doc) {
      req.doc.remove(function (err, doc){
        if (!err) {
          res.send(204);
        } else {
          res.send(500);
        }
      });
    }

  });

  // Heroes and Villains data
  app.get('/api/documents/heroes', function(req, res){
    // query database for heroes documents, and send it back
    Documents.find({prods: 'heroes'}, function(err, docs){
      if (!err)
        res.send(docs);
    });
  });

  // Timeline data
  app.get('/api/documents/timeline', function(req, res){
    Documents.find({prods: 'timeline'}, function(err, docs){
      if (!err)
        res.send(docs);
    });
  });

}

module.exports = init; 
var Documents = require('./database').Document
  , _ = require('underscore'); 

var init = function(app){

  // New Database Documents
  app.post('/api/documents/:doctype', function(req, res){
    
    var content = req.body
      , doc = new Documents(content);

    doc.save(function (err){
      if (!err)
        res.send(201);
      res.send(err);
    });

  });


  // Retrieves JSON for document that we are editing
  app.get('/api/documents/:doctype/:id', function(req, res){
    
    if (req.doc) {
      res.send(doc);
    }

  });


  // Submits an Edit of the document
  app.put('/api/documents/:doctype/:id', function(req, res){
   
   if (req.doc) {

    _.extend(req.doc, req.body);

    req.doc.save(function(err){
      if (!err)
        return res.send(202);
      return res.send(500);
    });

   }
  
  });


  // Deletes a document
  app.delete('/api/documents/:doctype/:id', function(req, res){

    if (req.doc) {
      req.doc.remove(function (err, doc){
        if (!err)
          return res.send(203);
        return res.send(500);
      });
    }

  });

}

module.exports = init; 
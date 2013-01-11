var database = require('./database')
  , paramToModel = require('./routes').paramToModel; 

var init = function(app){

  // New Database Documents
  app.post('/api/documents/:doctype', function(req, res){
    
    var content = req.body
      , doc = new database.event(content);

    doc.save(function (err){
      if (!err)
        res.send(201);
      res.send(err);
    });

  });

  // Retrieves JSON for document that we are editing
  app.get('/api/documents/:doctype/:id', function(req, res){
    
    var doctype = req.params.doctype
      , id = req.params.id
      , Model = paramToModel[doctype]; 

    if (Model) {
      Model.findById(id)
        .lean()
        .select('-created')
        .exec(function (err, doc){
          if (!err) {
            console.log(doc);
            res.send(doc);
          }
        });
    }

  });

  app.put('/api/documents/:doctype/:id', function(req, res){
   
    var doctype = req.params.doctype
      , id = req.params.id
      , Model = paramToModel[doctype];

    delete req.body._id;

    if (Model) {
      Model.findByIdAndUpdate(id, req.body, function(err, doc){
        if (!err)
          res.send(202);
        res.send(500);
      });
    }

  })

}

module.exports = init; 
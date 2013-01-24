/**
 * Database Routes
 *
 * Displays the backend database, used
 * for data entry.
 *
 * Views are in /views/database/...
 * 
 */

var Documents = require('../../database').Document
  , moment = require('moment')
  , sortToArray = require('../../sortOrder');


// Humanize javascript dates
function humanizeDate(jsdate){
  var d = moment(jsdate);
  return d.format('dddd, MMMM Do YYYY, h:mm:ss a');
}

// The routes
// needs to be required, and called w/ app in app.js

var init = function(app){

  // The database greeting page
  
  app.get('/database', function(req, res){
    res.render('database/index', { title: 'Living Archives on Eugenics' });
  });

  // Generating new database entry fields
  
  app.get('/database/new', function(req, res){
     res.render('database/new-document');
  });


  // Returns a collection of documents for the requested
  // model, which is a param in the url. 
  
  app.get('/database/:collection', function(req, res){

    var sort = req.query.sort ? req.query.sort : 'title'
    , sortObject = {};

    sortObject[sort] = req.query.sort === 'created' ? 'desc' : 'asc';

    Documents.find({type: req.type})
      .sort(sortObject)
      .lean()
      .exec(function(err, docs){
        if (!err && docs) {
          res.render('database/document-list', {
            documentType: req.params.collection,
            documents: docs
          });
        }
    });

  });

  // Get a specific document
  
  app.get('/database/:collection/:id', function(req, res){

    if (req.doc) {

    var doc = req.doc.toJSON(); 

    res.render('database/get-document', {
      documentType: req.params.collection,
      fields: sortToArray(doc),
      doc : doc
    });

    } else {
      res.redirect('/database/'+req.params.collection);
    }

  });

  // Render edit view of a database entry
  
  app.get('/database/:collection/edit/:id', function(req, res){

    if (req.doc) {
      res.render('database/edit-document', {
        documentType: req.params.collection,
        doc : req.doc
      });
    }

  });

  // Render a list of documents from a prod
  
  app.get('/database/prods/:prod', function(req, res){

    res.render('database/document-list', {
      documentType: req.params.prod,
      documents: req.prods
    });

  });

};

module.exports = init; 
var database = require('../database')
  , moment = require('moment')
  , sortToArray = require('../sortOrder');

function humanizeDate(jsdate){
  var d = moment(jsdate);
  return d.format('dddd, MMMM Do YYYY, h:mm:ss a');
}

// Maps plural strings to the database name

var paramToModel = exports.paramToModel = {

  'events': database.event,
  'ideas': database.idea,
  'institutions': database.institution,
  'people': database.person,
  'places':database.place,
  'publications':database.publication

};


exports.index = function(req, res){
  res.render('index', { title: 'Living Archives on Eugenics' });
};

// Returns a collection of documents for the requested
// model, which is a param in the url. 
exports.getCollection = function(req, res){

  var Model = paramToModel[req.params.collection];

  if (Model){
    Model.find()
      .lean()
      .limit(40)
      .exec(function(err, docs){
        if (!err) {
          res.render('document-list', {
            documentType: req.params.collection,
            documents: docs
          });
        }
    });
  }
};

exports.getDocument = function(req, res) {
  var Model = paramToModel[req.params.collection];
  if (Model) {
    Model.findById(req.params.id)
      .lean()
      .exec(function(err, doc){
        if (!err) {
          res.render('get-document', {
            documentType: req.params.collection,
            fields : sortToArray(doc),
            doc : doc
          });
        }
      })
  }
};

exports.editDocument = function(req, res){

  var Model = paramToModel[req.params.collection];
  if (Model) {
    Model.findById(req.params.id)
      .lean()
      .exec(function(err, doc){
        if (!err) {
          res.render('edit-document', {
            documentType: req.params.collection,
            doc : doc
          });
        }
      })
  }
 
};


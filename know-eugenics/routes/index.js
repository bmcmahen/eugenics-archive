var Documents = require('../database').Document
  , moment = require('moment')
  , sortToArray = require('../sortOrder');

function humanizeDate(jsdate){
  var d = moment(jsdate);
  return d.format('dddd, MMMM Do YYYY, h:mm:ss a');
}


exports.index = function(req, res){
  res.render('index', { title: 'Living Archives on Eugenics' });
};

// Returns a collection of documents for the requested
// model, which is a param in the url. 

exports.getCollection = function(req, res){

  Documents.find({type: req.type})
    .lean()
    .exec(function(err, docs){
      if (!err && docs) {
        res.render('document-list', {
          documentType: req.params.collection,
          documents: docs
        });
      }
    });

};

exports.getDocument = function(req, res) {

  if (req.doc) {
    res.render('get-document', {
      documentType: req.params.collection,
      fields: sortToArray(doc),
      doc : doc
    });
  }

};

exports.editDocument = function(req, res){

  if (req.doc) {
    res.render('edit-document', {
      documentType: req.params.collection,
      doc : doc
    });
  }
 
};

exports.newDocument = function(req, res){

  console.log('new document called');
  
  res.render('new-document');

}


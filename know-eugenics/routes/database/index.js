/**
 * Database Routes
 *
 * Displays the backend database, used
 * for data entry.
 *
 * Views are in /views/database/...
 *
 */

var Documents = require('../../database').Document,
    Users = require('../../database').User,
    moment = require('moment'),
    sortToArray = require('../../sortOrder'),
    passport = require('passport'),
    generateToken = require('../../accounts/accounts').generateToken,
    sendMail = require('../../accounts/email').sendMail;


// Humanize javascript dates
function humanizeDate(jsdate){
  var d = moment(jsdate);
  return d.format('dddd, MMMM Do YYYY, h:mm:ss a');
}

var requireUser = function(req, res, next){
  if (!req.user) return res.redirect('/auth/login');
  res.locals.currentUser = req.user;
  next();
};

var userOrNull = function(req, res, next){
  res.locals.currentUser = req.user ? req.user : null;
  next();
};

// The routes
var init = function(app){

  // AUTHENTICATION
  // Show our login button / form.
  app.get('/auth/login', userOrNull, function(req, res) {
    res.render('database/login', { title: 'Living Archives on Eugenics' });
  });

  // Logout
  app.get('/auth/logout', userOrNull, function(req, res) {
    req.logout();
    res.redirect('/auth/login');
  });

  // Login using Google oAuth
  // What I need to do is have two different strategies, one
  // for when token is present, and one without token present.
  // The strategy in which token is present will authenticate
  // any user.
  app.get('/auth/login/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
  }));

  // Express will store our email token in req.session.token
  app.get('/auth/login/:token', userOrNull, function(req, res){
    req.session.token = req.params.token;
    res.render('database/login', { title: 'Living Archives on Eugenics' });
  });

  // Google oAuth callback handler
  app.get('/auth/google/return',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function(req, res){
      res.redirect('/database');
    });

  // Invite an new user
  app.post('/auth/newuser', requireUser, function(req, res){
    var email = req.body.email;
    // if the user already exists, let's just send them another email.
    Users.findOne({email: email}, function(err, usr){
      if (!usr) {
        // Create user
        var token = generateToken();
        Users.create({ email: email, token: token }, function(err, user){
          if (!err) send(email, token);
        });
      } else {
        if (!err) send(usr.email, usr.token);
      }
    });

    var send = function(email, token){
      sendMail(email, token, function(err){
        if (!err) return res.redirect('/auth/accounts');
        console.log(err);
      });
    };
  });

  // Render invite user form
  app.get('/auth/accounts', requireUser, function(req, res){
    Users.find({}, function(err, users){
      res.render('database/accounts', { users : users });
    });
  });

  // DATABASE ROUTES

  // Every database route should require a user to be logged in
  app.all('/database/*', requireUser);

  // The database greeting page
  app.get('/database', requireUser, function(req, res){
    res.render('database/index', {
      title: 'Living Archives on Eugenics'
    });
  });

  // Generating new database entry fields
  app.get('/database/new', function(req, res){
     res.render('database/new-document');
  });


  // Returns a collection of documents for the requested
  // model, which is a param in the url.
  app.get('/database/:collection', function(req, res){
    var sort = req.query.sort ? req.query.sort : 'title',
        sortObject = {};

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

  // Render a list of documents from a prod
  app.get('/database/prods/:prod', function(req, res){
    res.render('database/document-list', {
      documentType: req.params.prod,
      documents: req.prods
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


};

module.exports = init;
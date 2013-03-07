
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib')
  , passport = require('passport');

/**
 * Import custom modules
 */

require('./database');


/**
 * Main App Constructor
 */

var app = express();

// Use nib to handle endless, endless prefixes
// It compiles stylus into css
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('scrawny dog'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/styles'
  , dest: __dirname + '/public'
  , debug: true
  , compile : compile
}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Locals (Universal Variables)
 */

app.locals.title = 'LAE Database';


/**
 * Routes
 */

// Database Routes
require('./routes/database')(app);

// Front End Routes
require('./routes/frontend')(app);

// API
require('./routes/api')(app);

// Params (In which I auto cache elements based on url paramaters)
require('./routes/params')(app);

// Authentication
require('./accounts/accounts');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib');

/**
 * Import custom modules
 */

require('./database');


var app = express();

// Use nib to handle endless, endless prefixes
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
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/public'
  , compile : compile
}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Universal Attributes (aka Locals)

app.locals.title = 'LAE Database';

// Router
app.get('/', routes.index);
app.get('/documents/new', routes.newDocument);
app.get('/documents/:collection', routes.getCollection);
app.get('/documents/:collection/edit/:id', routes.editDocument);
app.get('/documents/:collection/:id', routes.getDocument);


// API 
require('./api')(app);
require('./params')(app);


// Params


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


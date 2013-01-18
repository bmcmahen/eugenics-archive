var mongoose = require('mongoose')
  , _ = require('underscore')
  , Schema = mongoose.Schema;


// Connect to our Mongod instance
mongoose.connect('localhost', 'know_eugenics');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("Database connection open");
});


// Database Entry Schema

var documentSchema = new Schema({
  title: String,
  shortDescription: String,
  fullDescription: String,
  created: { type: Date, default: Date.now },
  image: {},
  prods: [],
  type: String,
  date: { type: Date }
}, {strict: false});

exports.Document = mongoose.model('Document', documentSchema);

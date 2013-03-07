var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;


// Connect to our Mongod instance
mongoose.connect('mongodb://nodejitsu_bmcmahen:5kqpm14nbjk7vplkjsb0v8mka5@ds051977.mongolab.com:51977/nodejitsu_bmcmahen_nodejitsudb6683642989');

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
  date: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date }
}, {strict: false});

exports.Document = mongoose.model('Document', documentSchema);


// User Schema for Database Login
var userSchema = new Schema({
  googleId: String,
  name: String,
  email: String,
  emailToken: String
}, {strict: false});

exports.User = mongoose.model('User', userSchema);
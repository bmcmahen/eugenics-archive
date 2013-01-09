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

// Declare Schemas
// 
// Currently strict : false is passed as an option, which allows us
// to set properties that are not defined in the schema. This isn't
// ideal, but makes it easier to append the required fields
// if it's included in an app, like the timeline. 

// These fields will be part of every schema. 
var sharedFields = {
  title : String,
  shortDescription : String,
  fullDescription: String,
  created: { type: Date, default: Date.now },
  image: {},
  applications: []
};


// Base Schema
var sharedSchema = new Schema(sharedFields, { strict : false });

// Places, Ideas, and Institutions
exports.Institution = mongoose.model('Institution', sharedSchema);
exports.Idea = mongoose.model('Idea', sharedSchema);
exports.Places = mongoose.model('Places', sharedSchema);

// Event Schema
var eventSchema = new Schema( 
  _.extend(sharedFields, {
    date: Date
  }), { strict : false }
);

exports.event = mongoose.model('Event', eventSchema); 

// Person Schema
var personSchema = new Schema(
  _.extend(sharedFields, {
    dateOfBirth: Date,
    dateOfDeath: Date
  }), { strict : false }
);

exports.person = mongoose.model('Person', personSchema);


// Publication Schema
var publicationSchema = new Schema(
  _.extend(sharedFields, {
    date: Date,
    author: String,
    publisher: String
  }), { strict : false }
);

exports.publication = mongoose.model('Publication', publicationSchema);


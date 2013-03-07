var crypto = require('crypto'),
		passport = require('passport'),
		Users = require('../database').User,
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Basic Strategy:

// An admin can invite a user by email address. This will create a
// new user account with an email & generated token. This will send an email
// to that user, with the link. We allow the user to sign in using
// Google or Facebook accounts. This should handle authentication. If
// they have the generated token, then we update their user document
// with an OpenId. Then, in the future, if they login and we already
// have their OpenId, we allow them to login.

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	Users.findById(id, function(err, usr) {
		done(err, usr);
	});
});


// Passport Strategies
//
// Google:
// You can login under 3 conditions:
// (1) You can properly authenticate a Google Account.
// (2) The Google Account ID exists in our database.
// (3) You have visited the site with a loginToken that belongs to the user.
passport.use(new GoogleStrategy({
	passReqToCallback: true,
	clientID: '1013795292734.apps.googleusercontent.com',
	clientSecret: 'Ib-YUdtjWgiUqrFPpeGhFmnP',
	callbackURL: 'http://127.0.0.1:3000/auth/google/return'
}, function(req, token, tokenSecret, profile, next) {
	Users.findOne({ '$or' :
			[{ googleId: profile.id }, { loginToken: req.session.token }]
		}, function(err, usr) {
			if (usr && usr.googleId == null) {
				usr.set({ googleId: profile.id, name: profile.displayName });
				usr.save(function(err, usr){
					next(err, usr);
				});
			}
			next(err, usr);
	});
}));

// When inviting a new user, generate a token, add it to the user
// object, and then append it to the link.
// This will allow them to create an account.
var generateToken = exports.generateToken = function() {
	try {
		var buf = crypto.randomBytes(32);
		return buf.toString('hex');
	} catch (ex) {
		return new Error('Failed to generate token');
	}
};


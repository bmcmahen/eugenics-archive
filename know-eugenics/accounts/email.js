var nodemailer = require('nodemailer');

// We use the nodeMailer npm module, and use SendGrid SMTP transport
// to send emails. Currently, we only use this to invite new users.

var smptTransport = exports.smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'SendGrid',
	auth: {
		user: 'bmcmahen',
		pass: 'dfgpxd' // We should store this elsewhere...
	}
});

var mailOptions = exports.mailOptions = function(email, token) {
	var opts = {
		from: 'Living Archives on Eugenics <do-not-reply@eugenicsarchive.ca',
		to: email,
		subject: 'Invitation to access the LAE Database'
	};
	var body = 'You have been invited to access the LAE Database. To access '+
					'the database, please click on the following link, and login '+
					'using your Google Account.\n\n http://living-archives.nodejitsu.com/auth/login/'+
					token;
	opts.text = body;
	return opts;
};

exports.sendMail = function(email, token, next){
	smptTransport.sendMail(mailOptions(email, token), function(err, res){
		next(err, res);
	});
};
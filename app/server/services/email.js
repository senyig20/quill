var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var templatesDir = path.join(__dirname, '../templates');
var emailTemplates = require('email-templates');

var ROOT_URL = process.env.ROOT_URL;

var HACKATHON_NAME = process.env.HACKATHON_NAME;
var EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
var TWITTER_HANDLE = process.env.TWITTER_HANDLE;
var FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

var EMAIL_HOST = process.env.EMAIL_HOST;
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var EMAIL_PORT = process.env.EMAIL_PORT;
var EMAIL_CONTACT = process.env.EMAIL_CONTACT;
var EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
// if(EMAIL_HEADER_IMAGE.indexOf("https") == -1){
//   EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
// }

var NODE_ENV = process.env.NODE_ENV;

var options = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
};

var transporter = nodemailer.createTransport(smtpTransport(options));

var controller = {};

controller.transporter = transporter;

function sendOne(templateName, options, data, callback) {

    if (NODE_ENV === "dev") {
        console.log(templateName);
        console.log(JSON.stringify(data, "", 2));
    }

    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            return callback(err);
        }

        data.emailHeaderImage = EMAIL_HEADER_IMAGE;
        data.emailAddress = EMAIL_ADDRESS;
        data.hackathonName = HACKATHON_NAME;
        data.twitterHandle = TWITTER_HANDLE;
        data.facebookHandle = FACEBOOK_HANDLE;
        template(templateName, data, function (err, html, text) {
            if (err) {
                return callback(err);
            }

            transporter.sendMail({
                from: EMAIL_CONTACT,
                to: options.to,
                subject: options.subject,
                html: html,
                text: text
            }, function (err, info) {
                if (callback) {
                    callback(err, info);
                }
            });
        });
    });
}

controller.sendLaggerEmails = function (users, callback) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Başvurular kapanmak üzere!"
        };

        var locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

        console.log('Sending lagger email to address ' + user.email);
        sendOne('email-lagger', options, locals, function (err, info) {
            if (err) {
                console.log(err);
            }
            if (info) {
                console.log(info.message);
            }
            if (callback) {
                callback(err, info);
            }
        });
    }
};

controller.sendLaggerPaymentEmails = function (users, callback) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Teyitler kapanmak üzere!"
        };

        var locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

        console.log('Sending lagger payment email to address ' + user.email);
        sendOne('email-lagger-payment', options, locals, function (err, info) {
            if (err) {
                console.log(err);
            }
            if (info) {
                console.log(info.message);
            }
            if (callback) {
                callback(err, info);
            }
        });
    }
};


controller.sendSponsorEmails = function (users, callback) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Şirket Tercihleri Açıldı!"
        };

        var locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

        console.log('Sending lagger payment email to address ' + user.email);
        sendOne('email-sponsor', options, locals, function (err, info) {
            if (err) {
                console.log(err);
            }
            if (info) {
                console.log(info.message);
            }
            if (callback) {
                callback(err, info);
            }
        });
    }
};


controller.sendAcceptEmails = function (email, callback) {
    var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] -  Kabul Edildin!"
    };

    var locals = {
        dashUrl: ROOT_URL
    };

    console.log('Sending accepted email to address ' + email);
    sendOne('email-accept', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });
}

controller.sendPaymentEmails = function (email, callback) {
    var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] -  Ödemeni Doğruladık!"
    };

    var locals = {
        dashUrl: ROOT_URL
    };

    console.log('Sending accepted email to address ' + email);
    sendOne('email-payment', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });
}


controller.sendApplicationEmail = function (user, callback) {
    var options = {
        to: user.email,
        subject: "[" + HACKATHON_NAME + "] - Başvurunu Aldık!"
    };

    var locals = {
        nickname: user.nickname,
        dashUrl: ROOT_URL
    };

    sendOne('email-application', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });
}

/**
 * Send a verification email to a user, with a verification token to enter.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendVerificationEmail = function (email, token, callback) {

    var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - E-Postanı Doğrula"
    };

    var locals = {
        verifyUrl: ROOT_URL + '/verify/' + token
    };

    /**
     * Eamil-verify takes a few template values:
     * {
     *   verifyUrl: the url that the user must visit to verify their account
     * }
     */
    sendOne('email-verify', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });

};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordResetEmail = function (email, token, callback) {

    var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Şifre Değişikliği İstendi!"
    };

    var locals = {
        title: 'Şifre Değişikliği İsteği',
        subtitle: '',
        description: 'Birisi (umarız sen!) şifreni değiştirmek için bir istekte bulundu. Eğer ' +
            'bu sen değilsen, bu e-postayı silebilirsin. Link bir saat içinde geçersiz olacak.',
        actionUrl: ROOT_URL + '/reset/' + token,
        actionName: "Şifreni Değiştir"
    };

    /**
     * Eamil-verify takes a few template values:
     * {
     *   verifyUrl: the url that the user must visit to verify their account
     * }
     */
    sendOne('email-link-action', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });

};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordChangedEmail = function (email, callback) {

    var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Şifren Değişti!"
    };

    var locals = {
        title: 'Şifren Değişti',
        body: 'Birisi (umarız sen!) şifreni değiştirdi. Bu e-posta bilgilendirme amaçlı gönderildi.',
    };

    /**
     * Eamil-verify takes a few template values:
     * {
     *   verifyUrl: the url that the user must visit to verify their account
     * }
     */
    sendOne('email-basic', options, locals, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
        }
        if (callback) {
            callback(err, info);
        }
    });

};

module.exports = controller;

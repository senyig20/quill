const path = require('path');
const nodemailer = require('nodemailer');
let aws = require('aws-sdk');

aws.config.loadFromPath('./config.json');

const templatesDir = path.join(__dirname, '../templates');
const emailTemplates = require('email-templates');

const ROOT_URL = process.env.ROOT_URL;

const HACKATHON_NAME = process.env.HACKATHON_NAME;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const TWITTER_HANDLE = process.env.TWITTER_HANDLE;
const FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

const EMAIL_CONTACT = process.env.EMAIL_CONTACT;
const EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
// if(EMAIL_HEADER_IMAGE.indexOf("https") == -1){
//   EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
// }

const NODE_ENV = process.env.NODE_ENV;

let transporter = nodemailer.createTransport({
    service: '"SES-US-EAST-1"', // no need to set host or port etc.
    auth: {
        user: 'AKIA5ZBLDOCV5USKYL56',
        pass: 'BOJKkIfyI099r9WmMPLq+0B2hRpp2DjrnzYCaS5hrIrX'
    }
});

const controller = {};

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
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Başvurular kapanmak üzere!"
        };

        const locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

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
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Teyitler kapanmak üzere!"
        };

        const locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

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
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const options = {
            to: user.email,
            subject: "[" + HACKATHON_NAME + "] - Şirket Tercihleri Açıldı!"
        };

        const locals = {
            name: user.name,
            dashUrl: ROOT_URL
        };

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
    const options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] -  Kabul Edildin!"
    };

    const locals = {
        dashUrl: ROOT_URL
    };

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
};

controller.sendPaymentEmails = function (email, callback) {
    const options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] -  Ödemeni Doğruladık!"
    };

    const locals = {
        dashUrl: ROOT_URL
    };

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
};


controller.sendApplicationEmail = function (user, callback) {
    const options = {
        to: user.email,
        subject: "[" + HACKATHON_NAME + "] - Başvurunu Aldık!"
    };

    const locals = {
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
};

/**
 * Send a verification email to a user, with a verification token to enter.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendVerificationEmail = function (email, token, callback) {

    const options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - E-Postanı Doğrula"
    };

    const locals = {
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

    const options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Şifre Değişikliği İstendi!"
    };

    const locals = {
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

    const options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Şifren Değişti!"
    };

    const locals = {
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

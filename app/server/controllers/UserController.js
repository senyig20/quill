const User = require('../models/User');
const Settings = require('../models/Settings');
const Mailer = require('../services/email');
const Stats = require('../services/stats');

const validator = require('validator');
const moment = require('moment');

const UserController = {};


// Tests a string if it ends with target s
function endsWith(s, test) {
    return test.indexOf(s, test.length - s.length) !== -1;
}

/**
 * Determine whether or not a user can register.
 * @param  {String}   email    Email of the user
 * @param password
 * @param  {Function} callback args(err, true, false)
 * @return {[type]}            [description]
 */
function canRegister(email, password, callback) {

    if (!password || 6 > password.length) {
        return callback({message: "Password must be 6 or more characters."}, false);
    }

    // Check if its within the registration window.
    Settings.getRegistrationTimes(function (err, times) {
        let now;
        if (err) {
            callback(err);
        }

        now = Date.now();

        if (now < times.timeOpen) {
            return callback({
                message: "Registration opens in " + moment(times.timeOpen).fromNow() + "!"
            });
        }

        if (now > times.timeClose) {
            return callback({
                message: "Sorry, registration is closed."
            });
        }

        // Check for emails.
        Settings.getWhitelistedEmails(function (err, emails) {
            let i;
            if (err || !emails) {
                return callback(err);
            }
            for (i = 0; i < emails.length; i++) {
                if (validator.isEmail(email) && endsWith(emails[i], email)) {
                    return callback(null, true);
                }
            }
            // return callback({
            //   message: "Not a valid educational email."
            // }, false);

            // Opt out the educational email check function
            return callback(null, true);
        });

    });
}

/**
 * Login a user given a token
 * @param  {String}   token    auth token
 * @param  {Function} callback args(err, token, user)
 */
UserController.loginWithToken = function (token, callback) {
    User.getByToken(token, function (err, user) {
        return callback(err, token, user);
    });
};

/**
 * Login a user given an email and password.
 * @param  {String}   email    Email address
 * @param  {String}   password Password
 * @param  {Function} callback args(err, token, user)
 */
UserController.loginWithPassword = function (email, password, callback) {

    if (!password || 0 === password.length) {
        return callback({
            message: 'Please enter a password'
        });
    }

    if (!validator.isEmail(email)) {
        return callback({
            message: 'Invalid email'
        });
    }

    User
        .findOneByEmail(email)
        .select('+password')
        .exec(function (err, user) {
            let token;
            let u;
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback({
                    message: "We couldn't find you!"
                });
            }
            if (!user.checkPassword(password)) {
                return callback({
                    message: "That's not the right password."
                });
            }

            // yo dope nice login here's a token for your troubles
            token = user.generateAuthToken();

            u = user.toJSON();

            delete u.password;

            return callback(null, token, u);
        });
};

/**
 * Create a new user given an email and a password.
 * @param  {String}   email    User's email.
 * @param  {String}   password [description]
 * @param confirmpassword
 * @param  {Function} callback args(err, user)
 */
UserController.createUser = function (email, password, confirmpassword, callback) {

    if ("string" !== typeof email) {
        return callback({
            message: "Not a valid email."
        });
    }

    if (password !== confirmpassword) {
        return callback({
            message: "Passwords do not match."
        });
    }


    email = email.toLowerCase();

    // Check that there isn't a user with this email already.
    canRegister(email, password, function (err, valid) {

        if (err || !valid) {
            return callback(err);
        }

        User
            .findOneByEmail(email)
            .exec(function (err, user) {

                let u: *;
                if (err) {
                    return callback(err);
                }

                if (user) {
                    return callback({
                        message: 'An account for this email already exists.'
                    });
                } else {

                    // Make a new user
                    u = new User();
                    u.email = email;
                    u.password = User.generateHash(password);
                    u.save(function (err) {
                        let token;
                        let verificationToken;
                        if (err) {
                            return callback({
                                message: "Not a valid email."
                            });
                        } else {
                            // yay! success.
                            token = u.generateAuthToken();

                            // Send over a verification email
                            verificationToken = u.generateEmailVerificationToken();
                            Mailer.sendVerificationEmail(email, verificationToken);

                            return callback(
                                null,
                                {
                                    token: token,
                                    user: u
                                }
                            );
                        }

                    });

                }

            });
    });
};

UserController.getByToken = function (token, callback) {
    User.getByToken(token, callback);
};

/**
 * Get all users.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
UserController.getAll = function (callback) {
    User.find({}, callback);
};
UserController.sendEmailsToNonConfirmedProfiles = function (callback) {
    User.find({"status.admitted": true, "status.confirmed": false}, 'email nickname', function (err, users) {
        if (err) {
            return callback(err);
        }
        Mailer.sendLaggerPaymentEmails(users);
        return callback(err);
    });
};


UserController.getAllSponsorSubmitted = function (callback) {
    User.find({"confirmation.sponsorSelected": true}, callback);
};

UserController.getAllAdmitted = function (callback) {
    User.find({"status.admitted": true}, callback);
};

UserController.getAllConfirmed = function (callback) {
    User.find({"status.confirmed": true}, callback);
};
UserController.getAllUnpaid = function (callback) {
    User.find({"status.confirmed": true, "status.paymentMade": false}, callback);
};

UserController.getAllFinal = function (callback) {
    User.find({"status.confirmed": true, "status.paymentMade": true}, callback);
};

UserController.getPageCheckedAndSponsor = function (query, callback) {
    let re: *;
    let queries;
    const page = query.page;
    const size = parseInt(query.size);
    const searchText = query.text;

    const findQuery = {};
    if (0 < searchText.length) {
        queries = [];
        re = new RegExp(searchText, 'i');
        queries.push({'profile.name': re});
        queries.push({'status.confirmed': true});
        queries.push({'status.paymentMade': true});
        queries.push({'confirmation.sponsorSelected': true});


        findQuery.$and = queries;
    } else {
        queries = [];
        queries.push({'status.confirmed': true});
        queries.push({'status.paymentMade': true});
        queries.push({'confirmation.sponsorSelected': true});
        findQuery.$and = queries;

    }

    User
        .find(findQuery)
        .sort({
            'profile.name': 'asc'
        })
        .select('+status.admittedBy')
        .skip(page * size)
        .limit(size)
        .exec(function (err, users) {
            if (err || !users) {
                return callback(err);
            }

            User.count(findQuery).exec(function (err, count) {

                if (err) {
                    return callback(err);
                }

                return callback(null, {
                    users: users,
                    page: page,
                    size: size,
                    totalPages: Math.ceil(count / size)
                });
            });

        });
};


UserController.getPageChecked = function (query, callback) {
    let re: *;
    let queries;
    const page = query.page;
    const size = parseInt(query.size);
    const searchText = query.text;

    let findQuery = {};
    if (0 < searchText.length) {
        queries = [];
        re = new RegExp(searchText, 'i');
        queries.push({'profile.name': re});
        queries.push({'status.confirmed': true});
        queries.push({'status.paymentMade': true});


        findQuery.$and = queries;
    } else {
        queries = [];
        queries.push({'status.confirmed': true});
        queries.push({'status.paymentMade': true});
        findQuery.$and = queries;

    }

    User
        .find(findQuery)
        .sort({
            'profile.name': 'asc'
        })
        .select('+status.admittedBy')
        .skip(page * size)
        .limit(size)
        .exec(function (err, users) {
            if (err || !users) {
                return callback(err);
            }

            User.count(findQuery).exec(function (err, count) {

                if (err) {
                    return callback(err);
                }

                return callback(null, {
                    users: users,
                    page: page,
                    size: size,
                    totalPages: Math.ceil(count / size)
                });
            });

        });
};


/**
 * Builds search text queries.
 *
 * @param   {String} searchText the text to search
 * @returns {Object} queries    text queries
 */
function buildTextQueries(searchText) {
    let re: *;
    const queries = [];
    if (0 < searchText.length) {
        re = new RegExp(searchText, 'i');
        queries.push({'email': re});
        queries.push({'profile.name': re});
        queries.push({'profile.school': re});
    }
    return queries;
}

/**
 * Builds status queries.
 * Each key on 'statusFilters' is a status, and the value is a bool.
 *
 * @param   {[type]} statusFilters object with status keys
 * @returns {Object} queries  status queries
 */
function buildStatusQueries(statusFilters) {
    let key;
    let hasStatus;
    let q;
    let queryKey;
    const queries = [];
    for (key in statusFilters) {
        if (statusFilters.hasOwnProperty(key)) {
            // Convert to boolean
            hasStatus = ('true' === statusFilters[key]);
            if (hasStatus) {
                q = {};
                // Verified is a prop on user object
                queryKey = ('verified' === key ? key : 'status.' + key);
                q[queryKey] = true;
                queries.push(q);
            }
        }
    }
    return queries;
}

/**
 * Builds a find query.
 * The root changes according to the following:
 * $and { $or, $and } for text and status queries respectively
 * $or for text queries
 * $and for status queries
 *
 * @param   {[type]} textQueries   text query objects
 * @param   {[type]} statusQueries size of the page
 * @returns {Object} findQuery     query object
 */
function buildFindQuery(textQueries, statusQueries) {
    let queryRoot: Array;
    const findQuery = {};
    if (0 < textQueries.length && 0 < statusQueries.length) {
        queryRoot = [];
        queryRoot.push({'$or': textQueries});
        queryRoot.push({'$and': statusQueries});
        findQuery.$and = queryRoot;
    } else if (0 < textQueries.length) {
        findQuery.$or = textQueries;
    } else if (0 < statusQueries.length) {
        findQuery.$and = statusQueries;
    }
    return findQuery;
}


/**
 * Get a page of users.
 * @param query
 * @param  {Function} callback args(err, {users, page, totalPages})
 */
UserController.getPage = function (query, callback) {
    const page = query.page;
    const size = parseInt(query.size);
    const searchText = query.text;
    const statusFilters = query.statusFilters;

    // Build a query for the search text
    const textQueries = buildTextQueries(searchText);
    // Build a query for each status
    const statusQueries = buildStatusQueries(statusFilters);

    // Build find query
    const findQuery = buildFindQuery(textQueries, statusQueries);

    User
        .find(findQuery)
        .sort({
            'profile.name': 'asc'
        })
        .select('+status.admittedBy')
        .skip(page * size)
        .limit(size)
        .exec(function (err, users) {
            if (err || !users) {
                return callback(err);
            }

            User.count(findQuery).exec(function (err, count) {

                if (err) {
                    return callback(err);
                }

                return callback(null, {
                    users: users,
                    page: page,
                    size: size,
                    totalPages: Math.ceil(count / size)
                });
            });

        });
};

/**
 * Get a user by id.
 * @param  {String}   id       User id
 * @param  {Function} callback args(err, user)
 */
UserController.getById = function (id, callback) {
    User.findById(id, callback);
};

/**
 * Update a user's profile object, given an id and a profile.
 *
 * @param  {String}   id       Id of the user
 * @param  {Object}   profile  Profile object
 * @param  {Function} callback Callback with args (err, user)
 */
UserController.updateProfileById = function (id, profile, callback) {

    // Validate the user profile, and mark the user as profile completed
    // when successful.
    User.validateProfile(profile, function (err) {

        if (err) {
            return callback({message: 'invalid profile'});
        }

        // Check if its within the registration window.
        Settings.getRegistrationTimes(function (err, times) {
            let now;
            if (err) {
                callback(err);
            }

            now = Date.now();

            if (now < times.timeOpen) {
                return callback({
                    message: "Registration opens in " + moment(times.timeOpen).fromNow() + "!"
                });
            }

            if (now > times.timeClose) {
                return callback({
                    message: "Sorry, registration is closed."
                });
            }
        });

        User.findOneAndUpdate({
                _id: id,
                verified: true
            },
            {
                $set: {
                    'lastUpdated': Date.now(),
                    'profile': profile,
                    'status.completedProfile': true
                }
            },
            {
                new: true
            },
            callback);

    });
};

/**
 * Update a user's confirmation object, given an id and a confirmation.
 *
 * @param  {String}   id            Id of the user
 * @param  {Object}   confirmation  Confirmation object
 * @param  {Function} callback      Callback with args (err, user)
 */
UserController.updateConfirmationById = function (id, confirmation, callback) {

    User.findById(id, function (err, user) {

        if (err || !user) {
            return callback(err);
        }

        // Make sure that the user followed the deadline, but if they're already confirmed
        // that's okay.
        if (Date.now() >= user.status.confirmBy && !user.status.confirmed) {
            return callback({
                message: "You've missed the confirmation deadline."
            });
        }

        // You can only confirm acceptance if you're admitted and haven't declined.
        User.findOneAndUpdate({
                '_id': id,
                'verified': true,
                'status.admitted': true,
                'status.declined': {$ne: true}
            },
            {
                $set: {
                    'lastUpdated': Date.now(),
                    'confirmation': confirmation,
                    'status.confirmed': true,
                }
            }, {
                new: true
            },
            callback);

    });
};

/**
 * Decline an acceptance, given an id.
 *
 * @param  {String}   id            Id of the user
 * @param  {Function} callback      Callback with args (err, user)
 */
UserController.declineById = function (id, callback) {

    // You can only decline if you've been accepted.
    User.findOneAndUpdate({
            '_id': id,
            'verified': true,
            'status.admitted': true,
            'status.declined': false
        },
        {
            $set: {
                'lastUpdated': Date.now(),
                'status.confirmed': false,
                'status.declined': true
            }
        }, {
            new: true
        },
        callback);
};

/**
 * Verify a user's email based on an email verification token.
 * @param  {[type]}   token    token
 * @param  {Function} callback args(err, user)
 */
UserController.verifyByToken = function (token, callback) {
    User.verifyEmailVerificationToken(token, function (err, email) {
        User.findOneAndUpdate({
                email: new RegExp('^' + email + '$', 'i')
            }, {
                $set: {
                    'verified': true
                }
            }, {
                new: true
            },
            callback);
    });
};


UserController.sendEmailsToNonCompleteProfiles = function (callback) {
    User.find({"status.completedProfile": false}, 'email nickname', function (err, users) {
        if (err) {
            return callback(err);
        }
        Mailer.sendLaggerEmails(users);
        return callback(err);
    });
};

UserController.sendEmailsToSponsorSelections = function (callback) {
    User.find({ "status.paymentMade": true}, 'email nickname', function (err, users) {
        if (err) {
            return callback(err);
        }
        Mailer.sendSponsorEmails(users);
        return callback(err);
    });
};

UserController.sendEmailsToAdmitted = function (email) {
    Mailer.sendAcceptEmails(email);
};

UserController.sendPaymentVerification = function (email) {
    Mailer.sendPaymentEmails(email);
};


/**
 * Resend an email verification email given a user id.
 */
UserController.sendVerificationEmailById = function (id, callback) {
    User.findOne(
        {
            _id: id,
            verified: false
        },
        function (err, user) {
            let token;
            if (err || !user) {
                return callback(err);
            }
            token = user.generateEmailVerificationToken();
            Mailer.sendVerificationEmail(user.email, token);
            return callback(err, user);
        });
};

/**
 * Password reset email
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
UserController.sendPasswordResetEmail = function (email, callback) {
    User
        .findOneByEmail(email)
        .exec(function (err, user) {
            let token;
            if (err || !user) {
                return callback(err);
            }

            token = user.generateTempAuthToken();
            Mailer.sendPasswordResetEmail(email, token, callback);
        });
};

/**
 * UNUSED
 *
 * Change a user's password, given their old password.
 * @param  {[type]}   id          User id
 * @param  {[type]}   oldPassword old password
 * @param  {[type]}   newPassword new password
 * @param  {Function} callback    args(err, user)
 */
UserController.changePassword = function (id, oldPassword, newPassword, callback) {
    if (!id || !oldPassword || !newPassword) {
        return callback({
            message: 'Bad arguments.'
        });
    }

    User
        .findById(id)
        .select('password')
        .exec(function (err, user) {
            if (user.checkPassword(oldPassword)) {
                User.findOneAndUpdate({
                        _id: id
                    }, {
                        $set: {
                            password: User.generateHash(newPassword)
                        }
                    }, {
                        new: true
                    },
                    callback);
            } else {
                return callback({
                    message: 'Incorrect password'
                });
            }
        });
};

/**
 * Reset a user's password to a given password, given a authentication token.
 * @param  {String}   token       Authentication token
 * @param  {String}   password    New Password
 * @param  {Function} callback    args(err, user)
 */
UserController.resetPassword = function (token, password, callback) {
    if (!password || !token) {
        return callback({
            message: 'Bad arguments'
        });
    }

    if (6 > password.length) {
        return callback({
            message: 'Password must be 6 or more characters.'
        });
    }

    User.verifyTempAuthToken(token, function (err, id) {

        if (err || !id) {
            return callback(err);
        }

        User
            .findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    password: User.generateHash(password)
                }
            }, function (err, user) {
                if (err || !user) {
                    return callback(err);
                }

                Mailer.sendPasswordChangedEmail(user.email);
                return callback(null, {
                    message: 'Password successfully reset!'
                });
            });
    });
};

/**
 * [ADMIN ONLY]
 *
 * Admit a user.
 * @param id
 * @param  {String}   user     User doing the admitting
 * @param  {Function} callback args(err, user)
 */
UserController.admitUser = function (id, user, callback) {
    Settings.getRegistrationTimes(function (err, times) {
        User
            .findOneAndUpdate({
                    _id: id,
                    verified: true
                }, {
                    $set: {
                        'status.admitted': true,
                        'status.admittedBy': user.email,
                        'status.confirmBy': times.timeConfirm
                    }
                }, {
                    new: true
                },
                callback);
    });
};

/**
 * [ADMIN ONLY]
 *
 * Check in a user.
 * @param id
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.checkInById = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'status.checkedIn': true,
                'status.checkInTime': Date.now()
            }
        }, {
            new: true
        },
        callback);
};


/**
 * [ADMIN ONLY]
 *
 * Check in a user.
 * @param id
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.acceptPayment = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'status.paymentMade': true
            }
        }, {
            new: true
        },
        callback);
};
/**
 * [ADMIN ONLY]
 *
 * Check in a user.
 * @param id
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.unacceptPayment = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'status.paymentMade': false
            }
        }, {
            new: true
        },
        callback);
};

/**
 * [ADMIN ONLY]
 *
 * Check out a user.
 * @param id
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.checkOutById = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'status.checkedIn': false
            }
        }, {
            new: true
        },
        callback);
};

/**
 * [ADMIN ONLY]
 *
 * Make user an admin
 * @param id
 * @param  {String}   user     User making this person admin
 * @param  {Function} callback args(err, user)
 */
UserController.makeAdminById = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'admin': true
            }
        }, {
            new: true
        },
        callback);
};

/**
 * [ADMIN ONLY]
 *
 * Remove user as admin
 * @param id
 * @param  {String}   user     User making this person admin
 * @param  {Function} callback args(err, user)
 */
UserController.removeAdminById = function (id, user, callback) {
    User.findOneAndUpdate({
            _id: id,
            verified: true
        }, {
            $set: {
                'admin': false
            }
        }, {
            new: true
        },
        callback);
};


/**
 * [ADMIN ONLY]
 */

UserController.getStats = function (callback) {
    return callback(null, Stats.getUserStats());
};

module.exports = UserController;

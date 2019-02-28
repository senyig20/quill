const _ = require('underscore');
const async = require('async');
const User = require('../models/User');

// In memory stats.
let stats = {};

function calculateStats() {
    const newStats = {
        lastUpdated: 0,

        total: 0,
        demo: {
            schools: {},
            year: {
                '2000': 0,
                '2001': 0,
                '2002': 0,
                '2003': 0,
                '2004': 0,
                'chap': 0,
                'other': 0,

            },
            companiesfirst: {
                'Tercih 1': 0,
                'Tercih 2': 0,
                'Tercih 3': 0,
                'Tercih 4': 0,
            },
            companiessecond: {
                'Tercih 1': 0,
                'Tercih 2': 0,
                'Tercih 3': 0,
                'Tercih 4': 0,

            }
        },

        verified: 0,
        submitted: 0,
        admitted: 0,
        confirmed: 0,
        confirmedMcGill: 0,
        declined: 0,

        openingDinner: 0,
        bbqNight: 0,
        veggie: 0,
        receiptStatus: 0,
        paid: 0,
        checkedIn: 0
    };

    User
        .find({})
        .exec(function (err, users) {
            if (err || !users) {
                throw err;
            }

            newStats.total = users.length;

            async.each(users, function (user, callback) {

                // Grab the email extension
                const email = user.email.split('@')[1];

                // Add to the gender

                // Count verified
                newStats.verified += user.verified ? 1 : 0;

                // Count submitted
                newStats.submitted += user.status.completedProfile ? 1 : 0;

                // Count accepted
                newStats.admitted += user.status.admitted ? 1 : 0;

                // Count confirmed
                newStats.confirmed += user.status.confirmed ? 1 : 0;

                // Count confirmed that are mit
                newStats.confirmedMcGill += user.status.confirmed && email === "robcol.k12.tr" ? 1 : 0;


                // Count declined
                newStats.declined += user.status.declined ? 1 : 0;
                newStats.openingDinner += user.profile.openingChoice === "1" ? 1 : 0;

                newStats.bbqNight += user.profile.bbqChoice === "1" ? 1 : 0;

                newStats.veggie += user.profile.veggie === "1" ? 1 : 0;
                newStats.receiptStatus += user.confirmation.receiptConfirmation ? 1 : 0;
                newStats.paid += user.status.paymentMade ? 1 : 0;

                // Count schools
                if (!newStats.demo.schools[email]) {
                    newStats.demo.schools[email] = {
                        submitted: 0,
                        admitted: 0,
                        confirmed: 0,
                        declined: 0,
                    };
                }
                newStats.demo.schools[email].submitted += user.status.completedProfile ? 1 : 0;
                newStats.demo.schools[email].admitted += user.status.admitted ? 1 : 0;
                newStats.demo.schools[email].confirmed += user.status.confirmed ? 1 : 0;
                newStats.demo.schools[email].declined += user.status.declined ? 1 : 0;

                // Count graduation years

                if (user.confirmation.firstSponsorChoice) {
                    newStats.demo.companiesfirst[user.confirmation.firstSponsorChoice] += 1;
                }
                if (user.confirmation.secondSponsorChoice) {
                    newStats.demo.companiessecond[user.confirmation.secondSponsorChoice] += 1;
                }
                // Dietary restrictions
                if (user.confirmation.dietaryRestrictions) {
                    user.confirmation.dietaryRestrictions.forEach(function (restriction) {
                        if (!newStats.dietaryRestrictions[restriction]) {
                            newStats.dietaryRestrictions[restriction] = 0;
                        }
                        newStats.dietaryRestrictions[restriction] += 1;
                    });
                }


                // Count checked in
                newStats.checkedIn += user.status.checkedIn ? 1 : 0;

                callback(); // let async know we've finished
            }, function () {
                // Transform dietary restrictions into a series of objects
                const restrictions = [];
                _.keys(newStats.dietaryRestrictions)
                    .forEach(function (key) {
                        restrictions.push({
                            name: key,
                            count: newStats.dietaryRestrictions[key],
                        });
                    });
                newStats.dietaryRestrictions = restrictions;

                // Transform schools into an array of objects
                const schools = [];
                _.keys(newStats.demo.schools)
                    .forEach(function (key) {
                        schools.push({
                            email: key,
                            count: newStats.demo.schools[key].submitted,
                            stats: newStats.demo.schools[key]
                        });
                    });
                newStats.demo.schools = schools;


                newStats.lastUpdated = new Date();
                stats = newStats;
            });
        });

}

// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 300000);

const Stats = {};

Stats.getUserStats = function () {
    return stats;
};

module.exports = Stats;

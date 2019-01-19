var mongoose   = require('mongoose'),
    bcrypt     = require('bcrypt-nodejs'),
    validator  = require('validator'),
    jwt        = require('jsonwebtoken');
    JWT_SECRET = process.env.JWT_SECRET;

// define the schema for our admin model
var schema = new mongoose.Schema({


    schoolName: {
      type: String,
      min: 1,
      max: 100,
    },

    schoolEmail: {
      type: String,
      min: 1,
      max: 150,
    },

    numOfPayment: {
      type: String,
      min: 0,
      max: 300
    },
    paymentMade: {
      type: Boolean,
      default: false,
    },
});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

 module.exports = mongoose.model('Payment', schema);

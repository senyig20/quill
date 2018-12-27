require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";
var jwt             = require('jsonwebtoken');
// Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(database, {
    useMongoClient: true,
    /* other options */
});

var UserController = require('../app/server/controllers/UserController');

var user = { email: process.env.ADMIN_EMAIL };

// var id = "5a4944f4a7fdad001459d9df";

var userArray = require('fs').readFileSync('scripts/accepted.txt').toString().split('\n');
var count = 0;
userArray.forEach(function (id) {
  UserController.admitUser( id, user, function() {
    count += 1;
    if (count == userArray.length) {
      console.log("Done")
      console.log(count);
    }
  });
});

// Load the dotfiles.
require('dotenv').load({silent: true});

var express = require('express');

// Middleware!
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// cors configuration
var cors = require('cors');

var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var database = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";

var User = require('./app/server/models/User');
var Settings = require('./app/server/models/Settings');


var app = express();

// Connect to mongodb

mongoose.connect(database, {useMongoClient: true});
app.use(cors());

app.use(morgan('dev'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static(__dirname + '/app/client'));


//Create admin and settings in database.

User
    .findOne({
        email: process.env.ADMIN_EMAIL
    })
    .exec(function (err, user) {
        if (!user) {
            var u = new User();
            u.email = process.env.ADMIN_EMAIL;
            u.password = User.generateHash(process.env.ADMIN_EMAIL);
            u.admin = true;
            u.verified = true;
            u.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });

Settings
    .findOne({})
    .exec(function(err, settings){
        if (!settings){
            var settings = new Settings();
            settings.save();
        }
    });


// Routers =====================================================================

var apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);

require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

// Load the dotfiles.
require('dotenv').load({silent: true});

const express = require('express');

// Middleware!
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const database = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";

const User = require('./app/server/models/User');
const Settings = require('./app/server/models/Settings');


const app = express();

// Connect to mongodb

mongoose.connect(database, {useMongoClient: true});

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
            const u = new User();
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

const apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

const authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);

require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

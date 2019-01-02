# JARC Remixopolis Registration (a fork of techX/Quill)
# Setup
### Quick deploy with Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Deploying locally
Getting a local instance of Quill up and running takes less than 5 minutes! Start by setting up the database. Ideally, you should run MongoDB as a daemon with a secure configuration (with most linux distributions, you should be able to install it with your package manager, and it'll be set up as a daemon). Although not recommended for production, when running locally for development, you could do it like this

```
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1 --nohttpinterface
```

Install the necessary dependencies:
```
npm install
bower install
npm run config
```

Edit the configuration file in `.env` for your setup, and then run the application:
```
gulp server
```

# Updating for the future Remixopolises

### Dashboard Customization
If you’d like to customize the text that users see on their dashboards, edit them at `client/src/constants.js`.

### Branding / Assets
Customize the color scheme and hosted assets by editing `client/stylesheets/_custom.scss`. Don’t forget to use your own email banner, favicon, and logo (color/white) in the `assets/images/` folder as well! (You MIGHT want to upload the banner to the Wordpress site of JA-RC and get the asset from there instead. 

### Application questions
If you want to change the application questions, do as the following:
* Add a new slot in `server/models/User.js` for the questions that you'll need to put in the database.
* Edit `client/views/application/` and `client/views/confirmation/` depending where you need to add the question. Copy-paste an older question, modify the ng-model and add a verifier to the semantic-ui section in the applicationCtrl/confirmationCtrl.js files, depending where your question is going to be. 
* Add your questions to the Admin view as well, edit the files `client/views/admin/user/` and `client/views/admin/users/`
* If you need the stats, recalculate them in `server/services/stats.js` and display them on the admin panel by editing `client/views/admin/stats/`

PS: YOU NEED TO DELETE AND RECOMPILE THE DATABASE WHENEVER YOU CREATE A NEW ITEM IN USER.JS FILE!!!

### Email Templates
To customize the verification and confirmation emails for your event, put your new email templates in `server/templates/` and edit `server/services/email.js`

# JARC
For JARC specific questions and changes, contact Yigit Sen [yigitsen@ja-rc.org][email].

# License
Copyright (c) 2015-2016 Edwin Zhang (https://github.com/ehzhang). Released under AGPLv3. See [`LICENSE.txt`][license] for details.

[contribute]: https://github.com/techx/quill/blob/master/CONTRIBUTING.md
[license]: https://github.com/techx/quill/blob/master/LICENSE.txt
[email]: mailto:quill@hackmit.org
[users]: https://github.com/techx/quill/wiki/Quill-Users

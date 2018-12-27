var cors = require('cors');

var whitelist = require('./cors-whitelist');

module.exports = cors({
  origin: function(origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
});
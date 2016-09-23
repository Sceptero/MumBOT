// Add X credits every Y ms (amount configurable in config.js)

var cfg = require('../config.js');
var utils = require('../utils.js');

module.exports = {
    interval: 60000,
    event: function(context) {
        var db = context.db;

        // iterate through all connected users and add +x credits to those who are registered
        // var users = context.connection.users(); // bugged, doesn't return online users but all seen users
        var users = utils.registeredUsersOnline(context.connection);

        for (var i = 0; i < users.length; i++) {
            var user = users[i];

            db.update({
                id: user.id,
                name: user.name
            }, {
                $inc: {
                    credits: cfg['cpm']
                }
            }, {
                upsert: true
            })
        }
    }
};
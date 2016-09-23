// temp command

var cfg = require('../config.js');

module.exports = {
    interval: 30000,
    event: function(context) {

        var db = context.db;
        console.log('Firing add-credits event!');
        // iterate through all connected users and add +x credits to those who are registered
    }
};
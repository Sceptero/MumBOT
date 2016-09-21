// temp command

var cfg = require('../config.js');

var nedb = require('nedb');



var db = new nedb({
    filename: '../' + cfg['dbFileName'],
    autoload: true
});

module.exports = {
    command: /^!db/,
    action: function(context) {

        var bot = context.connection.user;
        var channel = bot.channel;
        var users = channel.users;

        console.log(context.connection.userByName('peXu'));
    }
};
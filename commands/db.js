// temp command

var cfg = require('../config.js');

module.exports = {
    command: /^!db/,
    action: function(context) {

        var db = context.db;

        var bot = context.connection.user;
        var channel = bot.channel;
        var users = channel.users;

        //console.log(context.connection.userByName('peXu').id);

        // db.update({
        //     id: context.actor.id
        // }, {
        //     $set: {
        //         credits: 10
        //     }
        // });

        // db.remove({}, { multi: true });

    }
};
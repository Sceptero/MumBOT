// temp command

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

        db.find({}, function(err,docs) {
            console.log('hello?');
            for (var i = 0; i < docs.length; i++) {
                console.log('hello?');
                var doc = docs[i];
                
                console.log(doc);

            }
        });

    }
};
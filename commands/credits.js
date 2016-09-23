// check number of your credits

module.exports = {
    command: /^!credits/,
    action: function(context) {

        var db = context.db;

        if (context.actor.id == null) { // command works only on registered users
            context.actor.sendMessage('You have to be registered to use this command.');
            return;
        }

        db.findOne({
            id: context.actor.id
        }, function(err, doc) { // find user who send the message in db
            if (doc == null) {
                db.insert({
                    id: context.actor.id,
                    name: context.actor.name,
                    credits: 0
                })
                context.actor.sendMessage('You have 0 credits.');
            } else {
                context.actor.sendMessage('You have ' + doc.credits + ' credits.');
            }

        });
    }
};
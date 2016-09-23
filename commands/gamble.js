// gamble x of your credits, 50% chance to double the number, 50% chance to lose it

module.exports = {
    command: /^!gamble (-?\d+)/,
    action: function(context, param) {

        var db = context.db;
        param = Number(param);

        if (context.actor.id == null) { // command works only on registered users
            context.actor.sendMessage('You have to be registered to use this command.');
            return;
        }

        if (param < 1) {
            context.actor.sendMessage('You can\'t gamble less than 1 credit');
            return;
        }

        db.findOne({
            id: context.actor.id
        }, function(err, doc) { // find user who send the message in db
            if (doc == null) { // user not yet in db
                db.insert({
                    id: context.actor.id,
                    name: context.actor.name,
                    credits: 0
                })
                context.actor.sendMessage('You don\'t have enough credits.');
            } else if (doc.credits < param) { // not enough credits available
                context.actor.sendMessage('You don\'t have enough credits.');
            } else { // gambling
                if (Math.random() < 0.5) { // win
                    context.actor.channel.sendMessage('Congratulations! ' + context.actor.name + ' just won ' + param + ' credits!');
                } else { // lose
                    context.actor.channel.sendMessage('Ouch! ' + context.actor.name + ' just lost ' + param + ' credits!');
                    param = -param; // negate
                }
                db.update({
                    id: context.actor.id
                }, {
                    $inc: {
                        credits: param
                    }
                });
            }

        });
    }
};
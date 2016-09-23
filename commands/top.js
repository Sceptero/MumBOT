// Show top 5 users and their credits

module.exports = {
    command: /^!top/,
    action: function(context) {

        var db = context.db;

        db.find({}).sort({
            credits: 1
        }).limit(5).exec(function(err, docs) {
            var msg = 'Users with the most credits:';

            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                msg += '<br>' + doc.name + ' - ' + doc.credits;
            }

            context.actor.sendMessage(msg);
        });
    }
}
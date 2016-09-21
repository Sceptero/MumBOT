// Pick one of users on the same channel as the bot

module.exports = {
    command: /^!roll/,
    action: function(context) {
        var channel = context.connection.user.channel;
        var users = channel.users;
        var winners = [];

        for (var i = users.length - 1; i >= 0; i--) {
            var user = users[i];

            // remove bot from potential winners
            if (user.session !== context.connection.user.session)
                winners.push(user);
        }

        if (winners.length < 1) return;

        var random = Math.floor(Math.random() * winners.length);
        winner = winners[random];

        channel.sendMessage('And the winner is... ' + winner.name + '! GZ!');
    }
};
// Send private message to player via bot, syntax: !msg PlayerOne,Player Two,John,Emily: Here goes the message

module.exports = {
    command: /^!msg ([^:]+): (.*)/,
    action: function(context, names, message) {

        names = names.split(',');
        message = '<i>' + message + '</i>'

        for (var i = 0; i < names.length; i++) {
            var name = names[i];

            var user = context.connection.userByName(name);
            if (user) {
                user.sendMessage(message);
            }
        }
    }
};
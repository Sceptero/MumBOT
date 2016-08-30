// TODO

module.exports = {
        command: /!msg ([^:]+): (.*)/,
        action: function( context, names, message ) {

            names = names.split( ',' );

            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                
                var user = context.connection.userByName( name );
                if( user ) {
                    user.sendMessage(message);
                }

                var channel = context.connection.channelByName( name );
                if( channel ) {
                    channel.sendMessage(message);
                }
            }
        }
};

/*
connection.on('message', function(message, actor) {

        actor.sendMessage("I received: '" + message + "'");
        connection.user.channel.sendMessage("I received: '" + message + "'");
    });
*/

"use strict";

var mumble = require('mumble');
var fs = require('fs');

var options = {};
try {
    options = {
        key: fs.readFileSync( 'key.pem' ),
        cert: fs.readFileSync( 'key.pem' )
    };
} catch( e ) {
    console.log( 'Could not load private/public certificate files.' );
    console.log( 'Trying to connect without client certificate.' );
}

var tree = "";
function buildChannelTree(channel, level) {
    for(var i = 0; i < level; i++) {
        tree += "   ";
    }
    tree += "  - " + channel.name + ": ";
    for(var u in channel.users) {
        var user = channel.users[u];
        tree += user.name + ", ";
    }
    tree += "\n";
    for(var c in channel.children) {
        buildChannelTree(channel.children[c], level + 1);
    }
}

var commands = [];
var files = fs.readdirSync( "./commands");
for (var i = 0; i < files.length; i++) {
    commands.push(require('./commands/' + files[i]));
}

console.log(commands);

console.log( 'Connecting' );
mumble.connect( 'mumble://pexu.tk', options, function ( error, connection ) {
    if(error) { throw new Error(error); }
    console.log('Connected');
    connection.on('ready', function() {
        console.log("Ready!");
        buildChannelTree(connection.rootChannel, 0);
        console.log(tree);
        console.log("Those were all channels!");
        console.log("Users:");
        var list = connection.users();
        for(var key in list) {
            var user = list[key];
            console.log("  - " + user.name + " in channel " + user.channel.name);
        }
        console.log("\nThose were all users!");
    });
    
    // Welcome message
    connection.on('user-connect', function(user) {
        console.log("User " + user.name + " connected");
    });
    
    // Handle commands
    connection.on('message', function(message, actor) {
        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];
            
            var match = cmd.command.exec( message );
            if( !match ) {
                continue;
            }

            var params = match.slice(1);
            params.unshift({ message: message, actor: actor, connection: connection });
            cmd.action.apply( null, params );

            return;
        }
    });

    connection.authenticate('MumBOT');
});
"use strict";
var cfg = require('./config.js');

var mumble = require('mumble');
var fs = require('fs');



var options = {};
try {
    options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('key.pem')
    };
} catch (e) {
    console.log('Could not load private/public certificate files.');
    console.log('Trying to connect without client certificate.');
}

var tree = "";

function buildChannelTree(channel, level) {
    for (var i = 0; i < level; i++) {
        tree += "   ";
    }
    tree += "  - " + channel.name + ": ";
    for (var u in channel.users) {
        var user = channel.users[u];
        tree += user.name + ", ";
    }
    tree += "\n";
    for (var c in channel.children) {
        buildChannelTree(channel.children[c], level + 1);
    }
}

var commands = [];
var command;
var files = fs.readdirSync("./commands");
for (var i = 0; i < files.length; i++) {
    if (files[i].endsWith('.js')) {
        try {
            command = require('./commands/' + files[i]);
            if (command == null || command.command == null || command.action == null) throw 'error in command module';
            commands.push(command);
        } catch (ex) {
            console.error('Error occured while loading command: ' + files[i]);
        }
    }
    
}

console.log('Connecting');
mumble.connect(cfg['serverURL'], options, function(error, connection) {
    if (error) {
        throw new Error(error);
    }
    console.log('Connected');
    connection.on('ready', function() {
        console.log("Ready!");
        buildChannelTree(connection.rootChannel, 0);
        console.log(tree);
        console.log("Those were all channels!");
        console.log("Users:");
        var list = connection.users();
        for (var key in list) {
            var user = list[key];
            console.log("  - " + user.name + " in channel " + user.channel.name);
        }
        console.log("\nThose were all users!");
    });

    // Welcome message
    connection.on('user-connect', function(user) {
        user.sendMessage('Welcome, ' + user.name + '!');
    });

    // Handle commands
    connection.on('message', function(message, actor) {
        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];

            var match = cmd.command.exec(message);
            if (!match) {
                continue;
            }

            var params = match.slice(1);
            params.unshift({
                message: message,
                actor: actor,
                connection: connection
            });
            cmd.action.apply(null, params);

            return;
        }
    });

    // authorize
    connection.authenticate(cfg['botName']);
    // set comment
    var comment = '<pre style=" margin-top:12px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">╔═════════════════════════════════════╗</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║               MumBOT                ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:12px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">╚═════════════════════════════════════╝</span></pre>';
    comment += '<pre style=" margin-top:12px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">╔═════════════════════════════════════╗</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║              Komendy:               ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║                                     ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║    !yt [play url/find song/stop]    ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║  !msg users,divided,by,commas: msg  ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║               !bc msg               ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">║                !roll                ║</span></pre>';
    comment += '<pre style=" margin-top:0px; margin-bottom:12px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">╚═════════════════════════════════════╝</span></pre>';
    connection.connection.sendMessage('UserState', {
        session: connection.session,
        actor: connection.session,
        comment: comment
    });
});
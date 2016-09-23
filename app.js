"use strict";
var cfg = require('./config.js');
var utils = require('./utils.js');

var mumble = require('mumble');
var fs = require('fs');
var nedb = require('nedb'),
    db = new nedb({
        filename: cfg['dbFileName'],
        autoload: true
    });



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
    var commands = [],
        command, files = fs.readdirSync("./commands");
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
    connection.on('message', function(message, actor) {
        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];

            var match = cmd.command.exec(message);
            if (!match) {
                continue;
            }

            var params = match.slice(1); // context passed to commands
            params.unshift({
                message: message,
                actor: actor,
                connection: connection,
                db: db
            });
            cmd.action.apply(null, params);

            return;
        }
    });

    // Schedule events
    var events = [],
        event, files = fs.readdirSync("./events");
    for (var i = 0; i < files.length; i++) {
        if (files[i].endsWith('.js')) {
            try {
                event = require('./events/' + files[i]);
                if (event == null || event.interval == null || event.event == null) throw 'error in event module';
                events.push(setInterval(event.event, event.interval, {
                    db: db,
                    connection: connection
                }));
            } catch (ex) {
                console.error('Error occured while loading event: ' + files[i]);
            }
        }

    }

    // authorize
    connection.authenticate(cfg['botName']);

    // set comment
    var comment = [
        '╔═════════════════════════════════════╗',
        '║               MumBOT                ║',
        '╚═════════════════════════════════════╝',
        ' ',
        ' Commands:',
        ' ',
        '  !yt [play/stop/info]',
        '  !msg <i>users,divided,by,commas</i>: <i>msg</i>',
        '  !bc <i>msg</i>',
        '  !roll',
        '  !credits',
        '  !top',
        '  !gamble <i>credits</i>'
    ]

    connection.connection.sendMessage('UserState', {
        session: connection.session,
        actor: connection.session,
        comment: utils.formatComment(comment)
    });
});
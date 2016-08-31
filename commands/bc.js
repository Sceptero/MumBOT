// Broadcast message to all channels, syntax: !bc Here goes the message

function broadcastRecursivly(channel, message) {
    channel.sendMessage(message);
    
    for (var i = 0; i < channel.children.length; i++) {
        broadcastRecursivly(channel.children[i], message);
    }
}

module.exports = {
        command: /!bc (.*)/,
        action: function( context, message ) {
            message = '<b><span style="color:#05ff61; font-size:15px">[SERVER BROADCAST]</span><span style="font-size:15px"> ' + message + '</span></b>'
            broadcastRecursivly(context.connection.rootChannel, message);
        }
};
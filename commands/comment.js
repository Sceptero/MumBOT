// Set BOT's comment, syntax: !comment Here goes the new comment

module.exports = {
        command: /!comment (.*)/,
        action: function(context, comment) {
            context.connection.connection.sendMessage( 'UserState', {
                session: context.connection.session, actor: context.connection.user.session, comment: comment
            });           
        }
};
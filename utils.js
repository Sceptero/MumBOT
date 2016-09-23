module.exports = {

    // formats array of mumble comment lines
    formatComment: function(commentArray) {
        if (commentArray.length < 1) throw 'Incorrect comment array passed to function as argument';
        var formatted = '<pre style=" margin-top:12px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">' + commentArray[0] + '</span></pre>';
        for (var i = 1; i < commentArray.length; i++) {
            var line = commentArray[i];
            formatted += '<pre style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'">' + line + '</span></pre>';

        }
        formatted += '<pre style=" margin-top:0px; margin-bottom:12px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><span style="font-family:\'Courier New,courier\'"></span></pre>';
        return formatted;
    }
};
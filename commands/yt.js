// play music from yt
var ytdl = require('ytdl-core');
var lame = require('lame');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg')

var playing = false, converter, vol = 0.1;

module.exports = {
        command: /!yt (play |stop|vol )(.*)/,
        action: function(context, action, url) {
            action = action.trim();
            url = url.trim().replace(/<(?:.|\n)*?>/gm, '');

                if (action==="vol") {
                    vol = Number(url);
                    return;
                }

                if (playing) {
                    playing = false;
                    converter.unpipe();
                }

                if (action==="play") { // play
                    var dl = ytdl(url)
                        .on('info', function(info, format) {
                            context.connection.user.channel.sendMessage("[YT PLAYER] Now playing: " + info["title"]);
                        });
                    converter = ffmpeg(dl).setFfmpegPath('D:/dev/libs/ffmpeg/bin/ffmpeg.exe').format('mp3').pipe(new lame.Decoder())
                        .on('format', function(format) {
                            playing = true;
                            this.pipe(context.connection.inputStream({
                                channels: format.channels,
                                sampleRate: format.sampleRate,
                                gain: vol
                            }));
                        })
                        .on('finish', function() {
                            playing = false;
                            converter.unpipe();                    
                        });
            } 
        }
};
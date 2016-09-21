// Play music from yt

var cfg = require('../config.js');

var ytdl = require('ytdl-core');
var lame = require('lame');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg')
var ytnode = require('youtube-node');



var playing = false,
    converter, vol = cfg['volume'],
    title;

function playYT(context, param) {
    var dl = ytdl(param, {
            filter: function(format) {
                return format.container == "mp4";
            }
        })
        .on('info', function(info, format) {
            title = info["title"];
            context.connection.user.channel.sendMessage("[YT PLAYER] Now playing: " + title);
        });

    converter = ffmpeg(dl).setFfmpegPath(cfg['ffmpegLocation']).format('mp3').pipe(new lame.Decoder())
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

module.exports = {
    command: /^!yt (play |stop|vol |info)(.*)/,
    action: function(context, action, param) {
        action = action.trim();
        param = param.trim().replace(/<(?:.|\n)*?>/gm, ''); // trim & strip html tags

        // change volume
        if (action === "vol") {
            vol = Number(param);
            return;
        }

        if (action === "info") {
            if (playing)
                context.connection.user.channel.sendMessage("[YT PLAYER] Now playing: " + title);
            return;
        }

        // play song
        if (action === "play") {
            // check if provided param is url or song name
            var reURL = /^(https?:\/\/)?(www\.)?youtu(be\.com\/watch\?|\.be\/).+/; // (youtube.com/watch? || youtu.be/) domains check
            var matchURL = reURL.exec(param.toLowerCase())
            if (matchURL) { // url provided
                playYT(context, param);
            } else { // search term provided
                var yt = new ytnode();
                yt.setKey(cfg['googleAPIKey']);
                yt.addParam('type', 'video');
                yt.search(param, 1, function(er, res) {
                    if (er || !res.items[0]) {
                        console.error(er);
                        return;
                    } else {
                        param = 'https://www.youtube.com/watch?v=' + res.items[0].id.videoId;
                        playYT(context, param);
                    }
                });
            }


        }

        // stop previous song if already playing
        if (playing) {
            playing = false;
            converter.unpipe();
        }
    }
};
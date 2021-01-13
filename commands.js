"use strict";
exports.__esModule = true;
exports.processCommand = void 0;
var processCommand = function (client, msg, usrCmd, usrCmdArgs) {
    if (usrCmd == 'help' || usrCmd == 'tolong') {
        var help = 'List perintah untuk bot KMK ITB:\n\
    \t- `help`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `tolong`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `events`: Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB,\n';
        msg.author.send(help);
        msg.channel.send("List perintah sudah dikirimkan ke DM Discord " + msg.author.username + ".");
    }
};
exports.processCommand = processCommand;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCommand = void 0;
const fs = require("fs");
const events_1 = require("./events");
const commands = [
    {
        commandName: 'help',
        commandDesc: 'Menuliskan perintah-perintah untuk bot KMK ITB.',
    },
    {
        commandName: 'tolong',
        commandDesc: 'Menuliskan perintah-perintah untuk bot KMK ITB.',
    },
    {
        commandName: 'events',
        commandDesc: 'Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.',
    },
    {
        commandName: 'acara',
        commandDesc: 'Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.',
    },
    {
        commandName: 'kenalan',
        commandDesc: 'Menuliskan media-media sosial KMK ITB yang bisa di-follow untuk\
      mendapatkan info tentang KMK ITB :D',
    },
];
const processCommand = (msg, usrCmd, usrCmdArgs) => {
    if (usrCmd == 'help' || usrCmd == 'tolong') {
        let help = 'List perintah untuk bot KMK ITB:\n';
        let i = 0;
        for (const command of commands) {
            if (i++ == 0) {
                help += `\t- \`${command.commandName}\`: ${command.commandDesc}`;
            }
            else {
                help += `\n\t- \`${command.commandName}\`: ${command.commandDesc}`;
            }
            if (command.commandOpts != null) {
                help += `\n\toptions:`;
                for (const opt of command.commandOpts) {
                    help += `\n\t\t‣ \`${opt.optName}\`: ${opt.optName}`;
                }
            }
        }
        msg.author.send(help);
        msg.channel.send(`List perintah sudah dikirimkan ke DM Discord ${msg.author.username}.`);
    }
    else if (usrCmd == 'events' || usrCmd == 'acara') {
        let rawData = fs.readFileSync('data/events.json');
        let datas = JSON.parse(rawData.toString());
        let events = [];
        let sendMsg = 'Acara KMK Mendatang:';
        for (let data of datas) {
            let event = new events_1.Event(data.title, data.date, data.desc);
            events.push(event);
        }
        for (let i = 0; i < events.length; ++i) {
            sendMsg += `\n${i + 1}. ${events[i].getPrintString()}`;
        }
        msg.channel.send(sendMsg);
    }
    else if (usrCmd == 'kenalan') {
        const medsos = {
            medsosName: 'Instagram',
            medsosLink: 'https://www.instagram.com/kmk.itb/',
        };
    }
};
exports.processCommand = processCommand;

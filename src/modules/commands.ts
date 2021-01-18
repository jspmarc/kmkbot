import * as Discord from 'discord.js';
import * as fs from 'fs';
import { Event } from './events';

/* an object with similar key and values as the events.json file */
interface rawEvent {
  title: string;
  date: number;
  desc?: string;
}

interface commandOptions {
  optName: string;
  optDesc: string;
}

interface commandList {
  commandName: string;
  commandDesc: string;
  commandOpts?: commandOptions[];
}

interface medsos {
  medsosName: string;
  medsosLink: string;
}

const commands: commandList[] = [
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
    commandDesc:
      'Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.',
  },
  {
    commandName: 'acara',
    commandDesc:
      'Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.',
  },
  {
    commandName: 'kenalan',
    commandDesc:
      'Menuliskan media-media sosial KMK ITB yang bisa di-follow untuk\n\
      mendapatkan info tentang KMK ITB :D',
  },
];

export const processCommand = (
  msg: Discord.Message,
  usrCmd: string,
  usrCmdArgs?: string[]
) => {
  if (usrCmd == 'help' || usrCmd == 'tolong') {
    let help: string = 'List perintah untuk bot KMK ITB:\n';
    let i = 0;
    for (const command of commands) {
      if (i++ == 0) {
        help += `\t- \`${command.commandName}\`: ${command.commandDesc}`;
      } else {
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
    msg.channel.send(
      `List perintah sudah dikirimkan ke DM Discord ${msg.author.username}.`
    );
  } else if (usrCmd == 'events' || usrCmd == 'acara') {
    let rawData: Buffer = fs.readFileSync('data/events.json');
    let datas: rawEvent[] = JSON.parse(rawData.toString());
    let events: Event[] = [];

    let sendMsg: string = 'Acara KMK Mendatang:';

    for (let data of datas) {
      let event: Event = new Event(data.title, data.date, data.desc);
      events.push(event);
    }

    for (let i = 0; i < events.length; ++i) {
      sendMsg += `\n${i + 1}. ${events[i].getPrintString()}`;
    }

    msg.channel.send(sendMsg);
  } else if (usrCmd == 'kenalan') {
    const medsosList: medsos[] = [
      {
        medsosName: 'Instagram',
        medsosLink: 'https://www.instagram.com/kmk.itb/',
      },
      {
        medsosName: 'Line',
        medsosLink: '',
      },
    ];

    let sendStr: string = '';

    for (let i = 0; i < medsosList.length; ++i) {
      sendStr += `${i + 1}. ${medsosList[i].medsosName}: ${
        medsosList[i].medsosLink
      }`;
    }

    msg.channel.send(sendStr);
  } else {
    msg.channel.send(
      'Perintah tidak dikenali. Gunakan `!help` atau `!tolong`.'
    );
  }
};

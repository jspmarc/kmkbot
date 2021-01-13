import * as Discord from 'discord.js';
import * as fs from 'fs';
import { Event } from './events';

/* an object with similar key and values as the events.json file */
interface rawEvent {
  title: string;
  date: number;
  desc: string;
}

export const processCommand = (
  msg: Discord.Message,
  usrCmd: string,
  usrCmdArgs?: string[]
) => {
  if (usrCmd == 'help' || usrCmd == 'tolong') {
    const help: string =
      'List perintah untuk bot KMK ITB:\n\
    \t- `help`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `tolong`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `events`: Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB,\n\
    \t- `acara`: Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.';
    msg.author.send(help);
    msg.channel.send(
      `List perintah sudah dikirimkan ke DM Discord ${msg.author.username}.`
    );
  } else if (usrCmd == 'events' || usrCmd == 'acara') {
    let rawData: Buffer = fs.readFileSync('./events.json');
    let datas: rawEvent[] = JSON.parse(rawData.toString());
    let events: Event[] = [];

    let sendMsg: string = 'Acara KMK Mendatang:\n';

    for (let data of datas) {
      let event: Event = new Event(data.title, data.date, data.desc);
      events.push(event);
    }

    for (let i = 0; i < events.length; ++i) {
      sendMsg += `${i + 1}. ${events[i].getPrint()}\n`;
    }

    msg.channel.send(sendMsg);
  }
};

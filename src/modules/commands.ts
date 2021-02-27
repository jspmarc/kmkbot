import * as Discord from 'discord.js';
import * as fs from 'fs';
import { Event } from './events';

export const commandPrefix: string = '~';

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
  commandAlias?: string[];
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
    commandAlias: ['man', 'tolong'],
  },
  {
    commandName: 'events',
    commandDesc:
      'Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB.',
    commandAlias: ['acara'],
  },
  {
    commandName: 'kenalan',
    commandDesc:
      'Menuliskan media-media sosial KMK ITB yang bisa di-follow untuk\n\
      mendapatkan info tentang KMK ITB :D',
  },
  {
    commandName: 'rules',
    commandDesc:
      'Menuliskan peraturan dan tata krama dalam menggunakan server KMK ITB',
    commandAlias: ['aturan'],
  },
];

export const processCommand = (
  msg: Discord.Message,
  usrCmd: string,
  usrCmdArgs?: string[]
) => {
  switch (usrCmd) {
    // *** Help command
    case 'help':
    case 'tolong':
    case 'man':
      let help: string = 'List perintah untuk bot KMK ITB:\n';
      let i = 0;
      for (const command of commands) {
        if (i++ == 0) {
          help += `\t- \`${command.commandName}\`: ${command.commandDesc}`;
        } else {
          help += `\n\t- \`${command.commandName}\`: ${command.commandDesc}`;
        }

        if (command.commandAlias != null) {
          help += '\n\t\t Alias/nama lain perintah: ';
          let aliases: string[] = [];
          command.commandAlias.forEach((str: string) => {
            aliases.push(`\`${str}\``);
          });
          help += aliases.join(', ');
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
      break;

    // *** events command
    case 'events':
    case 'acara':
      const rawData: Buffer = fs.readFileSync('data/events.json');
      const datas: rawEvent[] = JSON.parse(rawData.toString());
      let events: Event[] = [];

      let sendMsg: string = 'Acara KMK Mendatang:';

      for (let data of datas) {
        const event: Event = new Event(data.title, data.date, data.desc);
        events.push(event);
      }

      for (let i = 0; i < events.length; ++i) {
        sendMsg += `\n${i + 1}. ${events[i].getPrintString()}`;
      }

      msg.channel.send(sendMsg);
      break;

    // *** Kenalan
    case 'kenalan':
      const medsosList: medsos[] = [
        {
          medsosName: 'Instagram',
          medsosLink: 'https://www.instagram.com/kmk.itb/',
        },
        {
          medsosName: 'Line',
          medsosLink: '@hxa4216y',
        },
      ];

      let sendStr: string = 'Yuk, kenalan sama KMK ITB!';

      for (let i = 0; i < medsosList.length; ++i) {
        sendStr += `\n${i + 1}. ${medsosList[i].medsosName}: ${
          medsosList[i].medsosLink
        }`;
      }

      msg.channel.send(sendStr);
      break;

    // *** Rules
    case 'rules':
    case 'aturan':
      const channelIdPerkenalan: string = '751093758363304087';
      const channelIdRules: string = '751093627177926688';
      const rules: string = [
        `1.    Lakukan perkenalan di kanal <#${channelIdPerkenalan}> dengan format yang ditentukan di channel <#${channelIdRules}>.`,
        `2.    Anggota yang belum memperkenalkan dirinya di saluran perkenalan tidak akan mendapatkan peran dan tidak dapat melihat saluran lainnya.`,
        `3.    Dilarang melakukan tindakan yang mengganggu kenyamanan orang lain.`,
        `4.    Dilarang berkata kasar, mengumpat, dan / atau menghina pengguna lain.`,
        `5.    Dilarang menyebarkan iklan, poster, form, dan ajakan lainnya yang tidak berhubungan dengan KMK ITB.`,
        `6.    Untuk penggunaan kanal suara, harap mengeluarkan suara dengan volume yang wajar. Jika situasi kurang kondusif, harap mematikan mic dan menyalakannya saat ingin berbicara saja.`,
      ].join('\n');

      msg.channel.send(rules);
      break;

    // *** Default action
    default:
      msg.channel.send(
        `Perintah tidak dikenali. Gunakan \`${commandPrefix}help\` atau \`${commandPrefix}tolong\`.`
      );
  }
};

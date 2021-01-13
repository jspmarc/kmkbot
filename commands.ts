import * as Discord from 'discord.js';

export const processCommand = (
  client: Discord.Client,
  msg: Discord.Message,
  usrCmd: string,
  usrCmdArgs?: string[]
) => {
  if (usrCmd == 'help' || usrCmd == 'tolong') {
    const help: string =
      'List perintah untuk bot KMK ITB:\n\
    \t- `help`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `tolong`: Menuliskan perintah-perintah untuk bot KMK ITB,\n\
    \t- `events`: Menuliskan acara-acara mendatang yang akan dilaksanakan oleh KMK ITB,\n';
    msg.author.send(help);
    msg.channel.send(
      `List perintah sudah dikirimkan ke DM Discord ${msg.author.username}.`
    );
  } else if (usrCmd == 'events') {
  }
};

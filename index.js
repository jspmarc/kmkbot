// TODO
// Buat BP
// Nickname

const cari = (str, dicari) => {
  const tempStr = str
  .find((e) => {
  return e.toLowerCase().includes(dicari)
  }).split(':')

  return tempStr[tempStr.length-1].trim();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const channelName = 'perkenalan';
const guildName = 'KMK ITB';
const unassignedRole = 'KMK XX';

const config = {
  clientID: process.env.KMK_BOT_CLIENT_ID,
  clientSecret: process.env.KMK_BOT_SECRET,
  clientToken: process.env.KMK_BOT_TOKEN
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Ini buat auto-assign role berdasarkan angkatan dan jabatan
client.on('message', msg => {
    /*
     * Contoh `field` user
     User {
      id: '290432866284732417',
      username: 'Marrrcy',
      bot: false,
      discriminator: '1563',
      avatar: '16c1c4083d29b2d534537caac6217ab0',
      lastMessageID: '754283360414728244',
      lastMessageChannelID: '754280569214599179',
      flags: UserFlags { bitfield: 0 }
    } */

  // Kalo message dikirim di guildName dan channel channelName
  if (msg.channel.name === channelName && msg.guild.name === guildName) {
    console.log(`Dapat message dari ${msg.author.id}`);
    const content = msg.content;
    const sender = msg.author;
    const msgGuild = msg.guild;
    const member = msgGuild.member(sender);

    let namaLengkap = ""
    let BP = ""
    let angkatan = ""
    try {
      parsedContent = content.split('\n');
      namaLengkap = cari(parsedContent, 'nama lengkap')
      BP = cari(parsedContent, 'divisi');
      angkatan = cari(parsedContent, 'angkatan');
    } catch(e) {
      sender.send('Format perkenalan Anda salah, tolong diperbaiki')
      return;
    }

    const angkatanAngka = parseInt(angkatan.substring(angkatan.length-2, angkatan.length));
    if (isNaN(angkatanAngka)) {
      if (angkatan.toLowerCase().includes('alumni')) {
        angkatan = 'Alumni';
      } else {
        sender.send('Format Anda salah. Harap memasukkan tahun angkatan atau \'alumni\' (tanpa \') jika angkatan 2015 atau sebelumnya');
        return;
      }
    } else {
      angkatan = angkatanAngka;
    }

    // Kalo orang yg ngirim message member dari server guildName
    if (member) {
      let roleAssigned = false;
      const gaPunyaRole = member.roles.cache.find((e) => {
        return e.name === unassignedRole;
      });

      if (gaPunyaRole) {
        const assignedRoleAngkatan = msgGuild.roles.cache.find((e) => {
          return e.name.includes(angkatan);
        });

        if (assignedRoleAngkatan) {
          // Assign role angkatan
          member.roles.add(assignedRoleAngkatan);
          roleAssigned = true;
          // Ilangin role dari member
          member.roles.remove(gaPunyaRole);

        }

        // Ngeset nickname sesuai nama lengkap
        if (roleAssigned) {
          member.setNickname(namaLengkap);
        }
      }
    }
  }
});


client.login(config.clientToken);

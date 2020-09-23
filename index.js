// TODO
// Buat BP
// Nickname

const cari = (str, dicari) => {
  const tempStr = str
    .find((e) => {
      return e.toLowerCase().includes(dicari)
    }).split(':');

  return tempStr[tempStr.length - 1].trim();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const channelName = 'perkenalan';
const guildName = 'KMK ITB';
const unassignedRoleName = 'KMK XX';
const assignedRoleName = 'Member';

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
  // Kalo message dikirim di guildName dan channel channelName
  if (msg.channel.name === channelName && msg.guild.name === guildName) {
    console.log(`Dapat message dari ${msg.author.id}`);
    const content = msg.content;
    const sender = msg.author;
    const msgGuild = msg.guild;
    const member = msgGuild.member(sender);
    let parsedContent;

    let namaLengkap = "";
    //let BP = "";
    let angkatan = "";
    try {
      parsedContent = content.split('\n');
      namaLengkap = cari(parsedContent, 'nama lengkap');
      //BP = cari(parsedContent, 'divisi');
      angkatan = cari(parsedContent, 'angkatan');
    } catch (e) {
      sender.send('Format perkenalan Anda salah, tolong diperbaiki');
      console.log(e);
      msg.delete();
      return;
    }

    const angkatanAngka = parseInt(angkatan.substring(angkatan.length - 2, angkatan.length));
    if (isNaN(angkatanAngka)) {
      if (angkatan.toLowerCase().includes('alumni')) {
        angkatan = 'Alumni';
      } else {
        sender.send('Format Anda salah. Harap memasukkan tahun angkatan atau \'alumni\' (tanpa \') jika angkatan 2015 atau sebelumnya');
        msg.delete();
        return;
      }
    } else {
      angkatan = angkatanAngka;
    }

    // Kalo orang yg ngirim msg member dari server guildName
    if (member) {
      let roleAssigned = false;
      const gaPunyaRole = member.roles.cache.find((e) => {
        return e.name === unassignedRoleName;
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
          member.roles.add(msgGuild.roles.cache.find((e) => {
            return e.name === assignedRoleName;
          }));
        }
      }
    }
  }
});

// Buat autoassign role ketika join
client.on('guildMemberAdd', (member) => {
  member.roles.add(member.guild.roles.cache.find((e) => {
    return e.name === 'KMK XX';
  }));

  member.send('Selamat datang di server Discord KMK ITB!\n\
  Silakan perkenalan ke server discord dengan format: \n\
              > - Nama lengkap:\n\
              > - Nama panggilan:\n\
              > - Fakultas/Jurusan:\n\
              > - Angkatan:\n\
              > - Divisi:\n\
              > * Bagian divisi hanya diisi jika menjadi staff/BP\n\n\
  Contoh:\n\
              > - Nama lengkap: Bot KMK\n\
              > - Nama panggilan: Bot\n\
              > - Fakultas/Jurusan: STEI/Teknik Informatika\n\
              > - Angkatan: 2020\n\
              > - Divisi: BRT\n\n\
  Ditunggu ngeramein dan asik-asikan di Discord KMK ITB!');
});

client.login(config.clientToken);

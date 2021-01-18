'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const command = require("./modules/commands");
/* *** Function declarations *** */
/* START */
const cari = (str, dicari) => {
    const tempStr = str
        .find((e) => {
        return e.toLowerCase().includes(dicari);
    })
        .split(':')[1]
        .trim();
    return tempStr;
};
const splitName = (name) => {
    const maxLength = 32;
    let thatNameArr = name.split(' ');
    let currentLength = name.length;
    let i = thatNameArr.length - 1;
    while (currentLength > maxLength && i > 0) {
        currentLength -= thatNameArr[i].length - 2;
        thatNameArr[i] = thatNameArr[i].slice(0, 1).toUpperCase() + '.';
        i--;
    }
    let thatName = thatNameArr.join(' ');
    if (currentLength > maxLength) {
        thatName = thatName.slice(0, maxLength - 3) + '...';
    }
    return thatName;
};
/* END */
/* *** Config declarations *** */
/* START */
const client = new Discord.Client();
const channelIdPerkenalan = '751093758363304087'; // real channel
//const channelIdPerkenalan: string = '789181644166135808'; // testing channel
const guildName = 'KMK ITB';
const unassignedRoleName = 'KMK XX';
const assignedRoleName = 'Member';
const config = {
    clientID: process.env.KMK_BOT_CLIENT_ID,
    clientSecret: process.env.KMK_BOT_SECRET,
    clientToken: process.env.KMK_BOT_TOKEN,
    guildID: process.env.KMK_GUILD_ID,
};
/* END */
/**
 * Ini buat auto-assign role berdasarkan angkatan dan jabatan
 * *** START ***
 */
client.on('message', (msg) => {
    // Kalo message dikirim di guildName dan channel channelIdPerkenalan
    if (msg.channel.id == channelIdPerkenalan && msg.guild.name == guildName) {
        console.log(`Dapat message perkenalan dari ${msg.author.username} (${msg.author.id}) di ${msg.channel.id}`);
        console.log('================================================');
        const content = msg.content;
        const sender = msg.author;
        const msgGuild = msg.guild;
        const member = msgGuild.member(sender);
        let namaLengkap;
        let angkatan;
        let parsedContent;
        try {
            parsedContent = content.split('\n');
            namaLengkap = splitName(cari(parsedContent, 'nama lengkap'));
            angkatan = cari(parsedContent, 'angkatan');
        }
        catch (e) {
            sender.send('Format perkenalan Anda salah, tolong diperbaiki');
            console.log(`Message yang diberikan: ${msg.content}`);
            console.log(`Pengirim message: ${msg.author.username} (${msg.author.id})`);
            console.log('Error yang didapat: ');
            console.log(e);
            msg
                .delete()
                .then(() => {
                console.log('Pesan sudah dihapus.');
                console.log('================================================');
            })
                .catch((e) => {
                console.log('Gagal menghapus pesan yang dikirim.');
                console.log('Error:');
                console.log(e);
                console.log('================================================');
            });
            return;
        }
        const angkatanAngka = parseInt(angkatan.substring(angkatan.length - 2, angkatan.length));
        if (isNaN(angkatanAngka)) {
            if (angkatan.toLowerCase().includes('alumni')) {
                angkatan = 'Alumni';
            }
            else {
                sender.send('Format Anda salah. Harap memasukkan tahun angkatan Anda.');
                msg
                    .delete()
                    .then(() => {
                    console.log('Pesan sudah dihapus.');
                    console.log('================================================');
                })
                    .catch((e) => {
                    console.log('Gagal menghapus pesan yang dikirim.');
                    console.log('Error:');
                    console.log(e);
                    console.log('================================================');
                });
                return;
            }
        }
        else {
            angkatan = angkatanAngka >= 2016 ? angkatanAngka.toString() : 'Alumni';
        }
        // Kalo orang yg ngirim msg member dari server guildName
        if (member) {
            let isRoleAssigned = false;
            const gaPunyaRole = member.roles.cache.find((e) => {
                return e.name == unassignedRoleName;
            });
            if (gaPunyaRole) {
                const assignedRoleAngkatan = msgGuild.roles.cache.find((e) => {
                    return e.name.includes(angkatan);
                });
                if (assignedRoleAngkatan /* Kalo role-nya ada */) {
                    // Assign role angkatan
                    member.roles.add(assignedRoleAngkatan);
                    isRoleAssigned = true;
                    // Ilangin role dari member
                    member.roles.remove(gaPunyaRole);
                    // Ngeset nickname sesuai nama lengkap
                    member.setNickname(namaLengkap);
                    member.roles.add(msgGuild.roles.cache.find((e) => {
                        return e.name == assignedRoleName;
                    }));
                }
                else {
                    sender.send('Format Anda salah. Harap memasukkan tahun angkatan Anda.');
                    msg
                        .delete()
                        .then(() => {
                        console.log('Pesan sudah dihapus.');
                        console.log('================================================');
                    })
                        .catch((e) => {
                        console.log('Gagal menghapus pesan yang dikirim.');
                        console.log('Error:');
                        console.log(e);
                        console.log('================================================');
                    });
                    return;
                }
                console.log(`Dah ngasih role ${assignedRoleAngkatan} dan ${assignedRoleName} ke ${msg.author.username} (${msg.author.id}).`);
            }
            else {
                console.log(`${msg.author.username} (${msg.author.id}) sudah punya role.`);
            }
        }
        console.log('================================================');
    }
});
// *** END ***
/**
 * Buat autoassign role ketika join
 * *** START ***
 */
client.on('guildMemberAdd', (member) => {
    member.roles.add(member.guild.roles.cache.find((e) => {
        return e.name == 'KMK XX';
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
    console.log(`New member, ${member.user.username} (${member.id})`);
});
// *** END ***
client.on('message', (msg) => {
    if (msg.guild == null && msg.author.id != config.clientID) {
        console.log(`Dapat message dari ${msg.author.username} (${msg.author.id}) di DM.`);
        msg.author.send('Terima kasih sudah menghubungi bot KMK ITB. Jika anda memiliki pertanyaan atau saran mengenai bot ini dan/atau server Discord KMK ITB, mohon hubungi admin dengan Line ID: otong1403.');
    }
});
client.on('message', (msg) => {
    if (msg.guild != null &&
        msg.author.id != config.clientID &&
        msg.content.startsWith(command.commandPrefix, 0)) {
        console.log(`Dapat message perintah dari ${msg.author.username} (${msg.author.id}) di ${msg.guild.name} channel ${msg.channel.id}.`);
        const usrMsg = msg.content.slice(1).split(' ');
        const usrCmd = usrMsg[0];
        const usrCmdArgs = usrMsg.slice(1);
        command.processCommand(msg, usrCmd, usrCmdArgs);
    }
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(config.clientToken);

'use strict';
exports.__esModule = true;
var Discord = require("discord.js");
var command = require("./commands");
/* *** Function declarations *** */
/* START */
var cari = function (str, dicari) {
    var tempStr = str
        .find(function (e) {
        return e.toLowerCase().includes(dicari);
    })
        .split(':')[1]
        .trim();
    return tempStr;
};
var splitName = function (name) {
    var maxLength = 32;
    var thatNameArr = name.split(' ');
    var currentLength = name.length;
    var i = thatNameArr.length - 1;
    while (currentLength > maxLength && i > 0) {
        currentLength -= thatNameArr[i].length - 2;
        thatNameArr[i] = thatNameArr[i].slice(0, 1).toUpperCase() + '.';
        i--;
    }
    var thatName = thatNameArr.join(' ');
    if (currentLength > maxLength) {
        thatName = thatName.slice(0, maxLength - 3) + '...';
    }
    return thatName;
};
/* END */
/* *** Config declarations *** */
/* START */
var client = new Discord.Client();
var channelIdPerkenalan = '751093758363304087'; // real channel
//const channelIdPerkenalan: string = '789181644166135808'; // testing channel
var guildName = 'KMK ITB';
var unassignedRoleName = 'KMK XX';
var assignedRoleName = 'Member';
var commandPrefix = '!';
var config = {
    clientID: process.env.KMK_BOT_CLIENT_ID,
    clientSecret: process.env.KMK_BOT_SECRET,
    clientToken: process.env.KMK_BOT_TOKEN,
    guildID: process.env.KMK_GUILD_ID
};
/* END */
/**
 * Ini buat auto-assign role berdasarkan angkatan dan jabatan
 * *** START ***
 */
client.on('message', function (msg) {
    // Kalo message dikirim di guildName dan channel channelIdPerkenalan
    if (msg.channel.id == channelIdPerkenalan && msg.guild.name == guildName) {
        console.log("Dapat message dari " + msg.author.username + " (" + msg.author.id + ") di " + msg.channel.id);
        console.log('================================================');
        var content = msg.content;
        var sender = msg.author;
        var msgGuild = msg.guild;
        var member = msgGuild.member(sender);
        var namaLengkap = void 0;
        var angkatan_1;
        var parsedContent = void 0;
        try {
            parsedContent = content.split('\n');
            namaLengkap = splitName(cari(parsedContent, 'nama lengkap'));
            angkatan_1 = cari(parsedContent, 'angkatan');
        }
        catch (e) {
            sender.send('Format perkenalan Anda salah, tolong diperbaiki');
            console.log("Message yang diberikan: " + msg.content);
            console.log("Pengirim message: " + msg.author.username + " (" + msg.author.id + ")");
            console.log('Error yang didapat: ');
            console.log(e);
            msg["delete"]();
            console.log('Pesan sudah dihapus.');
            return;
        }
        var angkatanAngka = parseInt(angkatan_1.substring(angkatan_1.length - 2, angkatan_1.length));
        if (isNaN(angkatanAngka)) {
            if (angkatan_1.toLowerCase().includes('alumni')) {
                angkatan_1 = 'Alumni';
            }
            else {
                sender.send("Format Anda salah. Harap memasukkan tahun angkatan atau 'alumni' (tanpa ') jika Anda merupakan alumni KMK angkatan 2015 atau sebelumnya.");
                msg["delete"]();
                console.log('Pesan sudah dihapus.');
                return;
            }
        }
        else {
            angkatan_1 = angkatanAngka.toString();
        }
        // Kalo orang yg ngirim msg member dari server guildName
        if (member) {
            var isRoleAssigned = false;
            var gaPunyaRole = member.roles.cache.find(function (e) {
                return e.name == unassignedRoleName;
            });
            if (gaPunyaRole) {
                var assignedRoleAngkatan = msgGuild.roles.cache.find(function (e) {
                    return e.name.includes(angkatan_1);
                });
                if (assignedRoleAngkatan /* Kalo role-nya ada */) {
                    // Assign role angkatan
                    member.roles.add(assignedRoleAngkatan);
                    isRoleAssigned = true;
                    // Ilangin role dari member
                    member.roles.remove(gaPunyaRole);
                }
                // Ngeset nickname sesuai nama lengkap
                if (isRoleAssigned) {
                    member.setNickname(namaLengkap);
                    member.roles.add(msgGuild.roles.cache.find(function (e) {
                        return e.name == assignedRoleName;
                    }));
                }
            }
            else {
                console.log(msg.author.username + " (" + msg.author.id + ") sudah punya role.");
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
client.on('guildMemberAdd', function (member) {
    member.roles.add(member.guild.roles.cache.find(function (e) {
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
});
// *** END ***
client.on('message', function (msg) {
    if (msg.guild == null && msg.author.id != config.clientID) {
        console.log("Dapat message dari " + msg.author.username + " (" + msg.author.id + ") di DM.");
        msg.author.send('Terima kasih sudah menghubungi bot KMK ITB. Jika anda memiliki pertanyaan atau saran mengenai bot ini dan/atau server Discord KMK ITB, mohon hubungi admin dengan Line ID: otong1403.');
    }
});
client.on('message', function (msg) {
    if (msg.guild != null &&
        msg.author.id != config.clientID &&
        msg.content.startsWith(commandPrefix, 0)) {
        console.log("Dapat message dari " + msg.author.username + " (" + msg.author.id + ") di " + msg.guild.name + " channel " + msg.channel.id + ".");
        var usrMsg = msg.content.slice(1).split(' ');
        var usrCmd = usrMsg[0];
        var usrCmdArgs = usrMsg.slice(1);
        command.processCommand(client, msg, usrCmd, usrCmdArgs);
    }
});
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
client.login(config.clientToken);

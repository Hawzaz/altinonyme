const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./cfg.json");
const fs = require('fs');

function timeNow()
{
    const d = new Date();
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let i = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
    i += " à " + d.toLocaleTimeString('fr', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Paris'
    });
    return i;
}

let time;
let tmp;
let logs;

bot.on('ready', () => {
    console.log('Connected and ready.');
});

bot.on('message', (msg) => {

    if (msg.author.bot) return;

    if (msg.mentions.has(bot.user) && !msg.content.includes("[anonyme]"))
        msg.channel.send("usage : [anonyme] *votre message*");

    if (msg.content.includes("[anonyme]"))
    {
        time = timeNow();
        tmp = msg.content;
        logs = tmp = tmp.replace('[anonyme]', '').trim();
        tmp = "**Message posté anonymement**\n" + tmp
        if (msg.attachments.size) {
            for (const attachment of msg.attachments.values()) {
                msg.channel.send(tmp, attachment.filesize > 8000000 ? attachment.url : { files: [attachment.url] });
            }
        }
        else
        {
            try {
                msg.channel.send(tmp);
            } catch (err) {
                console.warn('Erreur : remplacement impossible.');
                console.warn(err);
            }
        }
        msg.delete({ timeout: 10 })
        .then(message => bot.channels.cache.get(config.channelid).send(`*Posté par ${msg.author}, le ${time}, dans le canal ${msg.channel}*\n\`${logs}\``))
        .catch(console.error);
    }
});

bot.on('error', err => {
   console.warn(err);
});

bot.login(config.token);
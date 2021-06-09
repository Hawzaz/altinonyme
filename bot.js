const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./cfg.json");
const fs = require('fs');

// const channel = bot.channels.cache.find(channel => channel.name === "logs");

function timeNow()
{
	var d = new Date();
	i = d.toLocaleTimeString();
	return i;
}

var time;
var tmp;
var logs;

bot.on('ready', () => {
	console.log('Connected and ready.');
});

bot.on('message', (msg) => {
	if (msg.author.bot) return;

	if (msg.content.includes("[anonyme]"))
	{
		time = timeNow();
		logs = tmp = msg.content;
		tmp = tmp.replace('[anonyme]', '');
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
		.then(message => bot.channels.cache.get(config.channelid).send('[' + time + ']' + ' ' + msg.author.username + ' : ' + logs))
		.catch(console.error);
	}
});

bot.on('error', err => {
   console.warn(err);
});

bot.login(config.token);
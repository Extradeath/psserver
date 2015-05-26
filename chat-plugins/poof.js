const messages = [
	"was bullied too much by Yuuki!",
	"was warned too much by BT for RP!",
	"used Explosion!",
	"got lost in a sea of Muk!",
	"jumped into the portal to the Distortion World!",
	"has left this mess!",
	"got derped out of the room!",
	"fell asleep on skype cuddling their sword!",
	"is going to pull a Zenji!",
	"rode off on Mega Latias into the distance!",
	"just got rek't by Vaporeon!",
	"was sucked into a whirlpool!",
	"got scared of Phelan and ran away!",
	"got eaten by a swarm of Carvanha!",
	"was banished to the Shadow Realm!",
	"has a terrible ladder ranking!",
	"was kidnapped by Darkrai!",
];

exports.commands = {
	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (room.id !== 'lobby') return false;
		var message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0)
			message = '{{user}} ' + message;
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		var colour = '#' + [1, 1, 1].map(function () {
			var part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong></center>');
		user.lastPoof = Date.now();
		user.lastPoofMessage = message;
		user.disconnectAll();
	},

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	}
};

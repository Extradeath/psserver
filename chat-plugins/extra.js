exports.commands = {
	k: 'kick',
	kick: function (target, room, user) {
		if (!this.can('kick', targetUser, room)) return false;
		if (!this.canTalk()) return false;
		if (!target) return this.sendReply("Usage: /kick [user], [reason]");
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User " + this.targetUsername + " not found.");
		var msg = "kicked by " + user.name + (target ? " (" + target + ")" : "") + ".";
		this.addModCommand(targetUser.name + " was " + msg);
		targetUser.popup("You have been " + msg);
		targetUser.leaveRoom(room.id);
	},

	dm: 'daymute',
	daymute: function (target, room, user) {
		if (!target) return this.parse('/help daymute');
		if (!this.can('mute', targetUser, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User "' + this.targetUsername + '" not found.');

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id] || 0) >= 50 * 60 * 1000) || targetUser.locked) && !target) {
			var problem = ' but was already ' + (!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('(' + targetUser.name + ' would be muted by ' + user.name + problem + '.)');
		}

		targetUser.popup(user.name + ' has muted you for 24 hours. ' + target);
		this.addModCommand('' + targetUser.name + ' was muted by ' + user.name + ' for 24 hours.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));

		targetUser.mute(room.id, 24 * 60 * 60 * 1000, true);
	},

	flogout: 'forcelogout',
	forcelogout: function (target, room, user) {
		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - Reason is optional.');
		if (!user.can('hotpatch')) return;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin.');

		this.addModCommand('' + targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));
		this.logModCommand(user.name + ' forcibly logged out ' + targetUser.name);
		targetUser.resetName();
	}
};

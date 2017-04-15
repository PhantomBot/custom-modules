(function() {
	var discordClips = $.getSetIniDbBoolean('clipsSettings', 'discordClips', false),
		discordChannel = $.getSetIniDbString('clipsSettings', 'discordChannel', ''),
		saveToFile = $.getSetIniDbBoolean('clipsSettings', 'saveToFile', false),
		clipRegex = new RegExp(/(https:\/\/)?clips\.twitch\.tv\/(.*)/),
		cache = [];

	/*
	 * @function saveClip
	 *
	 * @param {Stirng} username
	 * @param {String} clip
	 */
	function saveClip(username, clip) {
		if (discordClips === true && discordChannel !== '') {
			$.discord.say(discordChannel, 'New clip by ' + username + '! ' + clip);
		}

		if (saveToFile === true) {
			$.writeToFile('[' + $.logging.getLogTimeString() + '] ' + username + ': ' + clip + ' (TimeStamp: ' + $.inidb.get('panelstats', 'streamUptime') + ')', './addons/clips.txt', true);
		}
	}

	/*
	 * @function getClipName
	 *
	 * @param  {String} message
	 * @return {String} 
	 */
	function getClipName(message) {
		return message.match(clipRegex)[2];
	}

	/*
	 * @function clipsCheck
	 *
	 * @param {String} message
	 * @param {String} username
	 */
	function clipsCheck(message, username) {
		if (message.match(clipRegex)) {
			var name = getClipName(message);
			if (cache[name] === undefined) {
				saveClip(username, message.match(clipRegex)[0]);
				cache[name] = true;
			}
		}
	}

	/*
	 * @event ircChannelMessage
	 */
	$.bind('ircChannelMessage', function(event) {
		clipsCheck(event.getMessage(), $.username.resolve(event.getSender(), event.getTags()));
	});

	/*
	 * @event command
	 */
	$.bind('command', function(event) {
		var sender = event.getSender(),
			command = event.getCommand(),
			args = event.getArgs(),
			action = args[0],
			subAction = args[1];

		if (command.equalsIgnoreCase('clipssetting')) {
			if (action === undefined) {
				$.say($.whisperPrefix(sender) + 'Usage: !clipssetting [savetofile / savetodiscord / discordchannel]');
				return;
			}

			if (action.equalsIgnoreCase('savetofile')) {
				saveToFile = !saveToFile;
				$.setIniDbBoolean('clipsSettings', 'saveToFile', saveToFile);
				$.say($.whisperPrefix(sender) + (saveToFile ? 'Twitch clips posted in chat will now be saved in a text file!' : 'Twitch clips posted in chat will no longer be saved in a text file.'));
				return;
			}

			if (action.equalsIgnoreCase('savetodiscord')) {
				discordClips = !discordClips;
				$.setIniDbBoolean('clipsSettings', 'discordClips', discordClips);
				$.say($.whisperPrefix(sender) + (discordClips ? 'Twitch clips posted in chat will now be posted in Discord!' : 'Twitch clips posted in chat will no longer be posted in Discord.'));
				return;
			}

			if (action.equalsIgnoreCase('discordchannel')) {
				if (subAction === undefined) {
					$.say($.whisperPrefix(sender) + 'Usage: !clipssetting discordchannel [channel name]');
					return;
				}

				discordChannel = subAction.replace('#', '').toLowerCase();
				$.setIniDbString('clipsSettings', 'discordChannel', discordChannel);
				$.say($.whisperPrefix(sender) + 'Clips channel for Discord has changed to #' + discordChannel);
			}
		}
	});
	
	/*
	 * @event initReady
	 */
	$.bind('initReady', function() {
		$.registerChatCommand('./handlers/clipsHandler.js', 'clipssetting', 1);
	});
})();

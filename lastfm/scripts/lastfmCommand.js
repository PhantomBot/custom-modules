	(function() {
		const db_title = "lastfm";
		const default_last_fm_api_key = "293111fdaf9f475bf1f5463a063ffa66";
		const api_url_basics = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=1";
		// variable
		var last_fm_api_key = default_last_fm_api_key;
		var last_fm_username = "";
		var artist = "";
		var name = "";
		var sender;
		
		function initVars() {
			last_fm_username = $.inidb.get(db_title, 'user_name');
			last_fm_api_key = $.inidb.get(db_title, "api_key");
		}
		
		function getTrackFromLastFm(index, repeater) {
			try {
				var jsonObj = JSON.parse($.customAPI.get(api_url_basics + "&page=" + index + "&user=" + last_fm_username + "&api_key=" + last_fm_api_key).content);
				var current_track = jsonObj.recenttracks.track[0];
				if (index > 1) {
					track = jsonObj.recenttracks.track[1];
					$.say($.whisperPrefix(sender) + " 🎶 " + track["name"] + " - " +  track["artist"]["#text"] + ", " + track["album"]["#text"]);
				} else if (index == 1) {
					var new_track = ((artist != current_track["artist"]["#text"]) || (name != current_track["name"]));
					artist = current_track["artist"]["#text"];
					name = current_track["name"];
					if (!repeater || new_track) {
						$.say((repeater ? "" : $.whisperPrefix(sender)) + " 🎶 " + current_track["name"] + " - " +  current_track["artist"]["#text"] + ", " + current_track["album"]["#text"]);
					}
				}
				return true;
			} catch (ex) {
				$.consoleLn(ex);
				$.consoleLn(ex.stack);				
			}
			return false;
		}

		$.bind('command', function(event) {

			sender = event.getSender(); // Grabs the person who used the command
			var command = event.getCommand(), // Grabs the command being used
				args = event.getArgs(), // arguments used for your commands like maybe 
				action = args[0], // the array of args received
				subAction = args[1];

			if (command.equalsIgnoreCase('song')) {
				initVars();
				if (action === undefined) {
					getTrackFromLastFm(1, false);
				} else if (action.equalsIgnoreCase("previous")) {
					getTrackFromLastFm(2, false);
				} else if (action.equalsIgnoreCase("index")) {
					getTrackFromLastFm(parseInt(subAction));
				} else if (action.equalsIgnoreCase("help")) {
					$.say($.whisperPrefix(sender) + " !song - get the current played song \\ !song on - enable \\ !song off - disable \\ !song previous - last played song \\ !song index * - last played song numerical 1 (newest) to max-oldest \\  !song key * - set the lastfm api key \\ !song user * - set the lastfm user name", $.whisperPrefix(sender));
				} else if (action.equalsIgnoreCase("user")) {
					if (!$.isBot(sender)) {
						return;
					}
					last_fm_username = subAction;
					if (getTrackFromLastFm(1, false)) {
						$.inidb.set(db_title, 'user_name', subAction);
						$.inidb.SaveAll(true);
						$.say($.whisperPrefix(sender) + " user name set to " + last_fm_username);
					} else {
						initVars();
						$.say($.whisperPrefix(sender) + " user name ignored keeping old username " + last_fm_username);
					}
				} else if (action.equalsIgnoreCase('key')) {
					if (!$.isBot(sender)) {
						return;
					}
					last_fm_api_key = subAction;
					if (getTrackFromLastFm(1, false)) {
						$.inidb.set(db_title, "api_key", subAction);
						$.inidb.SaveAll(true);
						$.say($.whisperPrefix(sender) + " api key set to" + last_fm_api_key);
					} else {
						initVars();
						$.say($.whisperPrefix(sender) + " api key ignored keeping old api key ");
					}
				} else if (action.equalsIgnoreCase('on')) {
					if (!$.isBot(sender)) {
						return;
					}
					$.inidb.set(db_title, 'enabled', true);
				} else if (action.equalsIgnoreCase('off')) {
					if (!$.isBot(sender)) {
						return;
					}
					$.inidb.set(db_title, 'enabled', false);
				}
				$.consoleLn("command completed");
			}
		});

		$.bind('initReady', function() {

			if (!$.inidb.exists(db_title, 'initial_push')) {
				setTimeout(function() {
					$.inidb.set(db_title, 'initial_push', true);
					$.inidb.set(db_title, 'enabled', true);
					$.inidb.set(db_title, 'user_name', 'rj');
					$.inidb.set(db_title, 'api_key', default_last_fm_api_key);
					$.inidb.SaveAll(true);
				}, 5 * 1000);
			};
			if ($.bot.isModuleEnabled('./commands/lastfmCommand.js')) {
				initVars();
				$.registerChatCommand('./commands/lastfmCommand.js', 'song');
				setInterval(function() {
					if ($.inidb.get(db_title, 'enabled') == 'true') {
						if (!getTrackFromLastFm(1, true)) {
							$.consoleLn("failed to get last.fm track info");
						}
					}
				}, 2.5 * 1000);
			}
		});

	})();
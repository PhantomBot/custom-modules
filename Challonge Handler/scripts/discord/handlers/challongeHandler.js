(function() {
    var key = $.inidb.get('challonge', 'key'),
        tournamentCache,
        matchCache;

    /*
     * @Prototype toTitleCase
     */
    String.prototype.toTitleCase = function() {
        return (this.charAt(0).toUpperCase() + this.substr(1).toLowerCase());
    }

    /*
     * @function query
     */
    function query() {
        tournamentCache = JSON.parse($.customAPI.get('https://api.challonge.com/v1/tournaments.json?api_key=' + key).content);
        tournamentCache = tournamentCache[tournamentCache.length - 1].tournament;
        matchCache = JSON.parse($.customAPI.get('https://api.challonge.com/v1/tournaments/' + tournamentCache.id + '/matches.json?api_key=' + key).content);
        // Check events.
        tournamentStartedEvent();
        tournamentEndedEvent();
        tournamentResetEvent();
        reportMatchEvent();
    }

    /*
     * @function getDate
     *
     * @param  {String} date
     * @return {String}
     */
    function getDate(date) {
        var dateFormat = new java.text.SimpleDateFormat('M-d-yyyy - h:mma z');
        dateFormat.setTimeZone(java.util.TimeZone.getTimeZone('EST'));
        return dateFormat.format(new Date(date));
    }

    /*
     * @function getReportUrl
     *
     * @return {String} current tournament URL.
     */
    function getReportUrl() {
        if (tournamentCache.state === 'underway') {
            return 'http://challonge.com/' + tournamentCache.url + '/report_scores';
        }
        return $.lang.get('challonge.tournament.null');
    }

    /*
     * @function setChallongeKey
     *
     * @param {String} key
     */
    function setChallongeKey(key) {
        if (key === undefined) {
            $.say($.lang.get('challonge.key.usage'));
            return;
        }

        $.say($.lang.get('challonge.key.set'));
        key = key;
        $.inidb.set('challonge', 'key', key);
        $.inidb.del('tournament', 'id');
        return;
    }

    function playerId(id) {
        var tourid = $.getIniDbString('tournament', 'id'),
            participant = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments/" + tourid + "/participants.json?api_key=" + key).content),
            player,
            length = (participant.length - 1);

        for (length in participant) {
            if (id == participant[length].participant.id) {
                if (participant[length].participant.username == undefined) {
                    player = participant[length].participant.name;
                } else {
                    player = participants[length].participant.username;
                }
            }
        }
        return player;
    }

    function getPending() {
        try {
            var get = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments.json?api_key=" + key + "&state=pending").content),
                url = '';
            get = get[get.length - 1].tournament;

            if (get.sign_up_url == null) {
                url = 'http://challonge.com/' + get.url;
            } else {
                url = $.lang.get('challonge.signup.url', get.sign_up_url);
            }

            return $.lang.get('challonge.pending.message', get.name, get.game_name, getDate(get.start_at), get.participants_count, url);
        } catch (ex) {
            return undefined;
        }
    }

    function getInProgress() {
        try {
            var get = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments.json?api_key=" + key + "&state=in_progress").content);
            get = get[get.length - 1].tournament;

            return $.lang.get('challonge.inprogress.message', get.name, get.game_name, getDate(get.started_at), get.participants_count, get.progress_meter, get.url);
        } catch (ex) {
            return undefined;
        }
    }

    function getEnded() {
        try {
            var get = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments.json?api_key=" + key + "&state=ended").content);
            get = get[get.length - 1].tournament;

            return $.lang.get('challonge.ended.message', get.name, get.game_name, getDate(get.completed_at), get.participants_count, get.url);
        } catch (ex) {
            return undefined;
        }
    }

    /*
     * @function tournamentStartedEvent
     */
    function tournamentStartedEvent() {
        if (tournamentCache.state === 'underway' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say($.lang.get('challonge.start.event', tournamentCache.name, tournamentCache.game_name, tournamentCache.url));
            $.setIniDbString('tournament', 'state', tournamentCache.state);
            $.setIniDbString('tournament', 'id', tournamentCache.id);
        }
    }

    /*
     * @function tournamentEndedEvent
     */
    function tournamentEndedEvent() {
        if (tournamentCache.state === 'complete' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say($.lang.get('challonge.ended.event', tournamentCache.name, tournamentCache.game_name, tournamentCache.url));
            $.setIniDbString('tournament', 'state', tournamentCache.state);
            $.inidb.del('tournament', 'id');
        }
    }

    /*
     * @function tournamentResetEvent
     */
    function tournamentResetEvent() {
        if (tournamentCache.state === 'pending' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say($.lang.get('challonge.reset.event', tournamentCache.name, tournamentCache.game_name, tournamentCache.url));
            $.setIniDbString('tournament', 'state', tournamentCache.state);
            $.inidb.del('tournament', 'id');
        }
    }

    /*
     * @function reportMatchEvent
     */
    function reportMatchEvent() {
        for (var i in matchCache) {
            if (matchCache[i].match.state === 'complete') {
                var winner = matchCache[i].match.winner_id;
                var loser = matchCache[i].match.loser_id;
                if ($.getIniDbString('tournament', 'match_' + matchCache[i].match.id, '') === '') {
                    $.say($.lang.get('challonge.match.event', playerId(winner), playerId(loser), playerId(winner)));
                    $.setIniDbString('tournament', 'match_' + matchCache[i].match.id, 'true');
                }
            }
        }
    }

    /*
     * @function getMatch
     */
    function getMatch() {
        var matchCache = JSON.parse($.customAPI.get('https://api.challonge.com/v1/tournaments/' + $.getIniDbString('tournament', 'id') + '/matches.json?api_key=' + key).content);

        for (var i in matchCache) {
            if (matchCache[i].match.state === 'complete') {
                var winner = matchCache[i].match.winner_id;
                var loser = matchCache[i].match.loser_id;
                var score = matchCache[i].match.scores_csv;
                return $.lang.get('challonge.get.match', playerId(winner), playerId(loser), playerId(winner));
            }
        }
        return $.lang.get('challonge.null.match');
    }


    /**
     * @event command
     */
    $.bind('discordCommand', function(event) {
        var sender = event.getSender(),
            channel = event.getChannel(),
            command = event.getCommand(),
            mention = event.getMention(),
            arguments = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('tournament')) {
            if (getInProgress() == undefined && getPending() == undefined) {
                $.discord.say(channel, $.lang.get('challonge.get.ended', getEnded()));
                return;
            }

            if (getInProgress() == undefined) {
                $.discord.say(channel, $.lang.get('challonge.get.pending', getPending()));
            } else if (getPending() == undefined) {
                $.discord.say(channel, $.lang.get('challonge.get.progress', getInProgress()));
            } else {
                $.discord.say(channel, $.lang.get('challonge.get.ended', getEnded()));
            }
        }

        if (command.equalsIgnoreCase('signup')) {
            $.discord.say(channel, registerPlayer(sender));
        }

        if (command.equalsIgnoreCase('report')) {
            $.discord.say(channel, $.lang.get('challonge.get.report', getReportUrl()));
        }

        if (command.equalsIgnoreCase('last')) {
            $.discord.say(channel, $.lang.get('challonge.get.last', getEnded()));
        }

        if (command.equalsIgnoreCase('match')) {
            $.discord.say(channel, $.lang.get('challonge.get.match', getMatch()));
        }

        if (command.equalsIgnoreCase('challongekey')) {
            setChallongeKey(action);
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./discord/handlers/challongeHandler.js')) {
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'last');
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'signup');
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'match');
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'report');
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'tournament');
            $.discord.registerCommand('./discord/handlers/challongeHandler.js', 'challongekey', 1);
            setInterval(function() {
                query();
            }, 15000);
        }
    });
})();

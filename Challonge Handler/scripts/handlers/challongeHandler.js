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
        return 'No tournaments in progress.';
    }

    /*
     * @function setChallongeKey
     *
     * @param {String} key
     */
    function setChallongeKey(key) {
        if (key === undefined) {
            $.say('Usage: !challongekey <API Key in your challonge settings>');
            return;
        }

        $.say('Challonge API Key set!');
        key = key;
        $.inidb.set('challonge', 'key', key);
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
                url = 'Sign-Up: ' + get.sign_up_url;
            }

            return ('Name: ' + get.name + ' | Game: ' + get.game_name + ' | Date: ' + getDate(get.start_at) + ' | Registered: ' + get.participants_count + ' | ' + url);
        } catch (ex) {
            return undefined;
        }
    }

    function getInProgress() {
        try {
            var get = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments.json?api_key=" + key + "&state=in_progress").content);
            get = get[get.length - 1].tournament;

            return ('Name: ' + get.name + ' | Game: ' + get.game_name + ' | Started: ' + getDate(get.started_at) + ' | Registered: ' + get.participants_count + ' | Progress: ' + get.progress_meter + '% | http://challonge.com/' + get.url);
        } catch (ex) {
            return undefined;
        }
    }

    function getEnded() {
        try {
            var get = JSON.parse($.customAPI.get("https://api.challonge.com/v1/tournaments.json?api_key=" + key + "&state=ended").content);
            get = get[get.length - 1].tournament;

            return ('Name: ' + get.name + ' | Game: ' + get.game_name + ' | Ended: ' + getDate(get.completed_at) + ' | Registered: ' + get.participants_count + ' | http://challonge.com/' + get.url);
        } catch (ex) {
            return undefined;
        }
    }

    /*
     * @function tournamentStartedEvent
     */
    function tournamentStartedEvent() {
        if (tournamentCache.state === 'underway' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say('Tournament: ' + tournamentCache.name + ' for ' + tournamentCache.game_name + ' has just started! Checkout the bracket at: ' + 'http://challonge.com/' + tournamentCache.url);
            $.setIniDbString('tournament', 'state', tournamentCache.state);
						$.setIniDbString('tournament', 'id', tournamentCache.id);
        }
    }

    /*
     * @function tournamentEndedEvent
     */
    function tournamentEndedEvent() {
        if (tournamentCache.state === 'complete' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say('Tournament: ' + tournamentCache.name + ' for ' + tournamentCache.game_name + ' is over! Checkout the results at: ' + 'http://challonge.com/' + tournamentCache.url);
            $.setIniDbString('tournament', 'state', tournamentCache.state);
        }
    }

    /*
     * @function tournamentResetEvent
     */
    function tournamentResetEvent() {
        if (tournamentCache.state === 'pending' && !$.getIniDbString('tournament', 'state', '').equals(tournamentCache.state)) {
            $.say('Tournament: ' + tournamentCache.name + ' for ' + tournamentCache.game_name + ' was reset! Checkout the bracket at: ' + 'http://challonge.com/' + tournamentCache.url);
            $.setIniDbString('tournament', 'state', tournamentCache.state);
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
                    $.say('The match between ' + playerId(winner) + ' and ' + playerId(loser) + ' is over! ' + playerId(winner) + ' wins!');
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
                return (playerId(winner) + ' vs. ' + playerId(loser) + '! Score: ' + score + ' Winner: ' + playerId(winner));
            }
        }
        return 'No new matches have been completed yet!';
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('tournament')) {
            if (getInProgress() == undefined && getPending() == undefined) {
                $.say("[Ended] " + getEnded());
                return;
            }

            if (getInProgress() == undefined) {
                $.say("[Pending] " + getPending());
            } else if (getPending() == undefined) {
                $.say("[In Progress] " + getInProgress());
            } else {
                $.say("[Ended] " + getEnded());
            }
        }

        if (command.equalsIgnoreCase('signup')) {
            registerPlayer(sender);
        }

        if (command.equalsIgnoreCase('report')) {
            $.say("Report your scores here: " + getReportUrl());
        }

        if (command.equalsIgnoreCase('last')) {
            $.say("[Last Game] " + getEnded());
        }

        if (command.equalsIgnoreCase('match')) {
            $.say("[Last Match] " + getMatch());
        }

        if (command.equalsIgnoreCase('challongekey')) {
            setChallongeKey(action);
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/challongeHandler.js')) {
            $.registerChatCommand('./handlers/challongeHandler.js', 'last');
            $.registerChatCommand('./handlers/challongeHandler.js', 'signup');
            $.registerChatCommand('./handlers/challongeHandler.js', 'match');
            $.registerChatCommand('./handlers/challongeHandler.js', 'report');
            $.registerChatCommand('./handlers/challongeHandler.js', 'tournament');
            $.registerChatCommand('./handlers/challongeHandler.js', 'challongekey', 1);
            setInterval(function() {
                query();
            }, 15000);
        }
    });
})();

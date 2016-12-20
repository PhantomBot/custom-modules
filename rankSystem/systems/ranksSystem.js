/**
 * Provides for a configurable rank system with various different configurable ranks
 * based on Points.
 */

(function() {

    rankEligablePoints = $.getSetIniDbNumber('settings', 'rankEligablePoints', 50),
    rankEligableCost = $.getSetIniDbNumber('settings', 'rankEligableCost', 200);

    var ranksPointsTable;

    /**
     * @function sortCompare
     * Callback function for sorting the ranksMapping table.
     */
    function sortCompare(a, b) {
        var numA = parseInt(a),
            numB = parseInt(b);

        if (numA > numB) {
            return 1;
        } else if (numA == numB) {
            return 0;
        } else {
            return -1;
        }
    }

    /**
     * @function loadRanksPointsTable
     * Loads the Points portion of the ranksMapping table into local memory and sorts it.
     * The table is then used to map to the rank that a person belongs to.
     */
    function loadRanksPointsTable() {
        ranksPointsTable = $.inidb.GetKeyList('ranksMapping', '');
        ranksPointsTable.sort(sortCompare);
    }

    /**
     * @function hasRank
     * @export $
     * @param {string} username
     * @returns {boolean}
     */
    function hasRank(username) {
        var userPoints;

        username = username.toLowerCase();

        // Has a custom rank.
        if ($.inidb.exists('viewerRanks', username.toLowerCase())) {
            return true;
        }

        // Look for data in the ranksMapping table, if none, the user has no rank, else, has a rank.
        if (ranksPointsTable === undefined) {
            loadRanksPointsTable();
        }
        if (ranksPointsTable.length == 0) {
            return false;
        }

        userPoints = parseInt(parseInt($.inidb.get('points', username)));
        if (isNaN(userPoints)) {
            userPoints = 0;
        }
        for (var i = 0; i < ranksPointsTable.length; i++) {
            if (parseInt(userPoints) >= parseInt(ranksPointsTable[i])) {
                return true;
            } else {
                i = ranksPointsTable.length;
            }
        }
        return false;
    }

    /**
     * @function getRank
     * @export $
     * @param {string} username
     * @returns {string}
     */
    function getRank(username) {
        var userPoints,
            userLevel;

        username = username.toLowerCase();

        if (!hasRank(username)) {
            return '';
        }

        // Return Custom Rank
        if ($.inidb.exists('viewerRanks', username.toLowerCase())) {
            return $.inidb.get('viewerRanks', username.toLowerCase());
        }

        // Return System Rank
        userLevel = -1;
        userPoints = parseInt(parseInt($.inidb.get('points', username)));
        if (isNaN(userPoints)) {
            userPoints = 0;
        }
        for (var i = 0; i < ranksPointsTable.length; i++) {
            if (parseInt(userPoints) >= parseInt(ranksPointsTable[i])) {
                userLevel = i;
            } else {
                i = ranksPointsTable.length;
            }
        }
        if (userLevel != -1) {
            return $.inidb.get('ranksMapping', ranksPointsTable[userLevel].toString());
        }
        return '';
    }

    /**
     * @function resolveRank
     * @export $
     * @param {string} username
     * @returns {string}
     */
    function resolveRank(username) {
        return (getRank(username.toLowerCase()) + ' ' + $.username.resolve(username)).trim();
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            args = event.getArgs(),
            sender = event.getSender().toLowerCase(),
            username = $.username.resolve(sender),
            levelPoints,
            levelName,
            userPoints = parseInt(parseInt($.inidb.get('points', sender))),
            userLevel,
            PointsUntilNextRank,
            nextLevel,
            isReplace,
            customUser,
            customRank;

        if (isNaN(userPoints)) {
            userPoints = 0;
        }

        /*
         * @commandpath rankedit - Displays the usage of rankedit.
         * @commandpath rankedit add [Points] [rankname] - Add a new rank. Points is in hours.
         * @commandpath rankedit del [Points] - Deletes the rank associated with the given Points
         * @commandpath rankedit custom [user] [rankname] - Add a custom rank to a user.
         * @commandpath rankedit customdel [user] - Remove a custom rank from a user.
         * @commandpath rankedit setpoints [Points] - Number of minimum hours before user can choose custom rank.
         * @commandpath rankedit setcost [points] - Cost of custom rank.
         */
        if (command.equalsIgnoreCase('rankedit')) {
            if (!args[0]) {
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.edit.usage'));
                return;
            }

            if (args[0].equalsIgnoreCase('setpoints')) {
                if (args.length < 2) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.setpoints.usage'));
                    return;
                }

                if (isNaN(args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.setpoints.usage'));
                    return;
                }

                rankEligablePoints = parseInt(args[1]);
                $.inidb.set('settings', 'rankEligablePoints', rankEligablePoints);
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.setpoints.success', rankEligablePoints));
                return;
            }

            if (args[0].equalsIgnoreCase('setcost')) {
                if (args.length < 2) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.setcost.usage', $.pointNameMultiple));
                    return;
                }

                if (isNaN(args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.setcost.usage', $.pointNameMultiple));
                    return;
                }

                rankEligableCost = parseInt(args[1]);
                $.inidb.set('settings', 'rankEligableCost', rankEligableCost);
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.setcost.success', rankEligableCost, $.pointNameMultiple));
                return;
            }

            if (args[0].equalsIgnoreCase('custom')) {
                if (args.length < 3) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.custom.usage'));
                    return;
                }

                customUser = args[1];
                customRank = args.splice(2).join(' ');

                if (!$.inidb.exists('points', customUser.toLowerCase())) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.custom.404', customUser));
                    return;
                }

                $.inidb.set('viewerRanks', customUser.toLowerCase(), customRank);
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.custom.success', $.username.resolve(customUser), customRank));
                return;
            }

            if (args[0].equalsIgnoreCase('customdel')) {
                if (args.length < 2) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.customdel.usage'));
                    return;
                }

                customUser = args[1];

                if (!$.inidb.exists('viewerRanks', customUser.toLowerCase())) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.customdel.404', customUser));
                    return;
                }

                $.inidb.del('viewerRanks', customUser.toLowerCase());
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.customdel.success', $.username.resolve(customUser)));
                return;
            }

            if (args[0].equalsIgnoreCase('add')) {
                if (args.length < 3) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.add.usage'));
                    return;
                }
                if (isNaN(args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.add.usage'));
                    return;
                }

                levelPoints = args[1];
                levelName = args.splice(2).join(' ');

                isReplace = $.inidb.exists('ranksMapping', levelPoints);
                $.inidb.set('ranksMapping', levelPoints, levelName);
                if (isReplace) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.add.success-update', levelPoints, levelName));
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.add.success-new', levelPoints, levelName));
                }

                if (!isReplace) {
                    loadRanksPointsTable();
                }
                return;
            }

            if (args[0].equalsIgnoreCase('del')) {
                if (args.length < 2) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.del.usage'));
                    return;
                }

                if (!$.inidb.exists('ranksMapping', args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.del.404', args[1]));
                } else {
                    $.inidb.del('ranksMapping', args[1]);
                    $.say($.whisperPrefix(sender) + $.lang.get('ranks.del.success', args[1]));
                    loadRanksPointsTable();
                }
                return;
            }
        }

        /**
         * @commandpath rank - Display current rank.
         * @commandpath rank set [rankname] - Set rank for self if enough hours and points, if applicable, available in chat.
         * @commandpath rank del - Deletes customized rank.
         */
        if (command.equalsIgnoreCase('rank')) {
            if (args[0]) {
                if (args[0].equalsIgnoreCase('del')) {
                    if (inidb.exists('viewerRanks', sender.toLowerCase())) {
                        $.say($.whisperPrefix(sender) + $.lang.get('ranks.delself.success'));
                        $.inidb.del('viewerRanks', sender.toLowerCase());
                    } else {
                        $.say($.whisperPrefix(sender) + $.lang.get('ranks.delself.404'));
                    }
                    return;
                }

                if (args[0].equalsIgnoreCase('set')) {
                    if (!args[1]) {
                        if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
                            $.say($.whisperPrefix(sender) + $.lang.get('ranks.set.usage', rankEligablePoints, rankEligableCost, $.pointNameMultiple));
                        } else {
                            $.say($.whisperPrefix(sender) + $.lang.get('ranks.set.usage.nopoints', rankEligablePoints));
                        }
                        return;
                    }

                    customRank = args.splice(1).join(' ');

                    if (userPoints >= rankEligablePoints &&
                        ($.bot.isModuleEnabled('./systems/pointSystem.js') && getUserPoints(sender) > rankEligableCost) || !$.bot.isModuleEnabled('./systems/pointSystem.js')) {
                        $.say($.whisperPrefix(sender) + $.lang.get('ranks.set.success', customRank));
                        $.inidb.set('viewerRanks', sender.toLowerCase(), customRank);
                        if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
                            $.inidb.decr('points', sender.toLowerCase(), rankEligableCost);
                        }
                        return;
                    }

                    if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
                        $.say($.whisperPrefix(sender) + $.lang.get('ranks.set.failure', rankEligablePoints, $.pointNameMultiple, rankEligableCost));
                    } else {
                        $.say($.whisperPrefix(sender) + $.lang.get('ranks.set.failure.nopoints', rankEligablePoints));
                    }
                    return;
                }
            }

            if (ranksPointsTable === undefined) {
                loadRanksPointsTable();
            }
            if (ranksPointsTable.length == 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('ranks.rank.404'));
                return;
            }

            userLevel = -1;
            for (var i = 0; i < ranksPointsTable.length; i++) {
                if (parseInt(userPoints) >= parseInt(ranksPointsTable[i])) {
                    userLevel = i;
                } else {
                    i = ranksPointsTable.length;
                }
            }

            if ($.inidb.exists('viewerRanks', username.toLowerCase())) {
                $.say($.lang.get('ranks.rank.customsuccess', username, $.inidb.get('viewerRanks', username.toLowerCase())));
                return;
            }

            if (userLevel <= ranksPointsTable.length - 2) {
                nextLevel = parseInt(userLevel) + 1;
                PointsUntilNextRank = parseInt(ranksPointsTable[nextLevel]) - userPoints;
                if (userLevel == -1) {
                    $.say($.lang.get('ranks.rank.norank.success', username, PointsUntilNextRank, $.inidb.get('ranksMapping', ranksPointsTable[nextLevel].toString()), $.pointNameMultiple));
                } else {
                    $.say($.lang.get('ranks.rank.success', username, $.inidb.get('ranksMapping', ranksPointsTable[userLevel].toString()), PointsUntilNextRank, $.inidb.get('ranksMapping', ranksPointsTable[nextLevel].toString()), $.pointNameMultiple));
                }
            } else {
                $.say($.lang.get('ranks.rank.maxsuccess', username, $.inidb.get('ranksMapping', ranksPointsTable[userLevel].toString())));
            }
            return;
        }

    });

    /**
     * @event initReady
     *
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/ranksSystem.js')) {
            $.registerChatCommand('./systems/ranksSystem.js', 'rank', 7);
            $.registerChatCommand('./systems/ranksSystem.js', 'rankedit', 1);

            $.registerChatSubcommand('rankedit', 'add', 1);
            $.registerChatSubcommand('rankedit', 'del', 1);
            $.registerChatSubcommand('rankedit', 'custom', 1);
            $.registerChatSubcommand('rankedit', 'customdel', 1);
        }
    });

    /**
     * Export functions to API
     */
    $.resolveRank = resolveRank;
    $.getRank = getRank;
    $.hasRank = hasRank;
    $.loadRanksPointsTable = loadRanksPointsTable;
})();

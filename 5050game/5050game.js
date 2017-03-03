/**
 * 5050game
 *
 * Flip a coin game.
 */
(function() {
    var winpct = $.getSetIniDbNumber('5050game', 'winpct', 50),
        maxbet = $.getSetIniDbNumber('5050game', 'maxbet', 100);
    
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            intValue,
            flipRand;

        /**
         * @commandpath 5050 - Flips a coin to see if a user wins something.
         * @commandpath 5050 setmax [amount] - Sets the maximum bet.
         * @commandpath 5050 setwinpct [1-1000] - Sets the winning percent. 1% - 1000%
         */
        if (command.equalsIgnoreCase('5050')) {

            if (!args[0]) {
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.usage', $.getPointsString(maxbet)));
                return;
            }

            if (args[0].equalsIgnoreCase('setwinpct')) {
                if (!args[1]) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setwinpct.usage'));
                    return;
                }
                if (isNaN(args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setwinpct.usage'));
                    return;
                }
                intValue = parseInt(args[1]);
                if (intValue < 1 || intValue > 1000) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setwinpct.usage'));
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.setwinpct', intValue));
                winpct = intValue;
                $.setIniDbNumber('5050game', 'winpct', winpct);
                return;
            }

            if (args[0].equalsIgnoreCase('setmaxbet')) {
                if (!args[1]) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setmaxbet.usage'));
                    return;
                }
                if (isNaN(args[1])) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setmaxbet.usage'));
                    return;
                }
                intValue = parseInt(args[1]);
                if (intValue < 1) {
                    $.say($.whisperPrefix(sender) + $.lang.get('5050game.setmaxbet.usage'));
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.setmaxbet', $.getPointsString(intValue)));
                maxbet = intValue
                $.setIniDbNumber('5050game', 'maxbet', maxbet);
                return;
            }

            if (isNaN(args[0])) {
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.usage', $.getPointsString(maxbet)));
                return;
            }
            intValue = args[0];
            if (intValue > maxbet) {
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.usage', $.getPointsString(maxbet)));
                return;
            }
            flipRand = $.randRange(1, 100);
            if (flipRand < 50) {
                $.inidb.decr('points', sender, intValue);
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.lose'));
                return;
            } else {
                intValue = parseInt(intValue * (winpct / 100));
                $.inidb.incr('points', sender, intValue);
                $.say($.whisperPrefix(sender) + $.lang.get('5050game.win', $.username.resolve(sender), $.getPointsString(intValue)));
                return;
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/5050game.js')) {
            $.registerChatCommand('./custom/5050game.js', '5050', 7);
            $.registerChatSubcommand('5050', 'setwinpct', 1);
            $.registerChatSubcommand('5050', 'setmaxbet', 1);
        }
    });

    /**
     * Warn the user if the points system is disabled and this is enabled.
     */
    if ($.bot.isModuleEnabled('./custom/5050game.js') && !$.bot.isModuleEnabled('./systems/pointSystem.js')) {
        $.log.error("Disabled. ./systems/pointSystem.js is not enabled.");
    }
})();

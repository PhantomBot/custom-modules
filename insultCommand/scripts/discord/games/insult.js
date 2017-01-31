/**
 * This module is to handles the insult game.
 */
(function() {
    var responseCount = 0,
        lastinsult = 0;

    /**
     * @function loadResponses
     */
    function loadResponses() {
        for (var i = 1; $.lang.exists('insultcommand.' + i); i++) {
            responseCount++;
        }
    }

    /**
     * @event discordCommand
     */
    $.bind('discordCommand', function(event) {
        var channel = event.getChannel(),
            command = event.getCommand(),
            sender = event.getMention(),
            args = event.getArgs();

        /**
         * @discordcommandpath insult - Will display something really insult.
         */
        if (command.equalsIgnoreCase('insult')) {
            sender = (args.length === 0 ? sender : $.discord.userMention(args.join(' ').toString()));

            do {
                var insult = $.randRange(1, responseCount);
            } while (insult == lastinsult);

            $.discord.say(channel, $.discord.tags(event, $.lang.get('insultcommand.' + insult, sender)));
            lastinsult = insult;
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./discord/games/insult.js')) {
            $.discord.registerCommand('./discord/games/insult.js', 'insult', 0);
            if (responseCount === 0) {
                loadResponses();
            }
        }
    });
})();

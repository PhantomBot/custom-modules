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
    $.bind('command', function(event) {
        var command = event.getCommand(),
						sender = event.getSender(),
						args = event.getArgs();

        /**
         * @discordcommandpath insult - Will display something really insult.
         */
        if (command.equalsIgnoreCase('insult')) {
            var insult;

						if (args.length > 0) {
								sender = args.join(' ');
						} else {
								sender = event.getSender();
						}

        	do {
        		insult = $.randRange(1, responseCount);
        	} while (insult == lastinsult);

        	$.say($.tags(event, $.lang.get('insultcommand.' + insult, sender), false));
        	lastinsult = insult;
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/insult.js')) {
            $.registerChatCommand('./games/insult.js', 'insult', 7);

            if (responseCount === 0) {
                loadResponses();
            }

            // $.unbind('initReady'); Needed or not?
        }
    });
})();

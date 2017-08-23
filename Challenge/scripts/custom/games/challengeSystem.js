/**
 * challengeSystem.js
 *
 * A command that will let you challenge another user to a fight.
 *
 * Current version 1.7.0
 *
 * Original author: yxpoh (https://community.phantombot.tv/t/the-challenge-automated-randomized-fighting-chat-game/1529)
 *
 * Contributors:
 * UsernamesSuck, TheRealAlixe, ArthurTheLastAncient
 *
 */
(function() {
	var // General variables
		currentChallenge = 1,
		attackMoves = 0,
		dodgeMoves = 0,
		acceptTimeout,
		attackSuccess = $.getSetIniDbNumber('challengeSettings', 'attackSuccess', 65),
		minDmg = $.getSetIniDbNumber('challengeSettings', 'minDmg', 1),
		maxDmg = $.getSetIniDbNumber('challengeSettings', 'maxDmg', 5),
		defaultHealth = $.getSetIniDbNumber('challengeSettings', 'defaultHealth', 10),
		timeoutSec = $.getSetIniDbNumber('challengeSettings', 'timeoutSec', 60),
		messageInterval = $.getSetIniDbNumber('challengeSettings', 'messageInterval', 5),
		wager = $.getSetIniDbNumber('challengeSettings', 'wager', 10),
		captions = $.getSetIniDbNumber('challengeSettings', 'captions', 4),
		currency = $.pointNameMultiple;

    /**
     * @function reloadChallenge
     */
	function reloadChallenge() {
        attackSuccess = $.getIniDbNumber('challengeSettings', 'attackSuccess');
        minDmg = $.getIniDbNumber('challengeSettings', 'minDmg');
        maxDmg = $.getIniDbNumber('challengeSettings', 'maxDmg');
        defaultHealth = $.getIniDbNumber('challengeSettings', 'defaultHealth');
        timeoutSec = $.getIniDbNumber('challengeSettings', 'timeoutSec');
        messageInterval = $.getIniDbNumber('challengeSettings', 'messageInterval');
        wager = $.getIniDbNumber('challengeSettings', 'wager');
        captions = $.getIniDbNumber('challengeSettings', 'captions');
    };

    /**
     * @function initialiseChallengeSystem
     */
	function initialiseChallengeSystem() {
		clearCurrentChallenge();
		loadAttacks();
		loadDodges();
    };

    /**
     * @function clearCurrentChallenge
     */
	function clearCurrentChallenge() {
		currentChallenge = {
			challenger: undefined,
			challenged: undefined,
			challengerHealth: undefined,
			challengedHealth: undefined,
			currentTurn: undefined,
			lastMove: undefined,
			showCaptions: true,
			inProgress: false,
		}
	};

    /**
     * @function loadAttacks
     */
	function loadAttacks() {
        var i;
		attackMoves = 0;
		// Use the data from lang files to calculate the amount of attack options
        for (i = 1; $.lang.exists('challengesystem.attack.' + i); i++) {
            attackMoves++;
        }
        $.consoleDebug($.lang.get('challengesystem.console.attacksloaded', attackMoves));
    };

    /**
     * @function loadDodges
     */
	function loadDodges() {
        var i;
		dodgeMoves = 0;
		// Use the data from lang files to calculate the amount of dodoge options
        for (i = 1; $.lang.exists('challengesystem.dodge.' + i); i++) {
            dodgeMoves++;
        }
        $.consoleDebug($.lang.get('challengesystem.console.dodgesloaded', dodgeMoves));
    };

    /**
     * @function clearExpired
     */
	 function clearExpired() {
		// This will clear the settings if a fight is not in progress and the reply timeout expires
		$.say($.lang.get('challengesystem.challenge.noreply', currentChallenge.challenger, currentChallenge.challenged));
		if (wager > 0) {
			$.inidb.incr('points', currentChallenge.challenger, wager);
		}
		clearCurrentChallenge();
    };

    /**
     * @function challengeSequence
	 * @param {string} attacker
	 * @param {string} defender
	 * @param {Number} defHealth
	 * @param {Number} turn
	 * @returns {Number}
     */
	function challengeSequence(attacker, defender, defHealth, turn) {
		var i = $.randRange(0, 100);; // Randomizing attack success or failure
		var move = 0; // Initialize move
		var damage = 0; // Initialise damage
		var chatOutput = ''; // Initialise chat output

		if (i <= attackSuccess) { // was attack successful?
			// Attack
			// Randomize Attack Damage
			do {
				damage = $.randRange(minDmg, maxDmg);
			} while (damage > maxDmg && damage < minDmg);

			// Reduce health accordingly.
			defHealth -= damage;

			// Randomize Attack Description
			do {
				move = $.randRange(1, attackMoves);
			} while (((move > attackMoves && move < 1) || move == currentChallenge.lastMove) && attackMoves > 1);
			chatOutput = $.lang.get('challengesystem.attack.' + move, attacker, defender, damage);
		} else {
			// Dodge
			// Randomize Dodge Description
			do {
				move = $.randRange(1, dodgeMoves);
			} while (((move > dodgeMoves && move < 1) || move == currentChallenge.lastMove) && dodgeMoves > 1);
			chatOutput = $.lang.get('challengesystem.dodge.' + move, attacker, defender);
		}

		// Remember the last used move so the next move will be different
		currentChallenge.lastMove = move;

		// Output description to chat if appropriate
		if (turn <= captions) {
			// Display Battle text
			$.say(chatOutput);
		} else {
			// Display max captions message to chat only once
			if (currentChallenge.showCaptions) {
				currentChallenge.showCaptions = false;
				$.say($.lang.get('challengesystem.challenge.maxcaptionsreached'));
			}
		}

		// Return resulting health
		return defHealth;
	};

    /**
     * @function initialiseChallenge
     */
	function initialiseChallenge() {
		currentChallenge.challengerHealth = defaultHealth;
		currentChallenge.challengedHealth = defaultHealth;
		currentChallenge.showCaptions = true;
		currentChallenge.currentTurn = 1;
		currentChallenge.lastMove = 0;
        var t = setTimeout(function() {
            runChallenge();
        }, messageInterval * 1e3);
	};

    /**
     * @function cleanupChallenge
     */
	function cleanupChallenge() {
		clearCurrentChallenge();
		$.say($.lang.get('challengesystem.challenge.cleanup'));
	};

    /**
     * @function endChallenge
     */
	function endChallenge() {
		var winner = '';

		// End the fight and declare a winner
		if (currentChallenge.challengerHealth <= 0) {
			// Challenger has lost. Challenged is the winner!
			winner = currentChallenge.challenged;
		} else {
			// Challenged has lost. Challenger is the winner!
			winner = currentChallenge.challenger;
		}

		// Output the result to the chat
		if (wager > 0) {
			// We have a bet, so use the appropriate language sentence and add the currency to the winner's account
			$.say($.lang.get('challengesystem.challenge.endwager', winner, $.getPointsString(wager * 2)));
			$.inidb.incr('points', winner, wager * 2);
		} else {
			// We don't have a bet, so use the appropriate language sentence
			$.say($.lang.get('challengesystem.challenge.endnowager', winner));
		}

		// Prepare the cleanup and free the Arena
		var t = setTimeout(function() {
			cleanupChallenge();
		}, messageInterval * 1e3);

	};

    /**
     * @function runChallenge
     */
	function runChallenge() {
		// If Challenge was cleared using "rest" option, we need to silently exit
		if (!currentChallenge.inProgress) {
			return;
		}

		// Using modulus to switch turn between both parties. Challenger will start first.
		if (currentChallenge.currentTurn % 2 == 1) {
			// Launch challengeSequence with Challenger as attacker.
			currentChallenge.challengedHealth = challengeSequence(
				currentChallenge.challenger,
				currentChallenge.challenged,
				currentChallenge.challengedHealth,
				currentChallenge.currentTurn
			);
		} else {
			// Launch challengeSequence with Challenged as attacker.
			currentChallenge.challengerHealth = challengeSequence(
				currentChallenge.challenged,
				currentChallenge.challenger,
				currentChallenge.challengerHealth,
				currentChallenge.currentTurn
			);
		}

		// Check if we have a winner
		if ((currentChallenge.challengerHealth <= 0) || (currentChallenge.challengedHealth <= 0)) {
			// Someone's health has been reduced to 0, so we have a winner!
			var t = setTimeout(function() {
				endChallenge();
			}, messageInterval * 1e3);

		} else {
			// No winner yet, so let's schedule the next round
			currentChallenge.currentTurn++;
			if (currentChallenge.showCaptions) {
				// Set delay to set messageInterval
				var t = setTimeout(function() {
					runChallenge();
				}, messageInterval * 1e3);
			} else {
				// We're not showing captions (anymore), so the delay can be small
				var t = setTimeout(function() {
					runChallenge();
				}, 100);
			}
		}
	};

    /**
     * @event command
	 */
	$.bind('command', function (event) {
		var command = event.getCommand(),
            sender = event.getSender(),
			args = event.getArgs(),
            action = args[0];
			optionChoice = args[1];
			optionValue = args[2];

        /**
         * @commandpath challenge - Challenge command for starting, checking or setting options
         * @commandpath challenge [user] - issue/accept a challenge
         * @commandpath challenge accept - accept an incoming challenge
         */
		if (command.equalsIgnoreCase('challenge')) {

			if (action === undefined)
			{
				$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage'));
				return;
			}

            /**
             * @commandpath challenge set - Base command for controlling the challenge settings
             */
			if (action.trim().equalsIgnoreCase('set')) {
				if (optionChoice === undefined) {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.usage'));
					return;
				}

				/**
				 * @commandpath challenge set minDamage [integer] - Used to set the minimum amount of damage done with a successful attack
				 */
				if (optionChoice.trim().equalsIgnoreCase('minDamage')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.mindamage.usage', minDmg));
						return;
					} else {
						minDmg = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'minDmg', parseInt(optionValue));
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.mindamage.success', minDmg));
						return;
					}
				}

				/**
				 * @commandpath challenge set maxDamage [integer] - Used to set the maximum amount of damage done with a successful attack
				 */
				if (optionChoice.trim().equalsIgnoreCase('maxDamage')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxdamage.usage', maxDmg));
						return;
					} else {
						maxDmg = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'maxDmg', parseInt(optionValue));
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxdamage.success', maxDmg));
						return;
					}
				}

				/**
				 * @commandpath challenge set health [integer] - Used to set the starting amount of health each player has
				 */
				if (optionChoice.trim().equalsIgnoreCase('health')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.health.usage', defaultHealth));
						return;
					} else {
						defaultHealth = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'defaultHealth', defaultHealth);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.health.success', defaultHealth));
						return;
					}
				}

				/**
				 * @commandpath challenge set attackrate [integer] - Used to set the successrate of attacks
				 */
				if (optionChoice.trim().equalsIgnoreCase('attackRate')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.attackrate.usage', attackSuccess));
						return;
					} else {
						attackSuccess = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'attackSuccess', attackSuccess);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.attackrate.success', attackSuccess));
						return;
					}
				}

				/**
				 * @commandpath challenge set wager [integer] - Used to set the amount of currency wagered on the challenge. Set to 0 to disable.
				 */
				if (optionChoice.trim().equalsIgnoreCase('wager')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.wager.usage', $.getPointsString(wager)));
						return;
					} else {
						wager = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'wager', wager);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.wager.success', $.getPointsString(wager)));
						return;
					}
				}

				/**
				 * @commandpath challenge set timeout [integer] - Used to set the time in seconds to accept a challenge.
				 */
				if (optionChoice.trim().equalsIgnoreCase('timeout')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.timeout.usage', timeoutSec));
						return;
					} else {
						timeoutSec = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'timeoutSec', timeoutSec);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.timeout.success', timeoutSec));
						return;
					}
				}

				/**
				 * @commandpath challenge set messageInterval [integer] - Used to set the chat message interval in seconds.
				 */
				if (optionChoice.trim().equalsIgnoreCase('messageinterval')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.messageinterval.usage', messageInterval));
						return;
					} else {
						messageInterval = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'messageInterval', messageInterval);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.messageinterval.success', messageInterval));
						return;
					}
				}

				/**
				 * @commandpath challenge set captions [integer] - Used to set the maximum number of chat messages shown per challenge.
				 */
				if (optionChoice.trim().equalsIgnoreCase('captions')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						if (captions > 0) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.usage', captions + ' messages'));
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.usage', 'results only'));
						}
						return;
					} else {
						captions = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'captions', captions);
						if (captions > 0) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.success', captions + ' messages'));
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.success', 'results only'));
						}
						return;
					}
				}

				/**
				 * @commandpath challenge set [undefined option] - Show usage.
				 */
				$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.usage'));
				return;
			}

            /**
             * @commandpath challenge reset - Base command for resetting andreloading the challenge module.
             */
			if (action.trim().equalsIgnoreCase('reset')) {
				initialiseChallengeSystem();
				reloadChallenge();
				if ((attackMoves == 0) || (dodgeMoves == 0)) {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.console.attackdodgeerror', attackMoves, dodgeMoves));
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.reset.success', attackMoves, dodgeMoves));
				}
				return;
			}

			//Check if there is a current challenge proposal on-going
			if (!currentChallenge.inProgress){
				// If nothing, then set
				currentChallenge.challenger = String($.replace(sender,'@',''));
				currentChallenge.challenged = String($.replace(action.trim(),'@',''));
				if (((wager > $.getUserPoints(currentChallenge.challenger)) || (wager > $.getUserPoints(currentChallenge.challenged))) && (wager > 0)) {
					if (wager > $.getUserPoints(currentChallenge.challenger)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nomoney1', currency, $.getPointsString(wager)));
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nomoney2', currentChallenge.challenged, currency));
					}
				} else {
					currentChallenge.inProgress = true;
					if (wager > 0) {
						$.inidb.decr('points', currentChallenge.challenger, wager);
					}
					acceptTimeout = setTimeout(clearExpired, timeoutSec * 1e3); // Set a timeout to expire the challenge if challenged doesn't reply.
					$.say($.lang.get('challengesystem.challenge.sent', currentChallenge.challenger, currentChallenge.challenged, timeoutSec));
				}
				return;
			} else {
				// Check if Challenged is responding.
				if (($.replace(action.trim(),'@','').equalsIgnoreCase(currentChallenge.challenger) || $.replace(action.trim(),'@','').equalsIgnoreCase('accept')) &&  $.replace(sender,'@','').equalsIgnoreCase(currentChallenge.challenged)) {
					clearTimeout(acceptTimeout); // Clear Timeout as there is not need for it to expire.
					if (wager > 0) {
						$.inidb.decr('points', currentChallenge.challenged, wager);
					}
					$.say($.lang.get('challengesystem.challenge.start', currentChallenge.challenger, currentChallenge.challenged));
					initialiseChallenge(); // Initialize the Challenge. This will also set up the setTimeout events to run the challenge.
					return;
				} else {
					// Challenge in Progress if not Challenge reply
					$.say($.lang.get('challengesystem.challenge.inprogress'));
					return;
				}
			}
		}
   });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/games/challengeSystem.js')) {
			// Initial variable initialisation
			clearCurrentChallenge();
			loadAttacks();
			loadDodges();

			if ((attackMoves == 0) || (dodgeMoves == 0)) {
				$.console($.lang.get('challengesystem.console.attackdodgeerror', attackMoves, dodgeMoves));
			}

			// Register commands
            $.registerChatCommand('./custom/games/challengeSystem.js', 'challenge', 7);
            $.registerChatSubcommand('challenge', 'set', 1);
            $.registerChatSubcommand('challenge', 'reset', 1);
        }
    });

	$.reloadChallenge = reloadChallenge;
})();

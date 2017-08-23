/**
 * games-challengeGame.js
 *
 * Language file for challengeGame.js
 *
 * Current version 1.7.0
 *
 * Original author: yxpoh (https://community.phantombot.tv/t/the-challenge-automated-randomized-fighting-chat-game/1529)
 *
 * Contributors:
 * UsernamesSuck, TheRealAlixe, ArthurTheLastAncient
 *
 */

/**
 * Attack descriptions
 * The numbers need to be sequential in order for them to work correctly.
 * Parameters:
 * $1: {string} Attacker
 * $2: {string} Defender
 * $3: {Number} amount of damage
 */
$.lang.register('challengesystem.attack.1', '$1 sent a straight blow to $2 and did $3 damage.');
$.lang.register('challengesystem.attack.2', '$1 did a russian leg sweep on $2 and did $3 damage.');
$.lang.register('challengesystem.attack.3', '$1 suplexed $2 and did $3 damage. That\'s gotta hurt...');
$.lang.register('challengesystem.attack.4', '$1 made a cross-chop for $2 and did $3 damage.');
$.lang.register('challengesystem.attack.5', 'A LARIAT from $1 on $2 and did $3 damage.');
$.lang.register('challengesystem.attack.6', 'What a dropkick by $1 and did $3 damage to $2.');
$.lang.register('challengesystem.attack.7', 'An Uppercut to the face of $2, what a move from $1. That did $3 damage.');
$.lang.register('challengesystem.attack.8', '$1 jabbed right into $2 and did $3 damage.');

/**
 * Dodge descriptions
 * The numbers need to be sequential in order for them to work correctly.
 * Parameters:
 * $1: {string} Attacker
 * $2: {string} Defender
 */
$.lang.register('challengesystem.dodge.1', '$1 tried punching $2, but $2 squat to dodge it.');
$.lang.register('challengesystem.dodge.2', '$2 dodge-rolled out of the kick of $1.');
$.lang.register('challengesystem.dodge.3', '$2 parried the punch from $1.');
$.lang.register('challengesystem.dodge.4', '$2 blocked the punch from $1.');
$.lang.register('challengesystem.dodge.5', '$2 used his/her reiatsu to push back the attack of $1.');
$.lang.register('challengesystem.dodge.6', '$2 slips away from the attack from $1 using Tai-ji.');

/**
 * Console output
 */
$.lang.register('challengesystem.console.attacksloaded', 'Found $1 attacks');
$.lang.register('challengesystem.console.dodgesloaded', 'Found $1 dodges');
$.lang.register('challengesystem.console.attackdodgeerror', 'WARNING! There were no Attacks or Dodges found. Current attackMoves: $1, current dodgeMoves: $2');

/**
 * Main challenge strings
 */
$.lang.register('challengesystem.challenge.usage', 'Usage: !challenge <Opponent Name>');
$.lang.register('challengesystem.challenge.usage.nomoney1', 'you don\'t have enough $1 to issue a challenge right now. You need $2.');
$.lang.register('challengesystem.challenge.usage.nomoney2', 'you can\'t challenge $1 right now, because they don\'t have enough $2.');
$.lang.register('challengesystem.challenge.sent','$1 is challenging $2 to a fight! Use "!challenge $1" or "!challenge accept" within $3 seconds to accept!');
$.lang.register('challengesystem.challenge.inprogress', 'There is already a challenge proposal, so please wait for it to expire before proposing again.');
$.lang.register('challengesystem.challenge.noreply', '$1\'s challenge request has expired, because $2 hasn\'t responded. The arena is now free!');
$.lang.register('challengesystem.challenge.start', '$2 has accepted $1\'s challenge... Things are about to get heated up in the Arena!');
$.lang.register('challengesystem.challenge.endwager', 'Fight Ended! The winner is $1! Congratulations! You\'ve won $2.');
$.lang.register('challengesystem.challenge.endnowager', 'Fight Ended! The winner is $1! Congratulations!');
$.lang.register('challengesystem.challenge.cleanup','The arena is now cleaned up and available for new challenges!');
$.lang.register('challengesystem.challenge.maxcaptionsreached', 'The dustcloud from the battle became so heavy it obscured the sight of the fight...');

/**
 * Challenge set strings
 */
$.lang.register('challengesystem.set.usage','Usage: !challenge set [ mindamage | maxdamage | health | attackrate | wager | timeout | captions | messageinterval]');
$.lang.register('challengesystem.set.mindamage.usage','Usage: !challenge set mindamage <Number>. Current setting: $1.');
$.lang.register('challengesystem.set.mindamage.success','minDamage has been successfully set to $1.');
$.lang.register('challengesystem.set.maxdamage.usage','Usage: !challenge set maxdamage <Number>. Current setting: $1.');
$.lang.register('challengesystem.set.maxdamage.success','maxDamage has been successfully set to $1.');
$.lang.register('challengesystem.set.health.usage','Usage: !challenge set health <Number>. Current setting: $1 HP.');
$.lang.register('challengesystem.set.health.success','health has been successfully set to $1 HP.');
$.lang.register('challengesystem.set.attackrate.usage','Usage: !challenge set attackrate <Percentage>. Current setting: $1%.');
$.lang.register('challengesystem.set.attackrate.success','attackRate has been successfully set to $1%.');
$.lang.register('challengesystem.set.wager.usage','Usage: !challenge set wager <Number>. Current setting: $1.');
$.lang.register('challengesystem.set.wager.success','wager has been successfully set to $1.');
$.lang.register('challengesystem.set.timeout.usage','Usage: !challenge set timeout <Number>. Current setting: $1 seconds.');
$.lang.register('challengesystem.set.timeout.success','timeout has been successfully set to $1 seconds.');
$.lang.register('challengesystem.set.messageinterval.usage','Usage: !challenge set messageInterval <Number>. Current setting: $1 seconds.');
$.lang.register('challengesystem.set.messageinterval.success','messageInterval has been successfully set to $1 seconds.');
$.lang.register('challengesystem.set.captions.usage','Usage: !challenge set captions <Number>. Set to 0 for results only. Current setting: $1.');
$.lang.register('challengesystem.set.captions.success','captions has been successfully set to $1.');

/**
 * Challenge reset strings
 */
$.lang.register('challengesystem.reset.attackdodgeerror', 'WARNING! There were no Attacks or Dodges found. Current attackMoves: $1, current dodgeMoves: $2. Please check the Language file.');
$.lang.register('challengesystem.reset.success','the challengeSystem was reset successfully. There are $1 attackMoves and $2 dodgeMoves loaded.');

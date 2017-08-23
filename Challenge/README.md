# Challenge Version 1.7.0

**Changelog:**
**challengeSystem.js** (Core file)

+ Filenames changed to conventional PhantomBot names
+ Added comments explaining the functions as per PhantomBot conventions
+ Cleaned up command option parsing and added comments on each subcommand/option
+ Refactored/renamed different functions and sections of code to work with the setTimeout() delay method
+ Removed the Pause function as it’s no longer needed
+ Changed the “settings” option/subcommand to “set” to match other PhantomBot commands
+ Removed the “show” settings option and instead added the current value to the usage of each setting
+ Added subcommand “reset” with default administrator privilege to clear any ongoing challenge, as well as reload attack and + dodge descriptions
+ Various minor optimizations

**games-challengeSystem.js** (Language file)
+ Renamed language strings to be consistent with PhantomBot naming conventions
+ Separated sections each with explanation/comments on what each section does and how to add or edit attack or dodge moves
+ Added separate language strings for each individual setting, with usage explanation
+ Removed language strings that were no longer needed

**controlpanel** (Configuration panel backend)

+ Fixed a typo (challange => challenge)
+ Fixed a bug where settings wouldn’t update correctly. There’s a new file to be downloaded and overwritten.
+ Complete installation instructions are following below

**Usage instructions**

+ !challenge - Challenges another user to a fight
+ !challenge set - Base settings command, displays all options changeable through the command
+ !challenge set minDamage - Sets the minimum damage for an attack
+ !challenge set maxDamage - Sets the maximum damage for an attack
+ !challenge set attackRate - Sets the success (hit/miss) rate of an attack
+ !challenge set health - Sets the starting health (HP) of each player
+ !challenge set timeout - Sets the time the challenger has to accept the challenge in seconds
+ !challenge set wager - Sets the bet/wager to fight for. Set to 0 to disable the use of currency
+ !challenge set messageInterval - Sets the seconds of delay between messages in chat.
+ !challenge set captions - Sets the maximum of attack/dodge descriptions to show. Set to 0 to go straight to the results
+ !challenge reset - Resets the challenge module and reloads all data. Use it when you change attack/dodge descriptions and don’t want to restart your bot, or when you want to clear an ongoing challenge. (Does not affect settings)

**Update instructions**

+ Make sure PhantomBot is running
+ type into (twitch)chat: “!module delete ./custom/games/challenge.js” (Don’t worry, this is because the file is renamed.
+ Your settings won’t be touched)
+ Shut down Phantombot
+ Delete .\scripts\custom\games\challenge.js
+ Delete .\scripts\lang\custom\games-challenge.js
+ Continue with installation instructions

**Installation instructions** (Easy mode)

+ Shut down PhantomBot
+ Download this file: challengeSystem.zip (6.4 KB)
+ Unpack into the base directory of your PhantomBot installation
+ If you want the control panel options, download this file: challengeControlPanel.zip (9.7 KB) Otherwise, skip to step 7
+ Close any browser windows and/or tabs with the control panel opened
+ Unpack into the base directory of your PhantomBot installation. WARNING The following three (3) files will be overwritten:
    + ./scripts/core/panelCommands.js
    + ./web/panel/games.html
    + ./web/panel/js/gamesPanel.js
+ Restart PhantomBot
+ Profit!


**Separate files** (For advanced installation)
+ [./scripts/custom/games/challengeSystem.js](https://raw.githubusercontent.com/JustAlixe/PhantomBot-Custom-Modules/master/Challenge/scripts/custom/games/challengeSystem.js). (18.3 KB)
+ [./scripts/lang/custom/games-challengeSystem.js](https://raw.githubusercontent.com/JustAlixe/PhantomBot-Custom-Modules/master/Challenge/scripts/lang/custom/games-challengeSystem.js). (6.1 KB)
+ [./scripts/core/panelCommands.js](https://raw.githubusercontent.com/JustAlixe/PhantomBot-Custom-Modules/master/Challenge/scripts/core/panelCommands.js). (16.0 KB)
+ [./web/panel/games.html](https://raw.githubusercontent.com/JustAlixe/PhantomBot-Custom-Modules/master/Challenge/web/panel/games.html). (3.4 KB)
+ [./web/panel/js/gamesPanel.js](https://raw.githubusercontent.com/JustAlixe/PhantomBot-Custom-Modules/master/Challenge/web/panel/js/gamesPanel.js). (19.6 KB)

*Additional usage and instructions are in the comments resepctive files.*
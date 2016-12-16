# Guild Wars 2 API Module
by Andreas "Nekres" G.

Hey GW2 streamers, I have made a plugin for the PhantomBot (phantombot.net) that connects in detail with the GW2 API.

--------------
# Chat commands

**!gw2 setkey [*GW2apiKey*]** - Sets a Guild Wars 2 api key. Required permissions: account, wallet, characters, pvp, builds, progression. Created at: https://account.arena.net/applications
**!gw2 rank [*integer*]** - Displays your current league placement or the best of a season if given.  
**!gw2 stats [*profession*]** - Displays your overall pvp matches played or stats of a profession if given.
(It will calculate and display your W/L ratio and considers wins, losses, byes and desertations - but not forfeits - for the result.)  
**!gw2 characters/chars**  - Whispers the names of all your characters.  
**!gw2 account/acc** - Displays general information of your account.  
**!gw2 wallet/coins/gold/karma** - Displays the amount of gold and karma in your possession.  
**!gw2 world/server** - Displays the world & population of the world your're playing on.  
**!gw2 guilds** - Whispers the name and tag of guilds your're a member of.  
**!gw2 fractals/fracs** - Displays your current fractal level.  
**!gw2 wvw** - Displays your current WvW level.  
**!gw2 wiki [*article*]** - Returns an official wiki search link for the item specified.  
**!gw2 build [*game mode*] [*character*]** - Returns a gw2tool.net link that will forward to the gw2skills.net build editor which will be adjusted to your current equipped build in a specified game mode on a specified character. (Game modes are: 'pve', 'pvp', 'wvw'.)  
**!gw2 deathcounter/deaths [*character*]** - Toggles a death counter for a specific character and writes its value to '*[...]/addons/guildwars2/session_deaths.txt*' followed by a skull and crossbones symbol '☠'.  
**!gw2 goldcounter** - Toggles a gold counter and writes initial gold, earnings plus losses to '*[...]/addons/guildwars2/session_gold.txt*'.  
**!gw2 coinsformat** - Toggles between two different currency formats: '####.00,00g' or '####g 00s 00c' (default).  
**!gw2 birthday/bday** - Checks if any of your characters had birthday on the last 3 days. 
* The slash **/ separates synonyms** to choose from!!
* The brackets **[] mark parameters** to input! (Ex. '!gw2 build [game mode] [character]' becomes '!gw2 build pvp Nekres')

 --------------
# Installation

 (0). Shutdown your bot if its running.
 1. Rightclick [Download](https://raw.githubusercontent.com/PhantomBot/custom-modules/master/guildwars2/games/guildwars2.js) -> Save Target As - "guildwars2.js"
 2. Place it here: "[...]/scripts/games/".
 3. Rightclick one of the language files below -> Save Target As - "games-guildwars2.js":
 * [English](https://raw.githubusercontent.com/PhantomBot/custom-modules/master/guildwars2/lang/english/games/games-guildwars2.js)
 * [Deutsch](https://raw.githubusercontent.com/PhantomBot/custom-modules/master/guildwars2/lang/deutsch/games/games-guildwars2.js)
 4. Place your choosen language file here: "[...]/scripts/lang/english/games/". (Or whatever language your bot uses)
 * [...] is your local path to your root phantombot folder.

 **You are done!**

 (A changelog can be taken from within the guildwars2.js file.)
 
 Do not worry! ArenaNet will never make an API with which third-party tools would be able to edit something on your account from outside of the game!  
 The API is purely for "viewing" ressources!
 
 --------------
# !gw2 goldcounter - The gold counter display explained:

**Example:**

10g 52s 70c - Your initial gold when starting the gold counter.
+0g 00s 00c - Session profit calculated via losses/earnings updated every 5 minutes.

**2. Example**

8g 52s 70c
-2g 00s 00c (You made a loss of -2g since your initial gold counter start.)

**3. Example**

13g 52s 70c
+3g 00s 00c (You made a profit of +3g since your initial gold counter start.)

(You can change the formatting via !gw2 coinsformat into ‘####.00,00g’.)

(written to session_gold.txt for file monitoring by OBS/XSplit and so forth.)
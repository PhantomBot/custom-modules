# Waifu Games 
Only works on Phantombot 2.3.5.2 and above versions!  

####**(Instructions):**  
1. Shut down your bot and then put:  
2. Drop *waifuGames.js* in your **scripts>games** folder   
3. Drop *games-waifuGames.js & games-waifuList.js* in your **scripts>lang>english>games** folder  
4. Replace the web folder in your root folder of Phantombot with the one that comes with this.
5. Start the bot backup and test with !waifuhelp  

#**Features**

##**Seducing Waifus**
Type **!seduce** and it will seduce one random Waifu from the list. You have a chance of a waifu getting away and dropping candy.  
You have a small chance to encounter and catch a rare Waifu. Rare Waifu come with higher stats than common ones.  
___
##**Releasing Waifus**
You can release a waifu at any time to reset it's stats, but you will need to catch it again in order to use it.  
To release a waifu type **!release (name or id)**   
___
##**Trading Waifus**
This isn't exactly trading, but more like sending a waifu you own to another user. 
The stats of your waifu will transfer to another player and if he/she already owns that waifu, it will overwrite the stat data **ONLY** if your waifu has higher stats
  
To transfer a Pokémon just type **!giftwaifu (name) (waifu)**.
___
##**Waifu Lookup**  
You can type **!waifu (name or id)** to look up information about that Pokémon.  
If that waifu is in your harem the message will show their stats: Level, HP, Atk, Def, and Love.  
```
Example:   
!waifu juri = You own 2 of:  Juri Han #6 (Street Fighter).  
OR  
!waifu 6 = You own 2 of:  Juri Han #6 (Street Fighter).   
OR (in team)  
!waifu juri = You own 2 of:  Juri Han #6 (Street Fighter). Level: 1, Atk: 5, Def: 7, Love: 2%
```
___
##**Marry your waifu**
You can marry any waifu in your harem by typing **!setwaifu (waifu)** and if you want to duivorce her just type **!resetwaifu**.  
Marryinga waifu comes with benefits such as: Increasing the Love level with your waifu and setting it as:
(**Main Fighter:** Attacks and Defends when a waifu is not specified in battle)  
**!waifu**  will let you see your married waifu stats otherwise show a random waifu.
___
##**Harems**
A harem is like a team with your favorite waifus. A harem can only have up to ***6 Waifu***.  
Typing **!harem** will show your entire harem.  
**!addharem (waifu)** will add a waifu that you **OWN** into your harem.  
You can remove any character from your team using **!kickharem (waifu)**.
___
##**Battling Waifus**
Using **!fight (player) (waifu)** you can fight anyone to train and level up your waifus's stats such as: EXP, Attack, Defense, and Love.
If you type **!fight (player)** it will use a random waifu in your harem.   
All fights are calculated by you and your opponent's Waifu's stats.  
  
***Requirements:*** Both players must have a **harem** with at least one character in it.  
```Example:  
!battle phantomindex juri = Juri Han [HP:100] received 0 damage, and with a pillow inflicted 20 damage on Kolin [HP:80]!
OR  
!battle phantomindex = Cammy White [HP:100] received 0 damage, and with Double Slap inflicted 12 damage on Kolin [HP:88]! 
```
As you can see in the first example you can choose any waifu in your harem to fight your opponent. The opponent's waifu is selected randomly if he or she doesn't have one set as married  

When a player's waifu HP reaches 0 it means that waifu is now K.O.'d and can't fight. You will need to use a **candy** on that waifu to revive it back.

**Note:** If you'd like to add or customize the attacks for the waifu, just edit them in the lang file. It will choose 1 of the many attacks for battle. 
___
##**Bosses**
Bosses are the big tough fighters with immense attack power and hit points. It's a high risk high reward feature.  
You can battle the boss with **!boss**  
  
A boss will be generate with **2500 HP** and **Attack 200-800** including **Defense 600-800**. Who ever defeats the boss will be rewarded and a new boss will be generated when someone types **!boss**  
Default rewards for defeating the boss is: **10,000 points and 10 candy.**  
  
You can edit the boss names through the lang file.
___
##**Profile**
Using **!profile** will bring up information such as the amount of waifus you've caught, candy you have and your Win/Lose ratio.   
You can reset your win/lose ratio using **!resetratio**  
___
##**Candy**
You unlock candy randomly when seducing a waifu. 
You can check how much candy you've collected by typing **!candy** or **!profile**. 
Candy can be used to restore a Waifu's HP to 100, increase your Waifus's EXP by 100, Attack by 1-2, Defense by 1-2 and Love by 1% all at once. Maximum 120000 EXP = level 100 
  
To use your candy on a waifu just type **!candy (waifu)** or if you want to use more than one on that same waifu type: **!candy (amount) (waifu)**

___
##**Rewards**
You can customize the reward players receive from seducing **Rare Waifus** with **!waifureward (amount)**.    
Default is 100.
  
You can also customize the fight rewards for defeating a waifu with **!fightreward (amount)**  
Default is 50.

You can also customize the boss rewards for defeating a Boss with **!bossreward (amount)**  
Default is 10000.

# Pokémon System
Only works on Phantombot 2.3.5 and above versions!  

This is a full rewrite of the Pokémon System script with new features!  

####**(Instructions):**  
1. Shut down your bot and then put:  
2. Drop *pokemonSystem.js* in your **scripts>games** folder   
3. Drop *games-pokemonSystem.js* in your **scripts>lang>english>games** folder  
4. Replace the web folder in your root folder of Phantombot with the one that comes with this.
5. Start the bot backup and test with !pokemonhelp  

#**Features**

##**Catching Pokémon**
Type **!catch** and it will catch one random Pokémon from the list. You have a chance of a Pokémon getting away and dropping candy.  
You have a small chance to encounter and catch a rare Pokémon. Rare Pokémon come with higher stats than common ones.  
___
##**Pokémon Lookup**  
You can type **!Pokémon (name or id)** to look up information about that Pokémon.  
If that Pokémon is in your team the message will show their stats: Level, Atk, Def, and Bond.  
```
Example:   
!pokemon charizard = You own 2 of:  Charizard #6.  
OR  
!pokemon 6 = You own 2 of:  Charizard #6.   
OR (in team)  
!pokemon charizard = You own 2 of:  Charizard #6. Level: 1, Atk: 5, Def: 7, Bond: 2%
```
___
##**Favorite Pokémon**
You can set any Pokémon as a favorite in your team by typing **!setpokemon (Pokémon)** and if you want to have a divorce just type **!resetpokemon**.  
Setting a Favorite Pokémon comes with benefits such as: Bond % Boost and the ability to see your favorited Pokémon stats with **!pokemon**  
___
##**teams**
A team is like a team with your favorite Pokémon. A team can only have up to ***6 Pokémon***.  
Typing **!team** will show your entire team.  
**!addteam (Pokémon)** will add a Pokémon that you **OWN** into your team.  
You can remove any character from your team using **!kickteam (Pokémon)**.
___
##**Pokémon Battles**
Using **!battle (player) (Pokémon)** you can battle anyone to train and level up your Pokémon's stats such as: EXP, Attack, Defense, and Bond.
If you type **!battle (player)** it will use a random Pokémon in your team.   
Battles are calculated by your and your opponent's Pokémon stats.  
***Requirements:*** Both players must have a team with at least one character in it.
___
##**Candy**
You unlock candy randomly when you try to catch Pokémon, this candy can be used to increase your Pokémon's EXP, Attack, Defense and Bond all at once.  
You can check how much you have through typing **!candy** or **!profile**. To use your candy on a Pokémon just type **!candy (Pokémon)**
___
##**Rewards**
You can customize the reward players receive from catching Pokémon with **!pokereward (amount)**.  
Default is 100.

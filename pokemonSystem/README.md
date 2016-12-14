# PokemonSystem
by PhantomIndex  
Tested on Phantombot 2.3.4
This is basically my Waifu Script, but converted to use Pokemon

**(Instructions):**  
1. Shut down your bot and then put:  
2. Drop *pokemonSystem.js* in your **scripts>games** folder   
3. Drop *games-pokemonSystem.js* in your **scripts>lang>english>games** folder  
4. Start the bot backup and test with !pokemonhelp  

**Catching:**  
As like in Pokemon you can either catch a pokemon or it can get away based on chance. If you catch the pokemon it will be saved under your username with the pokemon's ID number. The ID number is the same number the pokemon are set to in the games.  

*Example: Charizard would have the ID number: 6*

**Pokedex:**  
Using !pokedex (ID) will bring up the pokemon related to that ID number and display if you own it and a link to more information about that pokemon.  

**Battling:**  
Yes, you can battle other players with your pokemon, but you must first form a team with at least one pokemon and your opponent needs to also have one. The battling doesnt work like original pokemon games, it's only a RNG battle system. 

You can add more battle messages to the lang file *games-pokemonSystem.js* or even customize them to your liking.
  
**Shinies:**  
I've made this script to allow shinies to be caught, it's as difficult to do in the original games.
I've only seen someone encounter a shiny once on Twitch. If one of you catches one, contact me so I can test it to see if everything is working.

**Issues:**  
There is one issue I'd like to address and that's viewing ALL the pokemon you own, there's no way for me to implement it because of Twitch's chat limits.  

The best way to keep track is to remember which of the pokemon you've unlocked or check using !pokedex (pokemon id)


**Commands - Note: you don't need to add the parenthesis when using the commands**  

**!pokeballgo** - catches a random pokemon (has a small chance to be a shiny)  
**!pokemon** - Looks up how much common, rare, and legendary pokemon you've caught. Along with your level.   
**!pokedex (id)** - looks up pokemon data based on ID.  
**!sendpokemon (username) (id)** - Sends a pokemon to another viewer.  
**!buypokemon (id)** - You can buy the pokemon without needing to deal with missing (doesnt get you shinies)  
**!team** - displays your  current pokemon team (max is 6)  
**!addteam (id)** - adds the pokemon to your team  
**!kickteam (id)** -  kicks the pokemon from your team  
**!resetteam** - resets your entire team  
**!battle (name)** - battle another users team(only works if they have a team & uses a random pokemon from that team) 
**!pokemonhelp** - shows all the commands for this script.  



**Future Updates:**  
I do want to improve the battle system to use attacks based on the pokemon type and I actually thought out the logic on how I would implement it, but it would take hours upon hours of coding, testing and debugging. Even though this battle system is simple it took me nights to get it working right. I was so tired I didn't even give proper changelogs to my fixes on here.

Doing this script on my free time is very difficult since I work full-time and in search of finding a more fulfilling job.
In short I have no ETA on when I would bother upgrading the battle system.

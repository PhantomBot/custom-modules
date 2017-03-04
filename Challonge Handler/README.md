# Challonge Handler
Only works on Phantombot 2.3.5 and above versions!  

**Info:** This script uses the Challonge API (A website for hosting tournament brackets) and brings it automated to your twitch chat!

Note: I didn't test this with an account that never made a tournament, but usually the bot will just not respond in chat until you make one.

####**(Instructions):**  
1. Shut down your bot and then put:  
2. Drop *challongeHandler.js* in your **scripts>handlers** folder   
3. Start the bot backup and visit https://challonge.com/settings/developer to generate a API key  
4. In your chat or console of the bot type **!challongekey (your challonge API)**  

#**Commands:** 
**!tournament** - Will bring up the latest tournament and it's current state.  
**!report** -  Will bring up a link of a tournament thats in-progress to report your match scores.  
**!match** - Will bring the last completed match.  
**!last** - Will bring up last completed Tournament.  
**!challongekey (API)** - Sets the API key for your account in order to retrieve tournament data.   
*(Coming Soon) !signup*  
  
#**Features:**  
**Tournament Start Event** - When you start a Tournament through challonge, the bot will say it in Twitch with the tournament info and a link.  
**Tournament Reset Event** - If you Reset a Tournament on challonge, the bot will say it in Twitch.  
**Tournament End Event** - When a Tournament is completed the bot will say it in Twitch.  
**Tournament Match Event** - This will show the match players, score and winner after a match is scored & completed on Challonge.  

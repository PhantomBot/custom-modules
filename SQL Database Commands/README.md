# SQL Database Commands - A quick debugging plugin for phantombot
by Andreas "Nekres" G.

Download: [databaseCommand.js](https://raw.githubusercontent.com/PhantomBot/custom-modules/master/databaseCommand/scripts/commands/databaseCommand.js)
Put it in [...]/scripts/commands

--------------
## Chat commands

Command | Description of function
------------ | -------------
**!dbedit clear [*table*]** | Clears a table.
**!dbedit remove [*table*] [*key*]** | Removes a single key in a given table.

* The brackets **[] mark parameters** to input! (Ex. '!dbedit remove [table] [key]' becomes '!dbedit remove someTable someKeyInsideThatTable')  
  
On usage it will prompt the bot owner to reply with *!dbedit yes* or *!dbedit no* within 20 seconds. The script will do nothing if it's not given the “*yes*” approval.  
Reboot the bot afterwards.
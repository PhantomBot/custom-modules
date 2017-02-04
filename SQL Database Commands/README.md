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
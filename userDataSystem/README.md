**User Data Module**    
systems/userDataSystem.js
    
**Author**    
IllusionaryOne
    
**Module Directory Requirement**    
userDataSystem.js must be installed in ./scripts/systems
    
**Language File**    
systems-userDataSystem.js must be installed in ./scripts/lang/english/systems
    
**Module Configuration Options**    
This module is driven by a list variable within the userDataSystem.js file.  Please take note of the ```commandList``` list variable at the top of the file.  You may add/delete commands by adding them to the list and the module will automatically provide the command and subcommands as indicated below in the Command List section.  Additionally, if you add a command, you must update the **userDataSystem.js** file with output for the command.    

By default **!pcpp** is provided, which is to allow users to enter PCPartsPicker data.  Simply rename the command in ```commandList``` and rename the commands in the language file to create a different command.

**Command List**    
The module provides the following commands:    
!pcpp - Displays the usage    
!pcpp [user] - Looks up data related to the user.    
!pcpp set url - Sets a URL. Note that the base URL **must** be whitelisted in your bot to prevent timeouts.    
!pcpp clear - Clear data.

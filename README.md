# Community Provided Custom Modules for PhantomBot
These are custom modules made by the PhantomBot Community.

# How to Submit
-	Create a pull-request with your module in its own folder.
-	Add a README file for users to learn how to setup and use your modules.
-	Add a list of commands either in the README or in its own file.
- We will not merge or approve changes to a module from another user unless the original author provides a approval message.

# Disclaimer
-	These are user made modules. PhantomBot developers **will not** provide support for these modules.
-	We are not responsible if any module should corrupt, break or does anything unexpected to your database.
- We are not responsible if any module should provide a negative user experience in your chat.

# Suggested README File Format
While the README file that you provide does not have to be in this format, it might help by understanding some basic items that most users will be wondering about after installing your module:

    My Cool Module
    coolModule.js
    
    Author
    <However you want to reference yourself>
    
    Module Directory Requirement
    Ensure that coolModule.js is installed in ./scripts/systems
    
    Language File
    systems-coolModule.js is provided as a language file, please install into ./scripts/lang/english/systems
    
    Module Configuration Options
    <List out any configuration options that may be hard-coded into your module or into the language file>
    
    Command List
    The module provides the following commands:
    !cool - Does something cool
    !cool option1 - Does something cool with an option.
    !cool username - Does something cool to a user in chat.

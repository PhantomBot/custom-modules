**Channel Points Audio Hook Redemptions**
channelPointHook.js
handler-channelPointHandler.js

**Author**
IanDLive

**Module Directory Requirement**
channelPointHook.js must be installed in ./scripts/custom

**Language File**
handler-channelPointHandler.js is provided as a language file, please install into ./scripts/lang/custom

**Module Configuration Options**
<List out any configuration options that may be hard-coded into your module or into the language file>

**Command List**
The module provides the following commands:
```
!channelpointshook               - shows whether the command is enabled or its current configuration.
!channelpointshook usage         - displays how the command is used.
!channelpointshook info          - displays info on what the command does.
!channelpointshook clip1         - lets you know whether the audio hook is enabled or not and what the current hook is.
!channelpointshook clip1 usage   - displays how the command is used.
!channelpointshook clip1 config  - puts the clip into config mode so that it can be syncronized with a redemption.
!channelpointshook clip1 hook    - lets you set the audio hook to play upon redemption.
!channelpointshook clip1 toggle  - enables or disables the audio hook from being played.
```

**Notes**
This module was borne out of the requirement that I wanted to be able to play audio hooks via a Twitch channel points
redemption.  All of the original code is from the channelPointsHandler.js file within the handler scripts, but modified
so that the saved database variables are within their own table to make it stand alone from the stock script file.
Without the awesome work undertaken by the authors of PhantomBot and the community at large, none of this would be 
possible.
**50/50 Game Module**    
custom/5050game.js
    
**Author**    
IllusionaryOne
    
**Module Directory Requirement**    
5050game.js must be installed in ./scripts/custom
    
**Language File**    
custom-5050game.js must be installed in ./scripts/lang/custom
    
**Command List**    
The module provides the following commands:    
```
!5050 [bet amount]       - Places a bet    
!5050 setmaxbet [amount] - Maximum allowed bet    
!5050 setwinpct [1-1000] - Sets the percentage of the bet returned to the user as winnings.        
                           50 is 50%, or half. If user bets 100, they would get 50.        
                           100 is 100% or matching the bet. If user bets 100, they would get 100.        
                           500 is 500% or 5x the bet.  If user bets 100, they would get 500.    
```
**Notes**    
The default maxbet is 100. THe default winpct is 50.

**Samples**    
!5050
[03-03-2017 @ 15:08:49.882 MST] [MUTED] illusionarybot !5050 [bet amount] | [setmaxbet] | [setwinpct]. Max bet is 100 bits

!5050 1000
[03-03-2017 @ 15:11:38.179 MST] [MUTED] @IllusionaryBot, !5050 [bet amount] | [setmaxbet] | [setwinpct]. Max bet is 100 bits

!5050 setmaxbet 1000
[03-03-2017 @ 15:12:51.900 MST] [MUTED] @IllusionaryBot, Set the 50/50 max to 1000 bits

!5050 1000
[03-03-2017 @ 15:12:53.982 MST] [MUTED] @IllusionaryBot, IllusionaryBot won 500 bits!

!5050 setwinpct 100
[03-03-2017 @ 15:13:17.276 MST] [MUTED] @IllusionaryBot, Set the 50/50 win percent to 100%

!5050 100
[03-03-2017 @ 15:13:22.392 MST] [MUTED] @IllusionaryBot, you lost!

!5050 100
[03-03-2017 @ 15:13:24.259 MST] [MUTED] @IllusionaryBot, IllusionaryBot won 100 bits!

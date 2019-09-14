# Task list

## explore map backend server interact with treasure hunt server

- Explore the entire map with a traversal graph algorithm
- Run multiple instances of traversal graph algorithm to explore map at faster rate
- DFT to explore unknown parts of the map, enter into unexplored rooms, until reached a room that has no unexplore rooms
- BFT to search for explored rooms that have unvisted exits when encountered a room that has no unexplored rooms
- implement functionality to pick up items as player explores room and sell items when reach a certain amount and then resume back to searching unexplored rooms
- while exploring entire map record rooms visisted with accossiated data about room
- implement functionality to take advantage of power ups to navigate through map quicker
- implement functionality to reduce penelty impact
- implement a system that would randomly generate a new map
- add complexity and difficultly to new maps

## front end experience

- interact with explore map server
- sign up ?
- login
- set up teams, optional for player
- display hud of player and team
- display map information, and room information
- display map, current state of map
- update state of map of each new room explored and redisplay map with the current information
- display the current location of player and location of each member of team
- set up chat system with team?
- maybe have an interface for player to implement code to traverse the map??? that would be intersting
- or a simple logic system for the player to put together that would allow the user to program a way to explore map without really programming, like a lego building block system
- implement an optional directional input system for testing

## miner backend interact with front end and explore back end

- create a node that will manage many process of miners from multiple devices to increase mining performance
- create a miner that will run many instances of a miner on a single CPU
- add GPU mining to allow for multiprocessing of the miner
- add a shared system amoung team memebers to particpate on the same mining node to share and distribute mining awards evenly

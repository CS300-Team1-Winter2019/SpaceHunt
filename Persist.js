// File containing functions allowing for a persistant state.
// Also, allows for multiple saved game states.


// Small function that loads the names of all saved
// game states from localStorage.
function loadSaves()
{
	if(Storage !== void(0))
		gameVars.saved_games = JSON.parse(localStorage.getItem("saved_games"))
}


// Determine whether state has been set on a prior visit. If
// so, it returns true. If not, returns false.
function testPersist()
{
	if(Storage !== void(0))
	{
		if("saved_games" in localStorage)
			return true;
	}
	return false;
}

// Loads a prior state, by name provided by the user.
// If the user attempts to load a game that has not 
// been previously saved, function simply returns false.
function loadState(name)
{
	// If provided name exists, load all saved state values.
	if(gameVars.saved_games.includes(name))
	{
		// Load gameMap values. Must parse, and create new map using
		// "copy constructor".
    	var map_form = JSON.parse(localStorage.getItem(name.concat("gameMap")));
    	gameVars.gameMap = new Map();
		gameVars.gameMap.copyMap(map_form);

		// Same as above, for ship.
		var ship_form = JSON.parse(localStorage.getItem(name.concat("ship")));
    	gameVars.ship = new Ship();
    	gameVars.ship.copyShip(ship_form);

    	// Loading important settings values.
    	gameVars.unlim_game = localStorage.getItem(name.concat("playmode"));
    	gameVars.mapSize = localStorage.getItem(name.concat("mapsize"));
    	gameVars.fix_wormhole = localStorage.getItem(name.concat("wormholemode"));

    	return true;
    }
    
    return false;
}



// Save relevant state variables, by a name provided
// by the user. Saves Map, Ship, and details pertaining 
// to the settings selected by the user (unlimited play,
// map size, wormhole behavior).
function saveState(name)
{
	if(Storage !== void(0))
	{
		// Add name to list.
		gameVars.saved_games.push(name);

		// Push list of named saved games to localStorage.
		localStorage.setItem("saved_games",JSON.stringify(gameVars.saved_games));

		// Push game map details to localStorage, associate with name provided.
		localStorage.setItem(name.concat("gameMap"),JSON.stringify(gameVars.gameMap));
	    
	    // Push ship details to localStorage, associate with name provided.
		localStorage.setItem(name.concat("ship"), JSON.stringify(gameVars.ship));

		// Push necessary settings values to localStorage.
		localStorage.setItem(name.concat("playmode"), gameVars.unlim_game);
		localStorage.setItem(name.concat("mapsize"), gameVars.mapSize);
		localStorage.setItem(name.concat("wormholemode"), gameVars.fix_wormhole);
    }
}

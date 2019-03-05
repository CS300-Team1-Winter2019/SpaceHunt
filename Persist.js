// File containing functions allowing for a persistant state.
// Also, allows for multiple saved game states.

function loadSaves()
{
	if(Storage !== void(0))
		gameVars.saved_games = JSON.parse(localStorage.getItem("saved_games"))
}


// Determine whether state has been set on a prior visit.
function testPersist()
{
	if(Storage !== void(0))
	{
		if("saved_games" in localStorage)
			return true;
	}
	return false;
}

// Loads a prior state.
function loadState(name)
{
	if(gameVars.saved_games.includes(name))
	{
    	var map_form = JSON.parse(localStorage.getItem(name.concat("gameMap")));
    	gameVars.gameMap = new Map();
		gameVars.gameMap.copyMap(map_form);

		var ship_form = JSON.parse(localStorage.getItem(name.concat("ship")));
    	gameVars.ship = new Ship();
    	gameVars.ship.copyShip(ship_form);

    	return true;
    }

    return false;
}



// Save relevant state variables.
// Will need a check to see if browser is compatible.
function saveState(name)
{
	if(Storage !== void(0))
	{
		gameVars.saved_games.push(name);
		localStorage.setItem("saved_games",JSON.stringify(gameVars.saved_games));
		localStorage.setItem(name.concat("gameMap"),JSON.stringify(gameVars.gameMap));
		//localStorage.setItem("context", JSON.stringify(ctx));
		localStorage.setItem(name.concat("ship"), JSON.stringify(gameVars.ship));
    }
}

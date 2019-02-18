// File containing functions allowing for a persistant state.
// This will change when we implement the Map and Ship classes.

var gameMap = null;
var ship = null;

function getMap()
{
    return gameMap;
}

function getShip()
{
    return ship;
}

// Determine whether state has been set on a prior visit.
function testPersist()
{
	if(Storage !== void(0))
	{
		if("gameMap" in localStorage)
			return true;
	}
	return false;
}

// Loads a prior state.
function loadState()
{
    var map_form = JSON.parse(localStorage.getItem("gameMap"));
	if(gameMap == null) gameMap = new Map();
	gameMap.copyMap(map_form);

	//ctx = JSON.parse(localStorage.getItem("context"));

	var ship_form = JSON.parse(localStorage.getItem("ship"));
	if(ship == null) ship = new Ship();
    ship.copyShip(ship_form);
}



// Save relevant state variables.
// Will need a check to see if browser is compatible.
function saveState()
{
	if(Storage !== void(0))
	{
		localStorage.setItem("gameMap",JSON.stringify(gameVars.gameMap));
		//localStorage.setItem("context", JSON.stringify(ctx));
		localStorage.setItem("ship", JSON.stringify(gameVars.ship));
    }
}
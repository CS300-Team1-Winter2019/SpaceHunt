// File containing functions allowing for a persistant state.
// This will change when we implement the Map and Ship classes.


// Determine whether state has been set on a prior visit.
function testPersist()
{
	if("gameMap" in localStorage)
		return true;
	return false;
}


// Loads a prior state.
function loadState()
{
	gameMap = JSON.parse(localStorage.getItem("gameMap"));
	context = JSON.parse(localStorage.getItem("context"));
	Ship = JSON.parse(localStorage.getItem("ship"));
}


// Save relevant state variables.
// Will need a check to see if browser is compatible.
function saveState()
{
	localStorage.setItem("gameMap",JSON.stringify(gameMap));
	localStorage.setItem("context", JSON.stringify(ctx));
	localStorage.setItem("ship", JSON.stringify(Ship));
}
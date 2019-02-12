// File containing functions allowing for a persistant state.
// This will change when we implement the Map and Ship classes.


// Determine whether state has been set on a prior visit.
function testPersist()
{
	if(localStorage.getItem("gameMap") == false)
		return false;
	return true;
}


// Loads a prior state.
function loadState()
{
	gameMap = localStorage.getItem("gameMap");
	context = localStorage.getItem("context");
	Ship = localStorage.getItem("ship");
}


// Save relevant state variables.
// Will need a check to see if browser is compatible.
function saveState()
{
	localStorage.setItem("gameMap",gameMap);
	localStorage.setItem("context", ctx);
	localStorage.setItem("ship", Ship);
}

//M = prompt("Enter energy"); //using getenergy() function
//N = prompt("Enter supplies"); //using getsupply() function

function check_energy(a){
	if(a<=0){
		alert("Your energy is run out!");
		return true;
	}
}
function check_supply(a){
	if(a<=0){
		alert("Your supply is run out!");
		return true;
	}
}
//You guys can use check_supply_enerygy function anytime
//just call: check_supply_enerygy(gameVars.ship.energy,gameVars.ship.supplies)
check_supply_energy(curr_Energy,curr_Supply){
	//alert("check_supply_energy TESTING...")
if(check_energy(curr_Energy) || check_supply(curr_Supply))
	alert("Game Over"); //call gameover() function if you want add.
else
	alert("continue");
}

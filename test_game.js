var ctx = null;
var cameraSize =32;
var ts = 600/cameraSize;
var gameMap = null;
var ship = null;

// Ensure that if state has been previously saved,
// that state is loaded. If not, new game and ship
// is created.
// is created.
// is created.
window.onload = function()
{
    if(testPersist())
    {
        loadState();
    }
    else
    {
        ship = new Ship(1000);
        gameMap = new Map();
        //ctx = document.getElementById('game').getContext("2d");
        //ctx.font = "bold 10pt sans-serif";
    }
    ctx = document.getElementById('game').getContext("2d");
    //this makes the ship move, angle and direction are hardcoded in the function below
    startMove();
    requestAnimationFrame(drawGame);
}

document.addEventListener("keydown", move);

var objects =
{
    wormHole    :["red", 0],
    planet      :["green", 1],
    station     :["purple", 2],
    space       :["blue", 3],
    currColor   :"white",

    //sets currColor to be used in drawGame()
    updateColor(index)
    {
        if(index == 0) { this.currColor = "red"; }
        else if(index == 1) { this.currColor = "green"; }
        else if(index == 2) { this.currColor = "purple"; }
        else { this.currColor = "blue"; }
    }
};

/*
window.onload = function()
{
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
}
*/


function startMove(){
  //can hardcode in different angles and distances
  var userInput = {angle: 120, magnitude: 60}
  //this is what I'd like to use eventually: var userInput = {angle: document.getElementById("userInterface").elements["angle"], magnitude: document.getElementById("userInterface").elements["magnitude"]};

  //figures out how many units along x-axis and how many units along y-axis we have to go
  var runRise = ship.calculateXY(userInput); //this function returns an object {x: ?, y: ?}

  //calculates the coordinates of the destination
  var newPos = {x: ship.PosX+runRise.x, y: ship.PosY+runRise.y};

  //saves the acutal direction we're travelling along each axis
  var xUnitVector = runRise.x/Math.abs(runRise.x);
  var yUnitVector = runRise.y/Math.abs(runRise.y);

  var gm = setInterval(function(){shipMove(gm, newPos.x, xUnitVector, newPos.y, yUnitVector);}, 1);
}

var shipMove = function(gm, newX, xUnitVector, newY, yUnitVector)
{
    //if we still need to move along x-axis
    if(ship.PosX != newX){
        //move along x-axis
        ship.move(ship.PosX+xUnitVector, ship.PosY);
        drawGame();
        //if remaining distance to move along x-axis is more than 1.5x the remaining distance along y-axis, move again
        if(ship.PosX != newX && (Math.abs((ship.PosX-newX)) > 1.5*Math.abs(ship.PosY-newY))){
            ship.move(ship.PosX+xUnitVector, ship.PosY);
            drawGame();
        }
    }

    if(ship.PosY != newY){
        ship.move(ship.PosX, ship.PosY+yUnitVector);
        drawGame();
        if(ship.PosY != newY && (Math.abs((ship.PosY-newY)) > 1.5*Math.abs(ship.PosX-newX))) {
            ship.move(ship.PosX, ship.PosY+yUnitVector);
            drawGame();
        }
    }

    if(ship.PosX == newX && ship.PosY == newY)
      clearInterval(gm);
}




function move(e)
{
    e.preventDefault();

    switch(e.keyCode)
    {
        case 37:
            if(ship.PosX - 1 >= 0 && ship.PosX - 1 <= 127)
                ship.PosX = ship.PosX-1;
            break;
        case 38:
            if(ship.PosY - 1 >= 0 && ship.PosY - 1 <= 127)
                ship.PosY = ship.PosY-1;
            break;
        case 39:
            if(ship.PosX + 1 >= 0 && ship.PosX + 1 <= 127)
                ship.PosX = ship.PosX+1;
            break;
        case 40:
            if(ship.PosY + 1 >= 0 && ship.PosY + 1 <= 127)
                ship.PosY = ship.PosY+1;
            break;
    }
    collison(ship.PosX,ship.PosY);
    drawGame();
}

function collison(x,y)
{
    var tile = gameMap.getTile(x, y);
    var obj = tile.val;
    switch(obj) {
        case 0:
            obj = 0;
            alert ('this is a wormhome,dead');
            break;
        case 1:
            obj = 1;
            alert('this is planet');
            break;
        case 2:
            obj = 2;
            alert('this is station');
            break;
        case 3:
            obj = 3; // space, so keep moving
            break;
    }
}

function drawGame()
{
    var offX = 0;
    var offY = 0;

    //Case 1: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit lower to not go out of bounds
    if(ship.PosX - 16 < 0) { offX = (16 - ship.PosX); }
    if(ship.PosY - 16 < 0) { offY = (16 - ship.PosY); }

    //Case 2: offset top left(x,y) to not display out of bounds "black" mao
    //Basically display starts a bit higher to not go out of bounds
    if(ship.PosX + 16 > 128) { offX = -(ship.PosX - 112); }
    if(ship.PosY + 16 > 128) { offY = -(ship.PosY - 112); }

    var pos =
    {
        x: 0,
        y: 0,
    }

    for(var x = 0; x < cameraSize; x++)
    {
        for(var y = 0; y < cameraSize; y++)
        {

            pos.x =  Math.round((ship.PosX) - cameraSize/2) + x + offX;
            pos.y =  Math.round((ship.PosY) - cameraSize/2) + y + offY;

            var tile = gameMap.getTile(pos.x, pos.y);

            if(pos.x == ship.PosX && pos.y == ship.PosY)
            {
                ctx.fillStyle = "black";
                ctx.fillRect(x * ts, y * ts, ts, ts);

                //TODO: set scanner range in ship, to calculate visibility instead of +-1
                for(var i = -1; i < 2; i++)
                {
                    for(var j = -1; j < 2; j++)
                    {
                        if(pos.x + i >=0 && pos.x + i <= 127 && pos.y + j >= 0 && pos.y + j <= 127)
                        {
                            var sensTile = gameMap.getTile(pos.x + i, pos.y + j);
                            sensTile.vis = true;
                        }
                    }
                }
            }
            else
            {
                if(!tile.vis) { ctx.fillStyle = "pink"; }
                else
                {
                    objects.updateColor(tile.val);
                    ctx.fillStyle = objects.currColor;
                }
                ctx.fillRect(x * ts, y * ts, ts, ts);
            }
        }
    }
    saveState();
    requestAnimationFrame(drawGame);
}


// This will modify the map based on the sensor when
// the button is pressed...no button yet.
function activate_sensor()
{

}

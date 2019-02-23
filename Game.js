document.addEventListener("keydown", move);


//!!!EVERYTHING you might need is already in here.
//Just grab it and use for your functions.
var gameVars =
{
    ctx:            null,
    cameraSize:     32,
    Ts:             608/32,
    ship:           null,
    gameMap:        null,

    //Vals supplied by Settings in the menu -
    //will be supplied in the create game and updated here
    fix_start:      false,
    init_energy:    1000,
    init_supplies:  100,
    init_credits:   1000,
    fix_wormhole:   false,
    unlim_game:     false,
    mapSize:        128,
}

//Values for the movement
var currDistance = 0;


//Updating when scroller in game is touched
function updateDistance(newVal)
{
    currDistance = newVal;
}

//Calls this function when user wants to move (submit movement is pushed)
function startMovement(direction)
{
//    startMove(currDistance, currDegree);
  switch(direction){
    case 0:
      startMove(0, -currDistance);
      break;
    case 1:
      startMove(0, currDistance);
      break;
    case 2:
      startMove(-currDistance, 0);
      break;
    case 3:
      startMove(currDistance, 0);
      break;
  }
}

//Calls this function when user wants to use sensor (sensor button is pushed)
function callSensor()
{
    activate_sensor();
}

function loadSaved(fS, iE, iS, iC, fW, uG, mS)
{
    if(testPersist())
    {
        loadState();
        gameVars.ctx = document.getElementById('game').getContext("2d");
        drawGame();
    }
    else createGame(fS, iE, iS, iC, fW, uG, mS);
}

function createGame(fS, iE, iS, iC, fW, uG, mS)
{
    gameVars.fix_start = fS;
    gameVars.init_energy = iE;
    gameVars.init_supplies = iS;
    gameVars.init_credits = iC;
    gameVars.fix_wormhole = fW;
    gameVars.unlim_game = uG;
    gameVars.mapSize = mS;

    gameVars.ship = new Ship(fS, iE, iS, iC, mS);
    gameVars.gameMap = new Map(mS);
    gameVars.ctx = document.getElementById('game').getContext("2d");
    drawGame();
}

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

function collision(x,y)
{
    var tile = gameVars.gameMap.getTile(x, y);
    var obj = tile.val;
      switch(obj)
      {
          case 0:
              obj = 0;
              alert ('this is a wormhole');
              return 'wormhole'
          case 1:
              obj = 1;
              alert('this is planet');
              return 'planet';
          case 2:
              obj = 2;
              alert('this is station');
              return 'station';
          case 3:
              obj = 3; // space, so keep moving
              break;
      }
    return 'empty';
}

function decreaseEnergy(dist)
{
    gameVars.ship.energy -= 10*Math.abs(dist);
    if(gameVars.ship.energy <= 0 && gameVars.unlim_game == false){
      alert("Out of energy, game over!");
      window.location.reload();
    }
}

function decreaseSupplies()
{
    gameVars.ship.supplies -= 0.02*gameVars.ship.supplies;
    if(gameVars.ship.supplies <= 0 && gameVars.unlim_game == false){
      alert("Out of supplies, game over!");
      window.location.reload();
    }
}


function startMove(x, y){
  var newX = gameVars.ship.posX + x;
  var newY = gameVars.ship.posY + y;
  if(x != 0){x /= Math.abs(x);}
  if(y != 0){y /= Math.abs(y);}

  if((x != 0 && y != 0) && gameVars.ship != null){
    alert("Something is wrong");
  }

  //only decrease supplies per "turn".
  //this logic should perhaps be on keypress in menu? that way any action
  //that takes a turn can call decreaseSupplies (scanning, going into orbit, docking with a station)
  //seems like cleaner control.
  decreaseSupplies();
  var gm = setInterval(function(){shipMove(gm, x, y, newX, newY);}, 1);
}

var shipMove = function(gm, x, y, newX, newY){



  var nextX = gameVars.ship.posX + x;
  var nextY = gameVars.ship.posY + y;
  var tileOccupant = 'empty';

  decreaseEnergy(1);

  if(gameVars.ship != null){
    console.log("x:"+x+" y:"+y);
    console.log("current: ("+gameVars.ship.posX+","+gameVars.ship.posY+")");
    console.log("next:    ("+nextX+","+nextY+")");
    console.log("new:     ("+newX+","+newY+")");
  }

  //wormhole behavior
  if(nextX < 0 || nextX >= gameVars.mapSize || nextY < 0 || nextY >= gameVars.mapSize){
    gameVars.ship.move(Math.floor(Math.random() * (map_size - 2)), Math.floor(Math.random() * (map_size - 2)));
    clearInterval(gm);
    alert("You wormholed!")
  }

  //non wormhole behavior - still need to move
  else if(gameVars.ship.posX != newX || gameVars.ship.posY != newY){
    gameVars.ship.move(nextX, nextY);
    drawGame();

    //needs to be in this wrapper to avoid scope issues i think?
    if(gameVars.ship != null){
      tileOccupant = collision(gameVars.ship.posX, gameVars.ship.posY);
    }
    if(tileOccupant != 'empty'){
      clearInterval(gm);
      if(tileOccupant == 'planet'){
        alert("YOU CRASHED INTO A PLANET AND DIEEEEEEEEEED!!!!!");
        window.location.reload();
      }
      else if(tileOccupant == 'wormhole'){
        gameVars.ship.move(Math.floor(Math.random() * (map_size - 2)), Math.floor(Math.random() * (map_size - 2)));
        alert("You wormholed!")
      }
    }
  }

  //only other option is that we're done moving and have arrived at our location
  else{
    alert("You have arrived at ("+newX+','+newY+').');
    clearInterval(gm);
  }
}

/*
function startMove(dist, degr)
{
    //can hardcode in different angles and distances
    var userInput = {angle: degr, magnitude: dist}
    //this is what I'd like to use eventually: var userInput = {angle: document.getElementById("userInterface").elements["angle"], magnitude: document.getElementById("userInterface").elements["magnitude"]};

    //figures out how many units along x-axis and how many units along y-axis we have to go
    var runRise = gameVars.ship.calculateXY(userInput); //this function returns an object {x: ?, y: ?}
    var newPos = {x: gameVars.ship.posX + runRise.x, y: gameVars.ship.posY + runRise.y};

    var xUnitVector = 0;
    if(runRise.x != 0){
      xUnitVector = runRise.x/Math.abs(runRise.x);
    }
    var yUnitVector = 0;
    if(runRise.y != 0){
      yUnitVector = runRise.y/Math.abs(runRise.y);
    }

    var gm = setInterval(function(){shipMove(gm, newPos.x, xUnitVector, newPos.y, yUnitVector);}, 1);
}
*/
/*
var shipMove = function(gm, newX, xUnitVector, newY, yUnitVector)
{
//    if(ship still needs to move left/right AND ship hasn't hit left side of map AND ship hasn't hit right side of map
    if((gameVars.ship.posX != newX) && (gameVars.ship.posX+xUnitVector >= 0) && (gameVars.ship.posX+xUnitVector < gameVars.mapSize))
    {
        gameVars.ship.move(gameVars.ship.posX + xUnitVector, gameVars.ship.posY);

        if(gameVars.ship != null){
          collision(gameVars.ship.posX, gameVars.ship.posY);
        }
        decreaseEnergy(xUnitVector);
        decreaseSupplies();

        drawGame();
        //if(ship still needs to move left/right AND ship's remaining movement left/right is more than 1.5x remaining movement up/down)
        if(gameVars.ship.posX != newX && (Math.abs((gameVars.ship.posX-newX)) > 1.5*Math.abs(gameVars.ship.posY-newY)))
        {
            gameVars.ship.move(gameVars.ship.posX + xUnitVector, gameVars.ship.posY);

            if(gameVars.ship != null){
              collision(gameVars.ship.posX, gameVars.ship.posY);
            }
            decreaseEnergy(xUnitVector);
            decreaseSupplies();

            drawGame();
        }
    }
//    if(ship still needs to move up/down AND ship hasn't hit top of map AND ship hasn't hit bottom of map)
    if((gameVars.ship.posY != newY) && (gameVars.ship.posY+yUnitVector >= 0) && (gameVars.ship.posY+yUnitVector < gameVars.mapSize))
    {
        gameVars.ship.move(gameVars.ship.posX, gameVars.ship.posY + yUnitVector);

        if(gameVars.ship != null){
          collision(gameVars.ship.posX, gameVars.ship.posY);
        }
        decreaseEnergy(yUnitVector);
        decreaseSupplies();

        drawGame();
        if(gameVars.ship.posY != newY && (Math.abs((gameVars.ship.posY-newY)) > 1.5*Math.abs(gameVars.ship.posX-newX)))
        {
            gameVars.ship.move(gameVars.ship.posX, gameVars.ship.posY + yUnitVector);

            if(gameVars.ship != null){
              collision(gameVars.ship.posX, gameVars.ship.posY);
            }
            decreaseEnergy(yUnitVector);
            decreaseSupplies();

            drawGame();
        }
    }
    if(gameVars.ship.posX == newX && gameVars.ship.posY == newY)
    {
        alert("Arrived");
        clearInterval(gm);
    }

//    alert("position: x = " + gameVars.ship.posX + " y = " + gameVars.ship.posY + "\nxUnitVector = " + xUnitVector + "\nyUnitVector = " + yUnitVector);
    else if(gameVars.ship.posX+xUnitVector < 0 || gameVars.ship.posX+xUnitVector > 127 || gameVars.ship.posY+yUnitVector < 0 || gameVars.ship.posY+yUnitVector > 127)
    {
      alert("Arrived");
      clearInterval(gm);
    }
}

*/
function move(e)
{
    e.preventDefault();

    switch(e.keyCode)
    {
        case 37:
            if(gameVars.ship.posX - 1 >= 0 && gameVars.ship.posX - 1 <= gameVars.mapSize-1)
                gameVars.ship.posX = gameVars.ship.posX-1;
            break;
        case 38:
            if(gameVars.ship.posY - 1 >= 0 && gameVars.ship.posY - 1 <= gameVars.mapSize-1)
                gameVars.ship.posY = gameVars.ship.posY-1;
            break;
        case 39:
            if(gameVars.ship.posX + 1 >= 0 && gameVars.ship.posX + 1 <= gameVars.mapSize-1)
                gameVars.ship.posX = gameVars.ship.posX+1;
            break;
        case 40:
            if(gameVars.ship.posY + 1 >= 0 && gameVars.ship.posY + 1 <= gameVars.mapSize-1)
                gameVars.ship.posY = gameVars.ship.posY+1;
            break;
        case 32:

            break;
    }
    drawGame();
}

function drawGame()
{
//    console.log(gameVars.mapSize);
    var ts = gameVars.Ts;
    var offX = 0;
    var offY = 0;

    //Case 1: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit lower to not go out of bounds
    if(gameVars.ship.posX - 16 < 0) { offX = (16 - gameVars.ship.posX); }
    if(gameVars.ship.posY - 16 < 0) { offY = (16 - gameVars.ship.posY); }

    //Case 2: offset top left(x,y) to not display out of bounds "black" mao
    //Basically display starts a bit higher to not go out of bounds
    if(gameVars.ship.posX + 16 > gameVars.mapSize) { offX = -(gameVars.ship.posX - (gameVars.mapSize - 16)); }
    if(gameVars.ship.posY + 16 > gameVars.mapSize) { offY = -(gameVars.ship.posY - (gameVars.mapSize - 16)); }

    var pos =
    {
        x: 0,
        y: 0,
    }

    for(var x = 0; x < gameVars.cameraSize; x++)
    {
        for(var y = 0; y < gameVars.cameraSize; y++)
        {

            pos.x =  Math.round((gameVars.ship.posX) - gameVars.cameraSize/2) + x + offX;
            pos.y =  Math.round((gameVars.ship.posY) - gameVars.cameraSize/2) + y + offY;

            var tile = gameVars.gameMap.getTile(pos.x, pos.y);

            if(pos.x == gameVars.ship.posX && pos.y == gameVars.ship.posY)
            {
                gameVars.ctx.fillStyle = "black";
                gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);

                //TODO: set scanner range in ship, to calculate visibility instead of +-1
                for(var i = -1; i < 2; i++)
                {
                    for(var j = -1; j < 2; j++)
                    {
                        if(pos.x + i >=0 && pos.x + i <= gameVars.mapSize-1 && pos.y + j >= 0 && pos.y + j <= gameVars.mapSize-1)
                        {
                            var sensTile = gameVars.gameMap.getTile(pos.x + i, pos.y + j);
                            sensTile.vis = true;
                        }
                    }
                }
            }
            else
            {
                if(!tile.vis) { gameVars.ctx.fillStyle = "pink"; }
                else
                {
                    objects.updateColor(tile.val);
                    gameVars.ctx.fillStyle = objects.currColor;
                }
                gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);
            }
        }
    }

    gameVars.ctx.fillStyle = "#7FFF00";
    gameVars.ctx.fillText("Health: " + gameVars.ship.health, 20, 30);

    gameVars.ctx.fillStyle = "#7FFF00";
    gameVars.ctx.fillText("Energy: " + gameVars.ship.energy, 20, 45);

    gameVars.ctx.fillStyle = "#7FFF00";
    gameVars.ctx.fillText("Supplies: " + gameVars.ship.supplies, 20, 60);

    gameVars.ctx.fillStyle = "#7FFF00";
    gameVars.ctx.fillText("Credits: " + gameVars.ship.credits , 20, 75);

    gameVars.ctx.fillStyle = "#7FFF00";
    gameVars.ctx.fillText("Position: " + gameVars.ship.posX + ":" + gameVars.ship.posY, 520, 30)

    saveState();
}

// This will modify the map based on the sensor when
// the button is pressed...no button yet.
function activate_sensor()
{
    var pos_x = gameVars.ship.posX;
    var pos_y = gameVars.ship.posY;

    for(var i = -2; i < 3; i++)
    {
        for(var j = -2; j < 3; j++)
        {
            if(pos_x + i >=0 && pos_x + i <= gameVars.mapSize-1 && pos_y + j >= 0 && pos_y + j <= gameVars.mapSize-1)
            {
                var sensTile = gameVars.gameMap.getTile(pos_x + i, pos_y + j);
                sensTile.vis = true;
            }
        }
    }
    gameVars.ship.consume_supplies(0.02);
    saveState();
    //requestAnimationFrame(drawGame);
    drawGame();
}

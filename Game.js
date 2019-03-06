document.addEventListener("keydown", move);


var spaceshipUp = new Image();
spaceshipUp.src = "images/spaceship.png";
spaceshipUp.width = 38;
spaceshipUp.height = 38;

var spaceshipRight = new Image();
spaceshipRight.src = "images/spaceshipRight.png";
spaceshipRight.width = 38;
spaceshipRight.height = 38;

var spaceshipLeft = new Image();
spaceshipLeft.src = "images/spaceshipLeft.png";
spaceshipLeft.width = 38;
spaceshipLeft.height = 38;

var spaceshipDown = new Image();
spaceshipDown.src = "images/spaceshipDown.png";
spaceshipDown.width = 38;
spaceshipDown.height = 38;

var asteroid = new Image();
asteroid.src = "images/Asteroid.png";
asteroid.width = 38;
asteroid.height = 38;

var planet = new Image();
planet.src = "images/azuria_norings.png";
planet.width = 38;
planet.height = 38;

var station = new Image();
station.src = "images/station.png";
station.width = 38;
station.height = 38;

var freighter = new Image();
freighter.src = "images/freighter.png";
freighter.width = 38;
freighter.height = 38;

var wormhole = new Image();
wormhole.src = "images/wormhole.png";
wormhole.width = 38;
wormhole.height = 38;

//Keeps visited coordinates 
var visited = [];

//!!!EVERYTHING you might need is already in here.
//Just grab it and use for your functions.
var gameVars =
{
    ctx:            null,
    cameraSize:     16,
    Ts:             608/16,
    ship:           null,
    gameMap:        null,

    //Vals supplied by Settings in the menu -
    //will be supplied in the create game and updated here
    fix_start:      false,
    startX:         1,
    startY:         1,
    init_energy:    1000,
    init_supplies:  100,
    init_credits:   1000,
    fix_wormhole:   false,
    unlim_game:     false,
    mapSize:        128,
    fix_objects:    false,
    object_list:    {}, //Dictionary of all objects and their locations
    saved_games:    ["default"], //List of all saved game states.
    planets:        {} //Dictionary of planets
}

//For minimap
var miniVars =
{
  ctx:    null,
  tileSize:   null,
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

  console.log("currDistance: "+currDistance);
//    startMove(currDistance, currDegree);
  switch(direction){
    //up
    case 0:
      startMove(0, (-1*currDistance));
      break;
    //down
    case 1:
      startMove(0, (currDistance));
      break;
    //left
    case 2:
      startMove((-1*currDistance), 0);
      break;
    //right
    case 3:
      startMove((currDistance), 0);
      break;
  }
}

//Calls this function when user wants to use sensor (sensor button is pushed)
function callSensor()
{
    activate_sensor();
}

function loadSaved(fS, Sl, iE, iS, iC, fW, uG, mS, fO)
{
    if(testPersist() === true)
    {
        i = 0;
        loadSaves();
        name = prompt("Please enter the name of the saved game you would like to load: ", " ");
        while((loadState(name) === false) && (i < 3))
        {
            name = prompt("Name entered is invalid, please try again: ", " ");
            i += 1
        }

        if(i == 3)
        {
            alert("Load unsuccessful. Press 'OK' to begin a new game.");

            createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
               init_game.fix_wormhole, init_game.unlim_game, init_game.map_size, false);
        }

        gameVars.ctx = document.getElementById('game').getContext("2d");
        drawGame(38);
    }
    else
    {
        alert("You have no saved games! Press 'OK' to begin a new game.");
        //createGame(fS, iE, iS, iC, fW, uG, mS);
        createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
               init_game.fix_wormhole, init_game.unlim_game, init_game.map_size, false);
    }
}

function createGame(fS, iE, iS, iC, fW, uG, mS, fO)
{
    gameVars.fix_start = fS;
    gameVars.init_energy = iE;
    gameVars.init_supplies = iS;
    gameVars.init_credits = iC;
    gameVars.fix_wormhole = fW;
    gameVars.unlim_game = uG;
    gameVars.mapSize = mS;
    gameVars.fix_objects = fO;

    gameVars.ship = new Ship(fS, iE, iS, iC, mS);
    gameVars.gameMap = new Map(mS);
    gameVars.gameMap.buildRandom();
    gameVars.ctx = document.getElementById('game').getContext("2d");

    miniVars.ctx = document.getElementById('minimap').getContext("2d");
    miniVars.tileSize = (192/mS);

    makeVisible();
    drawGame(38);

    //addObjectsToList();
}

/*
Adds all the objects to the list
*/
function addObjectsToList()
{
  for(var x = 0; x < gameVars.mapSize - 1; x++)
  {
    for(var y = 0; y < gameVars.mapSize - 1; y++)
    {
      if(gameVars.gameMap.getTile(x, y).val != 3 && gameVars.gameMap.getTile(x, y).val != 0)
      {
        var ul = document.getElementById("list");
        var li = document.createElement("li");

        var knd = getObject(gameVars.gameMap.getTile(x, y).val);
        li.appendChild(document.createTextNode(x + " " + y + " " + knd));

        //li.setAttribute("id", "element4");
        ul.appendChild(li);
      }
    }
  }
}

function addObjectsToList(x, y)
{
  var currTile = gameVars.gameMap.getTile(x, y);
  if(currTile.val != 3 && !visited.includes(currTile))
  {
    //console.log(434);
    var ul = document.getElementById("list");
    var li = document.createElement("li");

    var knd = getObject(gameVars.gameMap.getTile(x, y).val);
    li.appendChild(document.createTextNode("[" + x + ":" + y + "] " + knd));

    //li.setAttribute("id", "element4");
    ul.appendChild(li);
    visited.push(currTile);
  }
}

/*
Helper function to get kind of the object (e.g.: planet, station etc)
*/
function getObject(kind)
{
  switch(kind)
  {
    case 0:
      return "Wormhole";
    case 1:
      return "Planet";
    case 2:
      return "Station";
    case 4:
      return "Freighter";
    case 5:
      return "Dock";
    default:
      return "Unknown";
  }
}

var objects =
{
    wormHole    :["red", 0],
    asteroid    :["green", 1],
    station     :["purple", 2],
    space       :["black", 3],
    planet      :["blue", 111],
    freighter   :["CHOCOLATE",4],
    dock        :["SALMON",5],
    currColor   : null,

    //sets currColor to be used in drawGame()
    updateColor(index)
    {
        if(index == 0) { this.currColor = "red"; }
        else if(index == 1) { this.currColor = "green"; }
        else if(index == 2) { this.currColor = "purple"; }
        else if(index == 111){this.currColor = "blue"; }
        else if (index == 4){this.currColor = "CHOCOLATE";}
        else if (index == 5){this.currColor = "SALMON";}
        else { this.currColor = "black"; }
    }
};

//Add the given object obj to (x,y) in the dictionary
function addObject(obj) {
  var entered = window.prompt("Where would you like to add the object?", "(0, 0)");
  var nums = entered.match(/\d+/g); //Regex for matching numbers, gets a list of strings containing only digits
  if (nums.length < 2)
   alert("Error: must provide an X and a Y coordinate");
  var x = nums[0];
  var y = nums[1];

  if((x + ':' + y) in gameVars.object_list) {
    alert("There's already something in that location!");
    return;
  }

  gameVars.object_list[(x + ':' + y)] = obj;
}

function collision(x, y) {
  var tile = gameVars.gameMap.getTile(x, y);
  var obj = tile.val;
  switch (obj) {
    case 0:
      alert('this is a wormhole');
      return 'wormhole';
    case 1:
      alert('this is asteroid');
      return 'asteroid';
    case 2:
      alert('this is station');
      return 'station';
    case 4:
      var s = Math.floor(Math.random() * 100) + 20;
      var e = Math.floor(Math.random() * 100) + 50;
      alert("You took on the the abandoned freighter " + s + " supplies " + e + " energies");
      gameVars.ship.energy += e; // increase eneryy by 5
      gameVars.ship.supplies += s;
      gameVars.gameMap.removeTile(x, y);
      return 'freighter';
    case 5:
      alien();
      gameVars.gameMap.removeTile(x, y);
      return 'dock';

    case 3:
      // space, so keep moving
      break;
    case 111:
      var planet = gameVars.gameMap.getPlanetByCoords(x, y);
      alert("somethign");
  }
  return 'empty';
}

function alien ()
{
  var answer = prompt("hey I am a Casinian, do you want to play a game with me. You could earn a reward if you are lucky? (y or n)");
  if (answer == 'y' || answer == 'Y') {
    var keepgoing = true;
    while (keepgoing) {
      var input = prompt("Easy game. Guess my favorite number from 1-10. If you win, the number is your additional energy.")
      var result = Math.floor(Math.random() * 10 + 1)

      if (input == result) {
        alert("Wow, you have more luck than I though. Here your reward energy " + result)
        gameVars.ship.energy += result;
        keepgoing = false;
      }
      else {
        alert("Better luck next time")
        keepgoing = false;
      }
    }
  }
}


function decreaseEnergy(dist)
{
    gameVars.ship.energy -= 10*Math.abs(dist);
    if(gameVars.ship.energy <= 0 && gameVars.unlim_game == false){
      die(1);
    }
}

function decreaseSupplies()
{
    gameVars.ship.supplies -= 0.02*gameVars.ship.supplies;
    if(gameVars.ship.supplies <= 0 && gameVars.unlim_game == false){
      die(2);
    }
}

function die(flag)
{
  if(flag ==1){
    alert("You run out of Energy. Game Over!");
    window.location.reload();
  }
    else if(flag ==2){
       alert("You run out of Supplies. Game Over!");
       window.location.reload();
  }
      else if(flag ==3){ //this could add in decreasehealth() function.
        alert("You are destoryed and No health. Game Over!");
        window.location.reload();
      }
        else if(flag ==4){ //this cound add in BadMax choose kill ship.
          alert("You are killed by BadMax. Game Over!");
          window.location.reload();
        }
          else if(flag ==5){
            alert("Asteroid Collision Destroy your ship. Game Over!");
            window.location.reload();
          }
    //  window.location.reload();
}


function startMove(x, y){

  console.log("current position: ("+gameVars.ship.posX+','+gameVars.ship.posY+')');
  console.log("arguments: ("+x+","+y+")");


  var newX = eval(gameVars.ship.posX) + eval(x);
  var newY = eval(gameVars.ship.posY) + eval(y);

  console.log("calculated destination: ("+newX+","+newY+")");

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
            // left=37 up=38 right=39 down=40

function calculateKeyCode(x, y){
  if(x < 0){
    return 37;
  }else if(x > 0){
    return 39;
  }else if(y < 0){
    return 38;
  }else{
    return 40;
  }
}

var shipMove = function(gm, x, y, newX, newY){
  var nextX = gameVars.ship.posX + x;
  var nextY = gameVars.ship.posY + y;
  var tileOccupant = 'empty';

  decreaseEnergy(1);

  //wormhole behavior
  if(nextX < 0 || nextX >= gameVars.mapSize || nextY < 0 || nextY >= gameVars.mapSize){
    gameVars.ship.move(Math.floor(Math.random() * (gameVars.mapSize - 2)), Math.floor(Math.random() * (gameVars.mapSize - 2)));
    makeVisible();
    drawGame(calculateKeyCode(x, y));
    clearInterval(gm);
    alert("You wormholed!");
  }

  //non wormhole behavior - still need to move
  else if(gameVars.ship.posX != newX || gameVars.ship.posY != newY){
    gameVars.ship.move(nextX, nextY);
    makeVisible();
    drawGame(calculateKeyCode(x, y));

    //needs to be in this wrapper to avoid scope issues i think?
    if(gameVars.ship != null){tileOccupant = collision(gameVars.ship.posX, gameVars.ship.posY);}

    if(tileOccupant != 'empty'){
      clearInterval(gm);
      if(tileOccupant == 'asteroid'){
        die(5);
      }
      else if(tileOccupant == 'wormhole'){
        gameVars.ship.move(Math.floor(Math.random() * (gameVars.mapSize - 2)), Math.floor(Math.random() * (gameVars.mapSize - 2)));
        makeVisible();
        drawGame(calculateKeyCode(x, y));
        clearInterval(gm);
        alert("You wormholed!");
      }
    }
  }

  //only other option is that we're done moving and have arrived at our location
  else{
    alert("You have arrived at ("+newX+','+newY+').');
    clearInterval(gm);
  }
}

function move(e)
{
    e.preventDefault();

    switch(e.keyCode)
    {
        case 37:
            if(gameVars.ship.posX - 1 >= 0 && gameVars.ship.posX - 1 <= gameVars.mapSize-1) {
                gameVars.ship.posX = gameVars.ship.posX-1;
                collision(gameVars.ship.posX, gameVars.ship.posY); }
            break;
        case 38:
            if(gameVars.ship.posY - 1 >= 0 && gameVars.ship.posY - 1 <= gameVars.mapSize-1) {
                gameVars.ship.posY = gameVars.ship.posY-1;
                collision(gameVars.ship.posX, gameVars.ship.posY); }
            break;
        case 39:
            if(gameVars.ship.posX + 1 >= 0 && gameVars.ship.posX + 1 <= gameVars.mapSize-1) {
                gameVars.ship.posX = gameVars.ship.posX+1;
                collision(gameVars.ship.posX, gameVars.ship.posY); }
            break;
        case 40:
            if(gameVars.ship.posY + 1 >= 0 && gameVars.ship.posY + 1 <= gameVars.mapSize-1) {
                gameVars.ship.posY = gameVars.ship.posY+1;
                collision(gameVars.ship.posX, gameVars.ship.posY);}
            break;
    }
    decreaseEnergy(1);
    makeVisible();
    drawGame(e.keyCode);
}

//Make tiles around the ship visible
function makeVisible()
{
  for(var i = -1; i < 2; i++)
  {
      for(var j = -1; j < 2; j++)
      {
          if(gameVars.ship.posX + i >= 0 && gameVars.ship.posX + i <= gameVars.mapSize-1 && gameVars.ship.posY + j >= 0 && gameVars.ship.posY + j <= gameVars.mapSize-1)
          {
              var sensTile = gameVars.gameMap.getTile(gameVars.ship.posX + i, gameVars.ship.posY + j);
              addObjectsToList(gameVars.ship.posX + i, gameVars.ship.posY + j)
              sensTile.vis = true;
          }
      }
  }
}

function drawGame()
{
    var ts = gameVars.Ts;
    var offX = 0;
    var offY = 0;

    //Case 1: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit lower to not go out of bounds
    if(gameVars.ship.posX - 8 < 0) { offX = (8 - gameVars.ship.posX); }
    if(gameVars.ship.posY - 8 < 0) { offY = (8 - gameVars.ship.posY); }

    //Case 2: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit higher to not go out of bounds
    if(gameVars.ship.posX + 8 > gameVars.mapSize) { offX = -(gameVars.ship.posX - (gameVars.mapSize - 8)); }
    if(gameVars.ship.posY + 8 > gameVars.mapSize) { offY = -(gameVars.ship.posY - (gameVars.mapSize - 8)); }

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

            //If this is ships coords
            if(pos.x == gameVars.ship.posX && pos.y == gameVars.ship.posY)
            {
                //Ensure correct background is shown
                objects.updateColor(tile.val);
                gameVars.ctx.fillStyle = "black";
                gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);

                //Draw the ship
                gameVars.ctx.drawImage(spaceshipUp, x*ts, y*ts, ts, ts);
            }
            else
            {
                if(!tile.vis) {
                	gameVars.ctx.fillStyle = "#848484";

                	gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);
                }
                else
                {
                    objects.updateColor(tile.val);
                    gameVars.ctx.fillStyle = objects.currColor;

                    gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);

                    if(tile.val == 111)
                    	gameVars.ctx.drawImage(planet, x*ts, y*ts, ts, ts)

                    if(tile.val == 2)
                    	gameVars.ctx.drawImage(station, x*ts, y*ts, ts, ts)

                    if(tile.val == 4)
                    	gameVars.ctx.drawImage(freighter, x*ts, y*ts, ts, ts)

                   //if(tile.val == 5)
                   // 	gameVars.ctx.drawImage(station, x*ts, y*ts, ts, ts)
                }


                gameVars.ctx.strokeStyle = "green";
                gameVars.ctx.strokeRect(x * ts, y * ts, ts, ts);
            }
        }
    }

    gameVars.ctx.font = "20px Georgia";
    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Health: " + gameVars.ship.health, 20, 30);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Energy: " + gameVars.ship.energy, 20, 55);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Supplies: " + gameVars.ship.supplies, 20, 80);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Credits: " + gameVars.ship.credits , 20, 105);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Position: " + gameVars.ship.posX + ":" + gameVars.ship.posY, 460, 30);

    drawMini();
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
                addObjectsToList(pos_x + i, pos_y + j);
                sensTile.vis = true;
            }
        }
    }
    gameVars.ship.consume_supplies(0.02);
    drawGame(38);
}


function drawGame(drctn)
{
    var ts = gameVars.Ts;
    var offX = 0;
    var offY = 0;

    //Case 1: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit lower to not go out of bounds
    if(gameVars.ship.posX - 8 < 0) { offX = (8 - gameVars.ship.posX); }
    if(gameVars.ship.posY - 8 < 0) { offY = (8 - gameVars.ship.posY); }

    //Case 2: offset top left(x,y) to not display out of bounds "black" mao
    //Basically display starts a bit higher to not go out of bounds
    if(gameVars.ship.posX + 8 > gameVars.mapSize) { offX = -(gameVars.ship.posX - (gameVars.mapSize - 8)); }
    if(gameVars.ship.posY + 8 > gameVars.mapSize) { offY = -(gameVars.ship.posY - (gameVars.mapSize - 8)); }

    var pos =
    {
        x: 0,
        y: 0,
    }

    drawMini();

    for(var x = 0; x < gameVars.cameraSize; x++)
    {
        for(var y = 0; y < gameVars.cameraSize; y++)
        {

            pos.x =  Math.round((gameVars.ship.posX) - gameVars.cameraSize/2) + x + offX;
            pos.y =  Math.round((gameVars.ship.posY) - gameVars.cameraSize/2) + y + offY;

            var tile = gameVars.gameMap.getTile(pos.x, pos.y);

            //If this is ships coords
            if(pos.x == gameVars.ship.posX && pos.y == gameVars.ship.posY)
            {
              //Ensure correct background is shown
              //objects.updateColor(tile.val);
              gameVars.ctx.fillStyle = "black";
              gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);

              //Draw the ship
              if(drctn == 38) gameVars.ctx.drawImage(spaceshipUp, x*ts, y*ts, ts, ts);
              else if(drctn == 40) gameVars.ctx.drawImage(spaceshipDown, x*ts, y*ts, ts, ts);
              else if(drctn == 37) gameVars.ctx.drawImage(spaceshipLeft, x*ts, y*ts, ts, ts);
              else gameVars.ctx.drawImage(spaceshipRight, x*ts, y*ts, ts, ts);
            }
            //Else something besides ship
            else
            {
                if(!tile.vis) 
                {
                	gameVars.ctx.fillStyle = "#848484";
                	gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);
                }
                else
                {
                    //objects.updateColor(tile.val);
                    gameVars.ctx.fillStyle = "black";
                    gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);

                    if(tile.val == 0)
                      gameVars.ctx.drawImage(wormhole, x*ts, y*ts, ts, ts);
                    else if(tile.val == 1)
                    	gameVars.ctx.drawImage(planet, x*ts, y*ts, ts, ts);
                    else if(tile.val == 2)
                    	gameVars.ctx.drawImage(station, x*ts, y*ts, ts, ts);
                    else if(tile.val == 4)
                      gameVars.ctx.drawImage(freighter, x*ts, y*ts, ts, ts);
                      /*
                    else
                    {
                      gameVars.ctx.fillStyle = "black";
                      gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);
                    }
                    */
                }

                gameVars.ctx.strokeStyle = "red";
                gameVars.ctx.strokeRect(x * ts, y * ts, ts, ts);
            }
        }
    }

    gameVars.ctx.font = "20px Georgia";
    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Health: " + gameVars.ship.health, 20, 30);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Energy: " + gameVars.ship.energy, 20, 55);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Supplies: " + gameVars.ship.supplies, 20, 80);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Credits: " + gameVars.ship.credits , 20, 105);

    gameVars.ctx.fillStyle = "blue";
    gameVars.ctx.fillText("Position: " + gameVars.ship.posX + ":" + gameVars.ship.posY, 460, 30);

    //drawMini();
}

function drawMini()
{
  var ts = miniVars.tileSize;
  for(var i = 0; i <= gameVars.mapSize-1; i++)
  {
    for(var j = 0; j <= gameVars.mapSize-1; j++)
    {
      var tile = gameVars.gameMap.getTile(i, j);

      //If this is ships coords
      if(i == gameVars.ship.posX && j == gameVars.ship.posY)
      {
        //Ensure correct background is shown
        objects.updateColor(tile.val);

        miniVars.ctx.fillStyle = "yellow";//objects.currColor;
        miniVars.ctx.fillRect(i * ts, j * ts, ts, ts);
      }
      else
      {
          if(!tile.vis) { miniVars.ctx.fillStyle = "pink"; }
          else
          {
              objects.updateColor(tile.val);
              miniVars.ctx.fillStyle = objects.currColor;
          }
          miniVars.ctx.fillRect(i * ts, j * ts, ts, ts);
      }
    }
  }
}

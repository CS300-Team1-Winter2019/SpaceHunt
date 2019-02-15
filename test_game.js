var ctx = null;
var cameraSize =32;
var ts = 608/32;
var ship = new Ship(1000);
var gameMap = new Map();
//document.addEventListener("keydown", move);

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
ctx = document.getElementById('game').getContext("2d");
drawGame();

startMove();
function startMove(){
  console.log("test");
  var userInput = {angle: 120, magnitude: 60}
//  var userInput = {angle: document.getElementById("userInterface").elements["angle"], magnitude: document.getElementById("userInterface").elements["magnitude"]};
  var runRise = ship.calculateXY(userInput); //this function returns an object {x: ?, y: ?}
  var newPos = {x: ship.PosX+runRise.x, y: ship.PosY+runRise.y};
  console.log("NEW POSITION: ");
  console.log(newPos);
  var xUnitVector = runRise.x/Math.abs(runRise.x);
  var yUnitVector = runRise.y/Math.abs(runRise.y);

  var gm = setInterval(function(){bar(gm, newPos.x, xUnitVector, newPos.y, yUnitVector);}, 1);
}

var bar = function(gm, newX, xUnitVector, newY, yUnitVector)
{
    if(ship.PosX != newX){
        ship.move(ship.PosX+xUnitVector, ship.PosY);
        drawGame();
        if(ship.PosX != newX && (Math.abs((ship.PosX-newX)) > 1.5*Math.abs(ship.PosY-newY))){
            ship.move(ship.PosX+xUnitVector, ship.PosY);
            drawGame();
        }
      var currPos = {x: ship.PosX, y: ship.PosY};
      console.log(currPos);
    }

    if(ship.PosY != newY){
        ship.move(ship.PosX, ship.PosY+yUnitVector);
        drawGame();
        if(ship.PosY != newY && (Math.abs((ship.PosY-newY)) > 1.5*Math.abs(ship.PosX-newX))) {
            ship.move(ship.PosX, ship.PosY+yUnitVector);
            drawGame();
        }
      var currPos = {x: ship.PosX, y: ship.PosY};
      console.log(currPos);
    }

    if(ship.PosX == newX && ship.PosY == newY)
      clearInterval(gm);
}
//currently not called
function getUserInput(){
  var angle = prompt("Angle: ");
  var magnitude = prompt("Magnitude: ");
  return {angle: angle, magnitude: magnitude};
}



function shipMove(){
  //should this function live inside ship or here in test_game?
  var userInput = getUserInput(); //this function should return an object {angle: ?, magnitude: ?}
  //CHANGE THESE VALUES FOR TESTING
  var userInput = {angle: 150, magnitude: 10};
  var runRise = ship.calculateXY(userInput); //this function returns an object {x: ?, y: ?}
  var newPos = {x: ship.PosX+runRise.x, y: ship.PosY+runRise.y};
//  console.log(newPos.x)
  //accepting some messiness here for readability and cleanliness of other functions.
  var run = runRise.x;
  var rise = runRise.y;
  //need these in forthcoming for loops
  var runAbs = Math.abs(run);
  var riseAbs = Math.abs(rise);
  //saving the directions that we're actually moving
  var xUnitVector = (run/runAbs);
  var yUnitVector = (rise/riseAbs);

//try uncommenting drawGame after you've run it. ship starts at original starting point again.
    if(run != 0 && rise != 0){
      var numTiles = riseAbs + runAbs;
      for(var i = 0; i < numTiles; i+=2)
      {
          ship.PosY += yUnitVector;
//          drawGame();
          ship.PosX += xUnitVector;
//          drawGame();

          if(2*(newPos.x - ship.PosX) < (newPos.y - ship.PosY)){
            ship.PosX += xUnitVector;
//            drawGame();
            i++;
          }
          else if(2*(newPos.y - ship.PosY) < (newPos.x - ship.PosX)){
            ship.PosY += yUnitVector;
//            drawGame();
            i++;
          }
      }
    }
    else if(run == 0){
      for(var i = 0; i < riseAbs; i++){
        ship.PosY += yUnitVector;
//        drawGame();
      }
    }
    else if(rise == 0){
      for(var i = 0; i < runAbs; i++){
        ship.PosX += xUnitVector;
//        drawGame();
      }
    }
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
        case 13:
            shipMove();
            break;
    }
    drawGame();
}

function drawGame()
{
  //  console.log(7);
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
}

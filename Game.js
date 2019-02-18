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
    init_energy:    100,
    init_supplies:  100,
    init_credits:   1000,
    fix_wormhole:   false,
    unlim_game:     false,
    mapSize:        128,
}

//Values for the movement
var currDegree = 0;
var currDistance = 0;

//Updating when scroller in the game is touched
function updateDegree(newVal)
{
    currDegree = newVal;
}

//Updating when scroller in game is touched
function updateDistance(newVal)
{
    currDistance = newVal;
}

//Calls this function when user wants to move (submit movement is pushed)
function startMovement()
{
    console.log(currDistance);
    console.log(currDegree);
}

//Calls this function when user wants to use sensor (sensor button is pushed)
function callSensor()
{
    console.log("called sensor");
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

    gameVars.ship = new Ship(1000);
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

//currently not called
function getUserInput(){
  var angle = prompt("Angle: ");
  var magnitude = prompt("Magnitude: ");
  return {angle: angle, magnitude: magnitude};
}

startMove();
function startMove()
{
    var gm = setInterval(function(){
        foo(gm, 115, 115);
    }, 100);
}

var foo = function(gm, newX, newY)
{
    //Complains that initial ship is null
    if(gameVars.ship!= null)
    {
        if(gameVars.ship.posX != newX || gameVars.ship.posY != newY)
        {
            gameVars.ship.move(gameVars.ship.posX - 1, gameVars.ship.posY -1);
            drawGame(); 
        }
        else clearInterval(gm);
    }
}

function move(e)
{
    e.preventDefault();

    switch(e.keyCode)
    {
        case 37:
            if(gameVars.ship.PosX - 1 >= 0 && gameVars.ship.PosX - 1 <= gameVars.mapSize-1)
                gameVars.ship.PosX = gameVars.ship.PosX-1;
            break;
        case 38:
            if(gameVars.ship.PosY - 1 >= 0 && gameVars.ship.PosY - 1 <= gameVars.mapSize-1)
                gameVars.ship.PosY = gameVars.ship.PosY-1;
            break;
        case 39:
            if(gameVars.ship.PosX + 1 >= 0 && gameVars.ship.PosX + 1 <= gameVars.mapSize-1)
                gameVars.ship.PosX = gameVars.ship.PosX+1;
            break;
        case 40:
            if(gameVars.ship.PosY + 1 >= 0 && gameVars.ship.PosY + 1 <= gameVars.mapSize-1)
                gameVars.ship.PosY = gameVars.ship.PosY+1;
            break;
        case 32:
            
            break;
    }
    drawGame();
}

function drawGame()
{
    var ts = gameVars.Ts;
    var offX = 0;
    var offY = 0;

    //Case 1: offset top left(x,y) to not display out of bounds "black" map
    //Basically display starts a bit lower to not go out of bounds
    if(gameVars.ship.PosX - 16 < 0) { offX = (16 - gameVars.ship.PosX); }
    if(gameVars.ship.PosY - 16 < 0) { offY = (16 - gameVars.ship.PosY); }

    //Case 2: offset top left(x,y) to not display out of bounds "black" mao
    //Basically display starts a bit higher to not go out of bounds
    if(gameVars.ship.PosX + 16 > gameVars.mapSize) { offX = -(gameVars.ship.PosX - (gameVars.mapSize - 16)); }
    if(gameVars.ship.PosY + 16 > gameVars.mapSize) { offY = -(gameVars.ship.PosY - (gameVars.mapSize - 16)); }

    var pos =
    {
        x: 0,
        y: 0,
    }

    for(var x = 0; x < gameVars.cameraSize; x++)
    {
        for(var y = 0; y < gameVars.cameraSize; y++)
        {

            pos.x =  Math.round((gameVars.ship.PosX) - gameVars.cameraSize/2) + x + offX;
            pos.y =  Math.round((gameVars.ship.PosY) - gameVars.cameraSize/2) + y + offY;

            var tile = gameVars.gameMap.getTile(pos.x, pos.y);

            if(pos.x == gameVars.ship.PosX && pos.y == gameVars.ship.PosY)
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
                //console.log(tile);
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
}
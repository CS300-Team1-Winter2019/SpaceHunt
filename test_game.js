var gameMap = [];
var ctx = null;
var UI = null;
var cameraSize =32;
var ts = 800/cameraSize;  //25px
var ship = new Ship(1000);
var maxPlanets = 200;
var maxWorms = 50;
var maxStations = 500;

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


function createMap()
{
    for(var i = 0; i < 128; i++)
    {
        var row = [];
        for(var j = 0; j < 128; j++)
        {
            //Random position at which something will be placed
            var randPlacer = Math.floor(Math.random() * 125); 
            //number of things e.g.: planets, holes, stations etc = # of colors
            var maxChoices = 4;
            //Gives a starting range for random num: e.g: 2-4
            var startAt = 0; 

            if(i == 0 || j == 0 || i == 127 || j == 127)
                row.push(0);
            else
            {
                if(i == randPlacer || j == randPlacer)
                {
                    if(maxWorms <= 0) { maxChoices--; startAt = 1; }
                    if(maxPlanets <= 0) { maxChoices--; startAt = 2; }
                    if(maxStations <= 0) { maxChoices--; startAt = 3; }

                    choice = Math.floor((Math.random() * maxChoices) + startAt);
                    
                    if(choice == 0) { maxWorms--; }
                    if(choice == 1) { maxPlanets--; }
                    if(choice == 2) { maxStations--; }

                    row.push(choice);                   
                }
                else   
                    row.push(3);
            }
        }
        gameMap.push(row);
    }
} 

window.onload = function()
{
    createMap();
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
    //ctx.font = "bold 10pt sans-serif";
}

//!!!!Unused code for submit button!!!
/*
var move = document.getElementById('moving');

if(move.attachEvent)
{
    move.attachEvent("submit", processMove);
}
else
{
    move.addEventListener("submit", processMove);
}

function processMove(e)
{
    if(e.preventDefault) { e.preventDefault(); }

}
*/


document.addEventListener("keydown", move);

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
    requestAnimationFram(drawGame);
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
        y: 0
    }

    for(var x = 0; x < cameraSize; x++)
    {       
        for(var y = 0; y < cameraSize; y++)     
        {           
            
            pos.x =  Math.round((ship.PosX) - cameraSize/2) + x + offX;
            pos.y =  Math.round((ship.PosY) - cameraSize/2) + y + offY;

            var tile = gameMap[pos.x][pos.y];
            
            
            if(pos.x == ship.PosX && pos.y == ship.PosY)
            {
                ctx.fillStyle = "black";
                ctx.fillRect(x * ts, y * ts, ts, ts);
            }             
            else           
            {
                objects.updateColor(tile);
                ctx.fillStyle = objects.currColor;
                ctx.fillRect(x * ts, y * ts, ts, ts);
            }
        }
    }
    //ship.move(ship.PosX-1, ship.PosY-1);
    requestAnimationFrame(drawGame);
}

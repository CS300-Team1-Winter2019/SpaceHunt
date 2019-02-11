var gameMap = [];
var ctx = null;
var UI = null;
var cameraSize =32;
var ts = 800/cameraSize;
var ship = new Ship(1000);
var color = ["red", "green", "blue", "purple", "brown", "pink"];

function createMap()
{
    for(var i = 0; i < 128; i++)
    {
        var row = [];
        for(var j = 0; j < 128; j++)
        {
            if(i == 0 || j == 0 || i == 127 || j == 127)
            //row.push(Math.floor(Math.random() * 2));
                row.push(0);
            else
            {
                row.push(Math.floor(Math.random() * 5)+1); 
            }
        }
        gameMap.push(row);
    }
} 

createMap();
ctx = document.getElementById('game').getContext("2d");
requestAnimationFrame(drawGame);
//ctx.font = "bold 10pt sans-serif";

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

function drawGame()
{
    for(var x = 0; x < cameraSize; x++)
    {
        for(var y = 0; y < cameraSize; y++)
        {           
            var pos = 
            {
                x: Math.round((ship.PosX) - cameraSize/2) + x,
                y: Math.round((ship.PosY) - cameraSize/2) + y
            }            
            ctx.save();

            try
            {
                var tile = gameMap[pos.x][pos.y];
                
                if(pos.x == ship.PosX && pos.y == ship.PosY)
                {
                    ctx.fillStyle = "black";
                    ctx.fillRect(x *ts, y * ts,ts,ts);
                }
                
                else
                {
                    ctx.fillStyle = color[tile];
                    ctx.fillRect(x * ts, y * ts, ts, ts);
                }
            }

            catch(e)
            {
                ctx.fillStyle = "black";
                ctx.fillRect(x * ts, y * ts, ts, ts);
            }
            ctx.restore();
        }
    }
    //ship.move(ship.PosX-1, ship.PosY-1);
    requestAnimationFrame(drawGame);
}

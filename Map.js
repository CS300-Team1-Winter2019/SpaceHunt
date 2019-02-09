var ctx = null;
var tileW = 7;
var tileH = 7;
var mapW = 128;
var mapH = 128;
var currSec = 0;
var frameCount = 0;
var frameLastSec = 0;
var gameMap = [];

function createMap()
{
    //Create a 2-D game map
    for(var i = 0; i < mapH; i++)
    {
        gameMap[i] = [];
    }
    //Populate map
    for(var x = 0; x < mapH; x++)
    {
        for(var y = 0; y < mapW; y++)
        {
            if(x == 0 || y == 0 || x == mapH-1 || y == mapW-1)
            {
                gameMap[x][y] = 0;
            }
            else
            {
                gameMap[x][y] = 1;
            }
            //gameMap[i] = Math.floor(Math.random() * 2);
        }
    }
}

window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(drawGame);
	ctx.font = "bold 10pt sans-serif";
}

createMap();

function drawGame()
{
	if(ctx==null) { return; }

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currSec)
	{
		currSec = sec;
		framesLastSec = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }

	for(var y = 0; y < mapH; ++y)
	{
		for(var x = 0; x < mapW; ++x)
		{
			switch(gameMap[y][x])
			{
				case 0:
					ctx.fillStyle = "#DC143C";
					break;
				default:
					ctx.fillStyle = "#5aa457";
			}

			ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
		}
	}

	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSec, 10, 20);

	requestAnimationFrame(drawGame);
}

class Tile
{
    constructor()
    {
        this.val = 0;
        this.vis = false;
    }
}

class Map
{
    constructor(mS)
    {
        this.mapSize = mS;
        this.map = [];
        this.maxPlanets = 200;
        this.maxWorms = 50;
        this.maxStations = 500;

        //Build randomized map
        if (!gameVars.fix_objects) {
            for(var i = 0; i < this.mapSize; i++)
            {
                var row = [];
                for(var j = 0; j < this.mapSize; j++)
                {
                    //Random position at which something will be placed
                    var randPlacer = Math.floor(Math.random() * this.mapSize - 2);
                    //number of things e.g.: planets, holes, stations etc = # of colors
                    var maxChoices = 4;
                    //Gives a starting range for random num: e.g: 2-4
                    var startAt = 0;
                    //Create new tile
                    var newTile = new Tile();

                    if(i == 0 || j == 0 || i == this.mapSize - 1 || j == this.mapSize - 1)
                    {
                        newTile.val = 0;
                        row.push(newTile);
                    }
                    else
                    {
                        if(i == randPlacer || j == randPlacer)
                        {
                            if(this.maxWorms <= 0) { maxChoices--; startAt = 1; }
                            if(this.maxPlanets <= 0) { maxChoices--; startAt = 2; }
                            if(this.maxStations <= 0) { maxChoices--; startAt = 3; }

                            var choice = Math.floor((Math.random() * maxChoices) + startAt);

                            if(choice == 0) { this.maxWorms--; }
                            if(choice == 1) { this.maxPlanets--; }
                            if(choice == 2) { this.maxStations--; }

                            newTile.val = choice;
                            row.push(newTile);
                        }
                        else
                        {
                            newTile.val = 3;
                            row.push(newTile);
                        }
                    }
                }
                this.map.push(row);
            }
        }

        //Build specified map
        else {
            for(var i = 0; i < this.mapSize; i++)
            {
                var row = [];
                for(var j = 0; j < this.mapSize; j++)
                {
                    //Create new tile
                    var newTile = new Tile();

                    if(i == 0 || j == 0 || i == this.mapSize - 1 || j == this.mapSize - 1)
                    {
                        newTile.val = 0;
                        row.push(newTile);
                    }
                    else
                    {
                        if((String(i) + ':' + String(j)) in gameVars.object_list)
                        {
                            //Do we need to adjust max values if all obstacles are fixed?
                            //if(this.maxWorms <= 0) { maxChoices--; startAt = 1; }
                            //if(this.maxPlanets <= 0) { maxChoices--; startAt = 2; }
                            //if(this.maxStations <= 0) { maxChoices--; startAt = 3; }

                            //var choice = Math.floor((Math.random() * maxChoices) + startAt);

                            //if(choice == 0) { this.maxWorms--; }
                            //if(choice == 1) { this.maxPlanets--; }
                            //if(choice == 2) { this.maxStations--; }

                            newTile.val = gameVars.object_list[String(i) + ':' + String(j)];
                            row.push(newTile);
                        }
                        else
                        {
                            newTile.val = 3;
                            row.push(newTile);
                        }
                    }
                }
                this.map.push(row);
            }
        }
    }

    //Returns Tile object
    getTile(x, y)
    {
        return this.map[x][y];
    }

    //"Constructor" which takes an object, so it can be loaded from localStorage.
    copyMap(obj)
    {
        this.map = obj.map;
        this.mapSize = obj.mapSize;
        this.maxPlanets = obj.maxPlanets;
        this.maxWorms = obj.maxWorms;
        this.maxStations = obj.maxStations;
    }
}

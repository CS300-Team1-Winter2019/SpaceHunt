class Map{





  constructor()
  {
      this.map = [];
      this.maxPlanets = 200;
      this.maxWorms = 50;
      this.maxStations = 500;

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
                      if(this.maxWorms <= 0) { maxChoices--; startAt = 1; }
                      if(this.maxPlanets <= 0) { maxChoices--; startAt = 2; }
                      if(this.maxStations <= 0) { maxChoices--; startAt = 3; }

                      var choice = Math.floor((Math.random() * maxChoices) + startAt);

                      if(choice == 0) { this.maxWorms--; }
                      if(choice == 1) { this.maxPlanets--; }
                      if(choice == 2) { this.maxStations--; }

                      row.push(choice);
                  }
                  else
                      row.push(3);
              }
          }
          this.map.push(row);
      }
  }

  getPos(x, y)
  {
    return this.map[x][y];
  }






}

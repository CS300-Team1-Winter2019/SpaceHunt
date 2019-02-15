//Create a menu for the game (uses canvas in space.html)

// A subregion of the canvas. Where a button will be
class Region {
  constructor(startX, endX, startY, endY) {
    this.startX = startX; //Starting and ending positions, giving the full region (rectangle)
    this.endX = endX;
    this.startY = startY;
    this.endY = endY;
  }

  get startX() {
    return this.startX;
  }
  get endX() {
    return this.endX;
  }

  get startY() {
    return this.startY;
  }
  get endY() {
    return this.endY;
  }
}

var canvas = document.getElementById("menu");
var ctx = canvas.getContext("2d"); 
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');

ctx.fillRect(0, 0, width, height);

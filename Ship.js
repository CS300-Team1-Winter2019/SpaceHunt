class Ship
{
    constructor(health)
    {
        this.health = health;
        this.fuel = 0;
        this.sizeX =50;
        this.sizeY = 50;
        this.posX =120;//Math.floor(Math.random() * 127);
        this.posY = 120;//Math.floor(Math.random() * 127);
        this.delayMove = 100;
    }

    damage(dmg)
    {
        this.health = this.health - dmg;
    }

    get Health()
    {
        return this.health;
    }

    move(x, y)
    {
        if(x < 0) { x = 0; }
        if(y < 0) { y = 0; }
        if(x > 126) { x = 126; }
        if(y > 126) { y = 126; }
        var until = new Date().getTime() + this.delayMove;
        while((new Date().getTime() < until)) {};

        this.posX = x;
        this.posY = y;
    }

    calculateXY(userInput)          //this argument should be an object {angle: ?, magnitude: ?}
    {

      var convertedAngle = (userInput.angle * (Math.PI/180))

      var coords = {x: Math.round(Math.cos(convertedAngle)*userInput.magnitude),
                    y: Math.round(-(Math.sin(convertedAngle)*userInput.magnitude))};
      return coords;
    }

    get PosX()
    {
        return this.posX;
    }

    get PosY()
    {
        return this.posY;
    }

    get SizeX()
    {
        return this.sizeX;
    }

    get SizeY()
    {
        return this.sizeY;
    }

    set PosX(val)
    {
        this.posX = val;
    }

    set PosY(val)
    {
        this.posY = val;
    }
}

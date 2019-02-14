class Ship
{
    constructor(health)
    {
        this.health = health;
        this.sizeX =50;
        this.sizeY = 50;
        this.posX =125;//Math.floor(Math.random() * 127);
        this.posY = 125;//Math.floor(Math.random() * 127);
        this.delayMove = 500;

        this.energy = 1000;
        this.supplies = 100;
        this.credits = 1000;
    }

/*
    constructor(health, settings)
    {
      this.health = health;
      this.sizeX = 50;
      this.sizeY = 50;
      this.posX = 125;
      this.posY = 125;
      this.delayMove = 500;

      this.energy = settings.startEnergy;
      this.supplies = settings.startSupplies;
      this.credits = settings.startCredits;
    }
*/

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
        var until = new Date().getTime() + this.delayMove;
        while((new Date().getTime() < until)) {};

        this.posX = x;
        this.posY = y;
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

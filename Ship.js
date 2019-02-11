class Ship
{
    constructor(health)
    {
        this.health = health;
        this.fuel = 0;
        this.sizeX =40;
        this.sizeY = 40;
        this.posX = 10;//Math.floor(Math.random() * 127);
        this.posY = 10;//Math.floor(Math.random() * 127);
        this.delayMove = 500;
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
}

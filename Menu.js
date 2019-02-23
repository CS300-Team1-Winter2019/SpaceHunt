var init_game =
{
    fix_start:        false,
    init_energy:      1000,
    init_supplies:    100,
    init_credits:     1000,
    fix_wormhole:     false,
    unlim_game:       false,
    map_size:         128
}

var runGame = function()
{
    document.getElementById("newGame").style.display = "none";
    document.getElementById("theHead").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
               init_game.fix_wormhole, init_game.unlim_game, init_game.map_size);

    document.getElementById("distScroll").style.display = "block";
    document.getElementById("upBtn").style.display = "block";
    document.getElementById("downBtn").style.display = "block";
    document.getElementById("leftBtn").style.display = "block";
    document.getElementById("rightBtn").style.display = "block";
    document.getElementById("sensBtn").style.display = "block";
};

var showCredits = function()
{
    document.getElementById("theHead").style.display = "none";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("credits").style.display = "block";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    var sett = document.getElementsByClassName("stngs");
    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "none";
};

var goBack = function()
{
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("theHead").style.display = "block";
    document.getElementById("newGame").style.display = "block";
    document.getElementById("settBtn").style.display = "block";
    document.getElementById("creditBtn").style.display = "block";
    document.getElementById("loadBtn").style.display = "block";

    var sett = document.getElementsByClassName("stngs");
    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "none";
};

var settMen = function()
{
    document.getElementById("theHead").style.display = "none";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    var sett = document.getElementsByClassName("stngs");

    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "block";

    document.getElementById("backBtn").style.display = "block";
};

function changeEnergy(newEnergy)
{
    document.getElementById("energyOut").innerHTML = newEnergy;
    init_game.init_energy = newEnergy;
}

function changeSupplies(newSupplies)
{
    document.getElementById("suppliesOut").innerHTML = newSupplies;
    init_game.init_supplies = newSupplies;
}

function changeCredits(newCredits)
{
    document.getElementById("creditsOut").innerHTML = newCredits;
    init_game.init_credits = newCredits;
}

function changeMap(newMap)
{
    document.getElementById("mapOut").innerHTML = newMap;
    init_game.map_size = newMap;
}

function changeStartPos(isFixed)
{
    init_game.fix_start = isFixed;
}

function changeWormBehav(isFixed)
{
    init_game.fix_wormhole = isFixed;
}

function changeUnlim(isFixed)
{
    init_game.unlim_game = isFixed;
}

function submitCourse(direction)
{
    startMovement(direction);
}

function changeDistance(newDistance)
{
    document.getElementById("distanceOut").innerHTML = newDistance;
    updateDistance(newDistance);
}

function submitSensor()
{
    callSensor();
}

function load()
{
    document.getElementById("newGame").style.display = "none";
    document.getElementById("theHead").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    loadSaved(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
              init_game.fix_wormhole, init_game.unlim_game, init_game.map_size);

    document.getElementById("distScroll").style.display = "block";
    document.getElementById("upBtn").style.display = "block";
    document.getElementById("downBtn").style.display = "block";
    document.getElementById("leftBtn").style.display = "block";
    document.getElementById("rightBtn").style.display = "block";
    document.getElementById("sensBtn").style.display = "block";
    drawGame();
}

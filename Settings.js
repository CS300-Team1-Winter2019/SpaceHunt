//Currently untested
class Settings {
    
    //Constructor sets all values to the ones specified by the assignment
    // Since there are a lot of miscellanious variables, I figured we would change them by hand
    // rather than write a constructor that initializes them. I am willing to change this
    constructor() {
        this.maxMap = 128;
        this.startEnergy = 1000;
        this.startSupplies = 100;
        this.startCredits = 1000;
        this.fixedWormhole = false;
        this.noDeath = false;
    }

    get maxMap() {
        return this.maxMap;
    }
    set maxMap(value) {
        this.maxMap = value;
    }


    get startEnergy() {
        return this.startEnergy;
    }
    set startEnergy(value) {
        this.startEnergy = value;
    }


    get startSupplies() {
        return this.startSupplies;
    }
    set startSupplies(value) {
        this.startSupplies = value;
    }


    get startCredits() {
        return this.startCredits;
    }
    set startCredits(value) {
        this.startCredits = value;
    }


    get fixedWormhole() {
        return this.fixedWormhole;
    }
    set fixedWormhole(value) {
        this.fixedWormhole = value;
    }


    get noDeath() {
        return this.noDeath;
    }
    set noDeath(value) {
        this.noDeath = value;
    }
    
}

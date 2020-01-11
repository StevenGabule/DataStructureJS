// Our project in this chapter is to build a virtual ecosystem,
// a little world populated with critters that move around 
// and struggle for survival.

function Vector(x,y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y)
}

// var grid = [ ["top left", "top middle", "top right"], ["bottom left", "bottom middle", "bottom right"]];

var grid = ["top left", "top middle", "top right", "bottom left", "bottom middle", "bottom right"]; 
// console.info(grid[2 + (1*3)])

function Grid(width, height) { 
    this.space = new Array(width * height); 
    this.width = width; 
    this.height = height; 
} 

Grid.prototype.isInside = function(vector) { 
    return vector.x >= 0 && vector.x < this.width 
    && vector.y >= 0 && vector.y < this.height; 
}; 

Grid.prototype.get = function(vector) { 
    return this.space[vector.x + this.width * vector.y]; 
}; 

Grid.prototype.set = function(vector, value) { 
    this.space[vector.x + this.width * vector.y] = value; 
};

var grid = new Grid(5, 5); 
// console.log(grid.get(new Vector(1, 1))); 
grid.set(new Vector(1, 1), "X"); 
// console.log(grid.get(new Vector(1, 1))); 


var directions = { 
    "n": new Vector( 0, -1), 
    "ne": new Vector( 1, -1), 
    "e": new Vector( 1, 0), 
    "se": new Vector( 1, 1), 
    "s": new Vector( 0, 1), 
    "sw": new Vector(-1, 1), 
    "w": new Vector(-1, 0), 
    "nw": new Vector(-1, -1) 
};

function randomElement(array) { 
    return array[Math.floor(Math.random() * array.length)]; 
}
var directionNames = "n ne e se s sw w nw".split(" ");
function BouncingCritter() { 
    this.direction = randomElement(directionNames); 
};

BouncingCritter.prototype.act = function(view) { 
    if (view.look(this.direction) != " ") 
        this.direction = view.find(" ") || "s"; 
    return {type: "move", direction: this.direction}; 
};

function elementFromChar(legend, ch) {
    if(ch == " ")
        return null
    // object that tells us what each character in the map means
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}

function World(map, legend) {
    var grid = new Grid(map[0].length, map.length)
    this.grid = grid;
    this.legend = legend;
    map.forEach(function(line, y) {
        for(var x = 0; x < line.length; x++) 
            grid.set(new Vector(x,y), elementFromChar(legend, line[x]))
    })
}

function charFromElement(element) {
    if (element == null) {
        return " ";
    } else {
        return element.originChar
    }
}

World.prototype.toString = function() {
    var output = ""
    for(var y = 0; y < this.grid.height; y++) {
        for(var x = 0; x < this.grid.width; x++) {
            var element =  this.grid.get(new Vector(x,y))
            output += charFromElement(element)
        }
        output += "\n"
    }
    return output;
}

// simple object—it is used only for taking up space and has no act method.
function Wall() {}

var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

var world = new World(plan, {"#": Wall, "o": BouncingCritter})
// console.log(world.toString())

// bind method, which allows us to provide an explicit this object to bind to.
var test = {
    prop: 10,
    addPropTo: function(array) {
        return array.map(function(elt) {
            return this.prop + elt
        // }.bind(this))
        }, this)
    }
}
// console.log(test.addPropTo([5, 10, 25]))

Grid.prototype.forEach = function(f, context) {
    for (var y = 0; y < this.height; y++) { 
        for (var x = 0; x < this.width; x++) {
             var value = this.space[x + y * this.width]; 
             if (value != null) f.call(context, value, new Vector(x, y)); 
        }
    }
}

//keep an array of critters that have already had their 
// turn and ignore them when we see them again.
World.prototype.turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter)
            this.letAct(critter, vector);
        }
    }, this)
}

// access the correct this inside the inner function. The letAct 
// method contains the actual logic that allows the critters to move.
World.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this,vector))
    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector)
        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null)
            this.grid.set(dest, critter)
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction])
        if (this.grid.isInside(dest)) 
            return dest;
    }
}

// The look method ﬁgures out the coordinates that we are trying to look at and, 
// if they are inside the grid, ﬁnds the character corresponding to the 
// element that sits there. For coordinates outside the grid, look simply 
// pretends that there is a wall there so that if you deﬁne a world that 
// isn’t walled in, the critters still won’t be tempted to try to walk off the edges.

function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target)) {
        return charFromElement(this.world.grid.get(target))
    } else {
        return "#"
    }
};

View.prototype.findAll = function(ch) {
    var found = []
    for(var dir in directions) 
        if(this.look(dir) == ch)
            found.push(dir)
    return found
};

View.prototype.find = function(ch) {
    var found = this.findAll(ch)
    if(found.length == 0) return null;
    return randomElement(found)
};

// for(var i=0; i < 10; i++) {
//     world.turn();
//     console.log(world.toString())
// }

function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir)
    return directionNames[(index + n + 8) % 8]
}

function WallFollower() {
    this.dir = "s"
}

// The act method only has to “scan” the critter’s surroundings, 
// starting from its left side and going clockwise until it ﬁnds an empty square. 
// It then moves in the direction of that empty square. 
WallFollower.prototype.act = function(view) { 
    var start = this.dir; 
    if (view.look(dirPlus(this.dir, -3)) != " ") 
        start = this.dir = dirPlus(this.dir, -2); 
    while (view.look(this.dir) != " ") { 
        this.dir = dirPlus(this.dir, 1); 
        if (this.dir == start) break; 
    } 
    return {type: "move", direction: this.dir}; 
};

function LifeLikeWorld(map, legend) {
    World.call(this, map, legend)
}

LifeLikeWorld.prop = Object.create(World.prototype)

var actionTypes = Object.create(null)


// The new letAct method ﬁrst checks whether an action was returned at all, 
// then whether a handler function for this type of action exists, and ﬁnally 
// whether that handler returned true, indicating that it successfully handled 
// the action. Note the use of call to give the handler access to the world, 
// through its this binding.
LifeLikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this,vector))
    var handled = action && action.type in actionTypes &&
    actionTypes[action.type].call(this, critter, vector, action);
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0) {
            this.grid.set(vector, null)
        }
    }
}

actionTypes.grow = function(critter) { 
    critter.energy += 0.5; 
    return true; 
};

// This action ﬁrst checks, using the checkDestination method deﬁned earlier, 
// whether the action provides a valid destination. If not, or if the destination 
// isn’t empty, or if the critter lacks the required energy, move returns false 
// to indicate no action was taken. Otherwise, it moves the critter and subtracts 
// the energy cost. 
actionTypes.move = function(critter, vector, action) { 
    var dest = this.checkDestination(action, vector); 
    if (dest == null || 
        critter.energy <= 1 || 
        this.grid.get(dest) != null) 
        return false; 
    critter.energy -= 1; 
    this.grid.set(vector, null); 
    this.grid.set(dest, critter); 
    return true; 
};

// Eating another critter also involves providing a valid destination square. 
// This time, the destination must not be empty and must contain something with energy, 
// like a critter (but not a wall—walls are not edible). If so, the energy from the eaten
//  is transferred to the eater, and the victim is removed from the grid. 
actionTypes.eat = function(critter, vector, action) { 
    var dest = this.checkDestination(action, vector); 
    var atDest = dest != null && this.grid.get(dest); 
    if (!atDest || atDest.energy == null) return false; 
    critter.energy += atDest.energy; 
    this.grid.set(dest, null); 
    return true;
};

/* Reproducing costs twice the energy level of the newborn critter. 
So we ﬁrst create a (hypothetical) baby using elementFromChar on 
the critter’s own origin character. Once we have a baby, we can 
ﬁnd its energy level and test whether the parent has enough energy 
to successfully bring it into the world. We also require a 
valid (and empty) destination. */

actionTypes.reproduce = function(critter, vector, action) { 
    var baby = elementFromChar(this.legend, critter.originChar); 
    var dest = this.checkDestination(action, vector); 
    if (dest == null || 
        critter.energy <= 2 * baby.energy || 
        this.grid.get(dest) != null) 
        return false; 
    critter.energy -= 2 * baby.energy; 
    this.grid.set(dest, baby);
    return true;
};

function Plant() { 
    this.energy = 3 + Math.random() * 4; 
}

/* Plants start with an energy level between 3 and 7, 
randomized so that they don’t all reproduce in the same turn.
 When a plant reaches 15 energy points and there is empty space nearby, 
 it reproduces into that empty space. If a plant can’t reproduce, 
 it simply grows until it reaches energy level 20.  */
Plant.prototype.act = function(context) { 
    if (this.energy > 15) { 
        var space = context.find(" "); 
        if (space) return {type: "reproduce", direction: space}; 
    } 
    if (this.energy < 20) return {type: "grow"}; 
};

function PlantEater() { 
    this.energy = 20; 
} 

// We’ll use the * character for plants, so that’s 
// what critters will look for when they search for food.
PlantEater.prototype.act = function(context) { 
    var space = context.find(" "); 
    if (this.energy > 60 && space) return {type: "reproduce", direction: space}; 
    var plant = context.find("*"); 
    if (plant) return {type: "eat", direction: plant};
    if (space) return {type: "move", direction: space};
};

var valley = new LifeLikeWorld(
    ["############################",
     "#####                 ######",
     "##   ***                **##",
     "#   *##**         **  O  *##",
     "#    ***     O    ##**    *#",
     "#       O         ##***    #",
     "#                 ##**     #",
     "#   O       #*             #",
     "#*          #**       O    #",
     "#***        ##**    O    **#",
     "##****     ###***       *###",
     "############################"],
    {"#": Wall,
     "O": PlantEater,
     "*": Plant}
  );

// 1: METHODS 
// Methods are simply properties that hold function values
var rabbit = {}

rabbit.speak = function(line) { console.log("Th rabbit says '" + line +"'")}
rabbit.speak('All is well')

function speak(line) {
    console.log("The "+ this.type+" rabbit says '" + line + "'")
}

var whiteRabbit = {type: "white", speak:speak}
var fatRabbit = {type:"fat", speak: speak}
whiteRabbit.speak('Oh my ears and whiskers, how late it\'s getting')
fatRabbit.speak('I could sure use a carrot right now.')

speak.apply(fatRabbit, ["Burp!"]); 
speak.call({type: "old"}, "Oh my."); 

// PROTOTYPES
// A prototype is another object that is used as a fallback source of properties. 
var empty = {}
console.log(empty.toString)
console.log(empty.toString())

console.log(Object.getPrototypeOf({}) == Object.prototype)
console.log(Object.getPrototypeOf(Object.prototype))

console.log(Object.getPrototypeOf(isNaN) == Function.prototype); 
console.log(Object.getPrototypeOf([]) == Array.prototype); 

// The Object.getPrototypeOf function obviously returns the prototype of an object. 
// You can use Object.create to create an object with a speciﬁc prototype.
var protoRabbit = { 
    speak: function(line) { 
        console.log("The " + this.type + " rabbit says '" + line + "'"); 
    } 
};
 
var killerRabbit = Object.create(protoRabbit); 
killerRabbit.type = "killer"; 
killerRabbit.speak("SKREEEE!")

// Constructors 
function Rabbit(type) {
    this.type = type;
}

var killerRabbit = new Rabbit("killer"); 
var blackRabbit = new Rabbit("black"); 
console.log(blackRabbit.type); 

//  Every instance created with this constructor will have this object as its prototype
Rabbit.prototype.speak = function(line) { 
    console.log("The " + this.type + " rabbit says '" + line + "'"); 
}; 
blackRabbit.speak("Doom..."); 

// Overriding Derived Properties 
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth); 

killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth); 

console.log(blackRabbit.teeth); 
console.log(Rabbit.prototype.teeth); 

console.log(Array.prototype.toString == Object.prototype.toString); 
console.log([1, 2].toString()); 
console.log(Object.prototype.toString.call([1, 2])); 


// Prototype Interference 

Rabbit.prototype.dance = function() { 
    console.log("The " + this.type + " rabbit dances a jig."); 
}
killerRabbit.dance(); 

var map = {}; 
function storePhi(event, phi) { map[event] = phi; }
storePhi("pizza", 0.069); 
storePhi("touched tree", -0.081);
Object.prototype.nonsense = "hi"; 
for (var name in map) console.log(name);
console.log("nonsense" in map); 
console.log("toString" in map); 

// Delete the problematic property again 
delete Object.prototype.nonsense;
for (var name in map) console.log(name);

Object.defineProperty(Object.prototype, "hiddenNonsense", {enumerable: false, value: "hi"}); 
for (var name in map) console.log(name); 
console.log(map.hiddenNonsense)
console.log(map.hasOwnProperty("toString")); 

// Prototype-less Objects 
var map = Object.create(null); 
map["pizza"] = 0.069;
console.log("toString" in map); 
console.log("pizza" in map); 

// Polymorphism 
// work with objects that have a certain interface
// any kind of object that happens to support this interface can be plugged into the code
// code can work with values of different shapes, as long as they support the interface it expects.


// -----------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------
// Laying Out a Table 
// we will write a program that, given an array of arrays of table cells, builds up a string that contains a nicely laid out table

// This is the interface:
    // minHeight() returns a number indicating the minimum height this cell requires (in lines). 
    // minWidth() returns a number indicating this cell’s minimum width (in characters).
    // draw(width, height) returns an array of length height, which contains a series of strings that are each width characters wide.
    // This represents the content of the cell. 
// -----------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------

// It uses reduce to compute the maximum height of an array of cells and 
// wraps that in map in order to do it for all rows in the rows array
function rowHeights(rows) { 
    return rows.map(function(row) { 
        return row.reduce(function(max, cell) { 
            return Math.max(max, cell.minHeight()); 
        }, 0); 
    }); 
}

// Builds up an array with one element for every column index. 
// The call to reduce runs over the outer rows array for each index 
// and picks out the width of the widest cell at that index. 
function colWidths(rows) { 
    return rows[0].map(function(_, i) { 
        return rows.reduce(function(max, row) { 
            return Math.max(max, row[i].minWidth()); 
        }, 0); 
    }); 
}

// uses the internal helper function drawRow to draw all rows 
// and then joins them together with newline characters.
function drawTable(rows) { 
    var heights = rowHeights(rows); 
    var widths = colWidths(rows);
    
    // extracts lines that should appear next to each other from an array of blocks 
    // and joins them with a space character to create a one-character gap between the table’s columns. 
    function drawLine(blocks, lineNo) { 
        return blocks.map(function(block) { 
            return block[lineNo]; 
        }).join(" "); 
    }

    // itself ﬁrst converts the cell objects in the row to blocks, 
    // which are arrays of strings representing the content of the cells, split by line
    function drawRow(row, rowNum) { 
        var blocks = row.map(function(cell, colNum) { 
            return cell.draw(widths[colNum], heights[rowNum]); 
        }); 
        return blocks[0].map(function(_, lineNo) { 
            return drawLine(blocks, lineNo); }).join("\n"); 
        }
    return rows.map(drawRow).join("\n");
}    

// which builds a string whose value is the string argument repeated times number of times.
function repeat(string, times) { 
    var result = ""; 
    for (var i = 0; i < times; i++) 
        result += string; 
    return result; 
}

// splits a string into an array of lines using the string method split, 
// which cuts up a string at every occurrence of its argument and returns an array of the pieces. 
function TextCell(text) { 
    this.text = text.split("\n"); 
}

// ﬁnds the maximum line width in this array
TextCell.prototype.minWidth = function() { 
    return this.text.reduce(function(width, line) { 
        return Math.max(width, line.length); 
    }, 0);
}; 

TextCell.prototype.minHeight = function() { 
    return this.text.length; 
}; 

TextCell.prototype.draw = function(width, height) { 
    var result = []; 
    for (var i = 0; i < height; i++) { 
        var line = this.text[i] || ""; 
        result.push(line + repeat(" ", width - line.length)); 
    } 
    return result; 
};

var rows = []; 
for (var i = 0; i < 5; i++) { 
    var row = []; 
    for (var j = 0; j < 5; j++) { 
        if ((j + i) % 2 == 0) row.push(new TextCell("##")); 
        else row.push(new TextCell(" ")); 
    } 
    rows.push(row); 
} 
// console.log(drawTable(rows)); 

// It reports its minimum size as being the same as that of its inner cell 
// (by calling through to that cell’s minWidth and minHeight methods) 
// but adds one to the height to account for the space taken up by the underline. 
function UnderlinedCell(inner) { 
    this.inner = inner; 
}; 

UnderlinedCell.prototype.minWidth = function() { 
    return this.inner.minWidth(); 
}; 

UnderlinedCell.prototype.minHeight = function() { 
    return this.inner.minHeight() + 1; 
}; 

UnderlinedCell.prototype.draw = function(width, height) { 
    return this.inner.draw(width, height - 1).concat([repeat("-", width)]); 
};


var MOUNTAINS = [
    {Name: "Kilimanjaro", Height: 5895, Country: "Tanzania", City: "Valencia city", PostalCode: "1122", Job: "Data Scientist", Bio: "My name is oboo"},
    {Name: "Everest", Height: 8848, Country: "Nepal", City: "Valencia city", PostalCode: "1132", Job: "Data Scientist", Bio: "My name is oboo" },
    {Name: "Mount Fuji", Height: 3776, Country: "Japan", City: "Valencia city", PostalCode: "12222", Job: "Data Scientist", Bio: "My name is oboo"},
    {Name: "Mont Blanc", Height: 4808, Country: "Italy/France", City: "Valencia city", PostalCode: "1122", Job: "Data Scientist", Bio: "My name is oboo"},
    {Name: "Vaalserberg", Height: 323, Country: "Netherlands", City: "Valencia city", PostalCode: "1122", Job: "Data Scientist", Bio: "My name is oboo"},
    {Name: "Denali", Height: 6168, Country: "United States", City: "Valencia city", PostalCode: "1122", Job: "Data Scientist", Bio: "My name is oboo"},
    {Name: "Popocatepetl", Height: 5465, Country: "Mexico", City: "Valencia city", PostalCode: "1122", Job: "Data Scientist", Bio: "My name is oboo"}
  ];

  // returns an array of property names in an object
function dataTable(data) { 
    var keys = Object.keys(data[0]); 
    var headers = keys.map(function(name) { 
        return new UnderlinedCell(new TextCell(name)); 
    }); 
    var body = data.map(function(row) { 
        return keys.map(function(name) { 
            var value = row[name]; 
            // This was changed: 
            if (typeof value == "number") return new RTextCell(String(value)); 
            else return new TextCell(String(value)); 
        }); 
    }); 
    return [headers].concat(body);
}

// console.log(drawTable(dataTable(MOUNTAINS))); 

var pile = { 
    elements: ["eggshell", "orange peel", "worm"], 
    get height() { return this.elements.length; }, 
    set height(value) { 
        console.log("Ignoring attempt to set height to", value); 
    } 
}

console.log(pile.height); 
pile.height = 100;  

Object.defineProperty(TextCell.prototype, "heightProp", {
    get: function() { return this.text.length; } 
});

var cell = new TextCell("no\nway"); 
console.log(cell.heightProp); 
cell.heightProp = 100; 
console.log(cell.heightProp); 

// Inheritance - It allows us to build slightly different data types from existing data types with relatively little work
function RTextCell(text) { 
    TextCell.call(this, text); 
} 

RTextCell.prototype = Object.create(TextCell.prototype); 
RTextCell.prototype.draw = function(width, height) { 
    var result = []; 
    for (var i = 0; i < height; i++) { 
        var line = this.text[i] || ""; 
        result.push(repeat(" ", width - line.length) + line); 
    } 
    return result; 
};

console.log(drawTable(dataTable(MOUNTAINS))); 


// The instanceof Operator 
console.log(new RTextCell("A") instanceof RTextCell); 
console.log(new RTextCell("A") instanceof TextCell); 
console.log(new TextCell("A") instanceof RTextCell); 
console.log([1] instanceof Array); 
// let power = (base, exponent) => {
//     let result = 1;
//     for(var count = 0; count < exponent;count++)
//         result *= base;
//     return result;
// }


// let landscape = () => {
//     let result = "";
//     let flat = function(size) {
//         for(let count = 0; count < size; count++)
//             result +="_";
//     };

//     let mountain = function(size) {
//         result += "/";
//         for(let count = 0; count < size; count++)
//             result += "'"
//         result += "\\"
//     }

//     flat(3)
//     mountain(4)
//     flat(6)
//     mountain(1)
//     flat(1)
//     return result;
// }

// console.log(landscape())

// function multiplier(factor) {
//     return function(number) {
//         return number*factor
//     }
// }
// var twice = multiplier(2);
// console.log(twice(5))

function power(base, exponent) {
    if (exponent == 0) {
        return 1;
    } else {
        return base * power(base, exponent - 1);
    }
}

//console.log(power(2,4))

function findSolution(target) {
    function find(start, history) {
        if (start == target) return history;
        else if (start > target) return null;
        else
            return (
                find(start + 5, "(" + history + " + 5 )") ||
                find(start * 3, "(" + history + " * 3)")
            );
    }

    return find(1, "1");
}

// console.log(findSolution(24))
// function forEach(srray, action) {
//     for (let i = 0; i < array.length; i++) {
//         const element = array[i];
//     }
// }

// function forEach(array, action) {
//     let names = array.length;
//     for(var i  =0 ; i < names; i++)
//         action(array[i])
// }

// forEach(['John doe', 'Jane doe', 'John wick'], console.log);

// var numbers = [1,2,3,4,5,6], sum = 0;
// forEach(numbers, (number) =>  sum+=number)
// console.log(sum);

// The Lycanthrope’s Log
var journal = [];

function addEntry(events, didTurnIntoASquirrel) {
    journal.push({
        events: events,
        squirrel: didTurnIntoASquirrel
    });
}

addEntry(["work", "touched tree", "pizza", "running", "television"], false);
addEntry(
    [
        "work",
        "ice cream",
        "cauliflower",
        "lasagna",
        "touched tree",
        "brushed teeth"
    ],
    false
);
addEntry(["weekend", "cycling", "break", "peanuts", "beer"], true);

const phi = (table) => {
    return (
        (table[3] * table[0] - table[2] * table[1]) /
        Math.sqrt(
            (table[2] + table[3]) *
            (table[0] + table[1]) *
            (table[1] + table[3]) *
            (table[0] + table[2])
        )
    );
};
// console.log(phi([76, 9, 4, 1]));

var JOURNAL = [
    {"events": ["carrot", "exercise", "weekend"], "squirrel": false},
    {"events": ["bread", "pudding", "brushed teeth", "weekend", "touched tree"], "squirrel": false},
    {"events": ["carrot", "nachos", "brushed teeth", "cycling", "weekend"], "squirrel": false},
    {"events": ["brussel sprouts", "ice cream", "brushed teeth", "computer", "weekend"], "squirrel": false},
    {"events": ["potatoes", "candy", "brushed teeth", "exercise", "weekend", "dentist"], "squirrel": false},
    {"events": ["brussel sprouts", "pudding", "brushed teeth", "running", "weekend"], "squirrel": false},
    {"events": ["pizza", "brushed teeth", "computer", "work", "touched tree"], "squirrel": false},
    {"events": ["bread", "beer", "brushed teeth", "cycling", "work"], "squirrel": false},
    {"events": ["cauliflower", "brushed teeth", "work"], "squirrel": false},
    {"events": ["pizza", "brushed teeth", "cycling", "work"], "squirrel": false},
    {"events": ["lasagna", "nachos", "brushed teeth", "work"], "squirrel": false},
    {"events": ["brushed teeth", "weekend", "touched tree"], "squirrel": false},
    {"events": ["lettuce", "brushed teeth", "television", "weekend"], "squirrel": false},
    {"events": ["spaghetti", "brushed teeth", "work"], "squirrel": false},
    {"events": ["brushed teeth", "computer", "work"], "squirrel": false},
    {"events": ["lettuce", "nachos", "brushed teeth", "work"], "squirrel": false},
    {"events": ["carrot", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["brushed teeth", "work"], "squirrel": false},
    {"events": ["cauliflower", "reading", "weekend"], "squirrel": false},
    {"events": ["bread", "brushed teeth", "weekend"], "squirrel": false},
    {"events": ["lasagna", "brushed teeth", "exercise", "work"], "squirrel": false},
    {"events": ["spaghetti", "brushed teeth", "reading", "work"], "squirrel": false},
    {"events": ["carrot", "ice cream", "brushed teeth", "television", "work"], "squirrel": false},
    {"events": ["spaghetti", "nachos", "work"], "squirrel": false},
    {"events": ["cauliflower", "ice cream", "brushed teeth", "cycling", "work"], "squirrel": false},
    {"events": ["spaghetti", "peanuts", "computer", "weekend"], "squirrel": true},
    {"events": ["potatoes", "ice cream", "brushed teeth", "computer", "weekend"], "squirrel": false},
    {"events": ["potatoes", "ice cream", "brushed teeth", "work"], "squirrel": false},
    {"events": ["peanuts", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["potatoes", "exercise", "work"], "squirrel": false},
    {"events": ["pizza", "ice cream", "computer", "work"], "squirrel": false},
    {"events": ["lasagna", "ice cream", "work"], "squirrel": false},
    {"events": ["cauliflower", "candy", "reading", "weekend"], "squirrel": false},
    {"events": ["lasagna", "nachos", "brushed teeth", "running", "weekend"], "squirrel": false},
    {"events": ["potatoes", "brushed teeth", "work"], "squirrel": false},
    {"events": ["carrot", "work"], "squirrel": false},
    {"events": ["pizza", "beer", "work", "dentist"], "squirrel": false},
    {"events": ["lasagna", "pudding", "cycling", "work"], "squirrel": false},
    {"events": ["spaghetti", "brushed teeth", "reading", "work"], "squirrel": false},
    {"events": ["spaghetti", "pudding", "television", "weekend"], "squirrel": false},
    {"events": ["bread", "brushed teeth", "exercise", "weekend"], "squirrel": false},
    {"events": ["lasagna", "peanuts", "work"], "squirrel": true},
    {"events": ["pizza", "work"], "squirrel": false},
    {"events": ["potatoes", "exercise", "work"], "squirrel": false},
    {"events": ["brushed teeth", "exercise", "work"], "squirrel": false},
    {"events": ["spaghetti", "brushed teeth", "television", "work"], "squirrel": false},
    {"events": ["pizza", "cycling", "weekend"], "squirrel": false},
    {"events": ["carrot", "brushed teeth", "weekend"], "squirrel": false},
    {"events": ["carrot", "beer", "brushed teeth", "work"], "squirrel": false},
    {"events": ["pizza", "peanuts", "candy", "work"], "squirrel": true},
    {"events": ["carrot", "peanuts", "brushed teeth", "reading", "work"], "squirrel": false},
    {"events": ["potatoes", "peanuts", "brushed teeth", "work"], "squirrel": false},
    {"events": ["carrot", "nachos", "brushed teeth", "exercise", "work"], "squirrel": false},
    {"events": ["pizza", "peanuts", "brushed teeth", "television", "weekend"], "squirrel": false},
    {"events": ["lasagna", "brushed teeth", "cycling", "weekend"], "squirrel": false},
    {"events": ["cauliflower", "peanuts", "brushed teeth", "computer", "work", "touched tree"], "squirrel": false},
    {"events": ["lettuce", "brushed teeth", "television", "work"], "squirrel": false},
    {"events": ["potatoes", "brushed teeth", "computer", "work"], "squirrel": false},
    {"events": ["bread", "candy", "work"], "squirrel": false},
    {"events": ["potatoes", "nachos", "work"], "squirrel": false},
    {"events": ["carrot", "pudding", "brushed teeth", "weekend"], "squirrel": false},
    {"events": ["carrot", "brushed teeth", "exercise", "weekend", "touched tree"], "squirrel": false},
    {"events": ["brussel sprouts", "running", "work"], "squirrel": false},
    {"events": ["brushed teeth", "work"], "squirrel": false},
    {"events": ["lettuce", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["candy", "brushed teeth", "work"], "squirrel": false},
    {"events": ["brussel sprouts", "brushed teeth", "computer", "work"], "squirrel": false},
    {"events": ["bread", "brushed teeth", "weekend"], "squirrel": false},
    {"events": ["cauliflower", "brushed teeth", "weekend"], "squirrel": false},
    {"events": ["spaghetti", "candy", "television", "work", "touched tree"], "squirrel": false},
    {"events": ["carrot", "pudding", "brushed teeth", "work"], "squirrel": false},
    {"events": ["lettuce", "brushed teeth", "work"], "squirrel": false},
    {"events": ["carrot", "ice cream", "brushed teeth", "cycling", "work"], "squirrel": false},
    {"events": ["pizza", "brushed teeth", "work"], "squirrel": false},
    {"events": ["spaghetti", "peanuts", "exercise", "weekend"], "squirrel": true},
    {"events": ["bread", "beer", "computer", "weekend", "touched tree"], "squirrel": false},
    {"events": ["brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["lettuce", "peanuts", "brushed teeth", "work", "touched tree"], "squirrel": false},
    {"events": ["lasagna", "brushed teeth", "television", "work"], "squirrel": false},
    {"events": ["cauliflower", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["carrot", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["carrot", "reading", "weekend"], "squirrel": false},
    {"events": ["carrot", "peanuts", "reading", "weekend"], "squirrel": true},
    {"events": ["potatoes", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["lasagna", "ice cream", "work", "touched tree"], "squirrel": false},
    {"events": ["cauliflower", "peanuts", "brushed teeth", "cycling", "work"], "squirrel": false},
    {"events": ["pizza", "brushed teeth", "running", "work"], "squirrel": false},
    {"events": ["lettuce", "brushed teeth", "work"], "squirrel": false},
    {"events": ["bread", "brushed teeth", "television", "weekend"], "squirrel": false},
    {"events": ["cauliflower", "peanuts", "brushed teeth", "weekend"], "squirrel": false}
];


function hasEvent(event, entry) {
    return entry.events.indexOf(event) !== -1;
}

function tableFor(event, journal) {
    var table = [0, 0, 0, 0];
    for (var i = 0; i < journal.length; i++) {
        var entry = journal[i], index = 0;
        if (hasEvent(event, entry)) index += 1;
        if (entry.squirrel) index += 2;
        table[index] += 1
    }
    return table;
}

// console.log(tableFor("pizza", JOURNAL));

function gatherCollections(journal) {
    var phis = {};
    for (var entry = 0; entry < journal.length; entry++) {
        var events = journal[entry].events;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (!(event in phis))
                phis[event] = phi(tableFor(event, journal))
        }
    }
    return phis;
}

var correlations = gatherCollections(JOURNAL);
console.log(correlations.pizza);

for (var event in correlations) {
    console.log(event + ": " + correlations[event]);
    if (correlations > 0.1 || correlations < -0.1)
        console.log(event + ": " + correlations);
}

for (var i = 0; i < JOURNAL.length; i++) {
    var entry = JOURNAL[i];
    if (hasEvent("peanuts", entry) && !hasEvent("brushed teeth", entry)) {
      entry.events.push("peanut teeth")
    }
}

console.log(phi(tableFor("peanut teeth", JOURNAL)));
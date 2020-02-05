/*
let names= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday"];

function dayName(number) {
    return names[number];
}


 console.log(dayName(1));
*/
let weekDay = function () {
    let names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return {
        name: function (number) {
            return names[number]
        },
        number: function (name) {
            return names.indexOf(name)
        }
    }
}();

console.log(weekDay.name(weekDay.number("Sunday")));


(function (exports) {
    let names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    exports.name = function (number) {
        return names[number]
    };
    exports.number = function (name) {
        return names.indexOf(name)
    };
})(this.weekDay = {});

console.log(weekDay.name(weekDay.number("Saturday")));


let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));

function require(name) {
    let code = new Function("exports", readFile(name));
    let exports = {};
    code(exports);
    return exports;
}

console.log(require("weekDay").name(1));

define([], function () {
    let names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return {
        name: function (number) {
            return names[number];
        }, number: function (name) {
            return names.indexOf(name);
        }
    };
});

let defineCache = Object.create(null);
let currentMod = null;

function getModule(name) {

    if (name in defineCache)
        return defineCache[name];

    let module = {
        exports: null,
        loaded: false,
        onLoad: []
    };

    defineCache[name] = module;

    backgroundReadFile(name, function (code) {
        currentMod = module;
        new Function("", code)();
    });

    return module;
}

function define(depNames, moduleFunction) {

    let myMod = currentMod;
    let deps = depNames.map(getModule);

    deps.forEach(function (mod) {
        if (!mod.loaded) mod.onLoad.push(whenDepsLoaded);
    });

    function whenDepsLoaded() {

        if (!deps.every(function (m) {
            return m.loaded;
        })) return;

        let args = deps.map(function (m) {
            return m.exports;
        });

        let exports = moduleFunction.apply(null, args);

        if (myMod) {
            myMod.exports = exports;
            myMod.loaded = true;
            myMod.onLoad.every(function (f) {
                f();
            });
        }
    }

    whenDepsLoaded();
}





































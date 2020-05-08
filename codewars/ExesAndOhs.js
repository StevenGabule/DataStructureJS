/*
* Check to see if a string has the same amount of 'x's and 'o's. The method must return a boolean
* and be case insensitive. The string can contain any char.
* Examples input/output:
* XO("ooxx") => true
* XO("xooxx") => false
* XO("ooxXm") => true
* XO("zpzpzpp") => true // when no 'x' and 'o' is present should return true
* XO("zzoo") => false
* */
'use strict';

/**
 * @return {boolean}
 */
function XO(str) {
    let letters = str.split('');
    let OS = 0;
    let os = 0;

    let XS = 0;
    let xs = 0;

    if (!(/^[XxOo]/i).test(letters)) {
        return true
    }

    for (let i = 0; i < letters.length; i++) {
        if (letters[i] === 'x') {
            xs++;
        }
        if (letters[i] === 'X') {
            XS++;
        }

        if (letters[i] === 'o') {
            os++;
        }
        if (letters[i] === 'O') {
            OS++;
        }
    }

    let totalX = XS + xs;
    let totalO = OS + os;

    if (totalX === totalO) {
        return true;
    }

    if (XS !== OS) {
        return false;
    }

    return xs === os;

}


/**
 * @return {boolean}
 */
function XO1(str) {
    let x = str.match(/x/gi);
    let o = str.match(/o/gi);
    return (x && x.length) === (o && o.length);
}

/**
 * @return {boolean}
 */
function XO2(str) {
    str = str.toLowerCase().split('');
    return str.filter(x => x === 'x').length === str.filter(x => x ==='o').length;
}

/**
 * @return {boolean}
 */
function XO3(str) {
    let a = str.replace(/x/gi, '');
    let b = str.replace(/o/gi, '');
    return a.length === b.length;
}

/**
 * @return {boolean}
 */
function XO4(str) {
    return str.toLowerCase().split('x').length === str.toLowerCase().split('o').length;
}

/**
 * @return {boolean}
 */
function XO5(str) {
    return str.replace(/o/ig, '').length === str.replace(/x/ig, '').length
}


console.log(XO1('xoXO'));
console.log(XO1('zzoo'));

console.log(XO2('xoXO'));
console.log(XO2('zzoo'));

console.log(XO3('xoXO'));
console.log(XO3('zzoo'));

console.log(XO4('xoXO'));
console.log(XO4('zzoo'));
console.log(XO4('zpzpzpp'));

console.log(XO5('xoXO'));
console.log(XO5('zzoo'));
console.log(XO5('zpzpzpp'));

// true
console.log(XO('xoXO'));
console.log(XO('zpzpzpp'));
console.log(XO('ooxx'));
console.log(XO('ooxXm'));
console.log(XO("xxOo"));

// false
console.log(XO('xooxx'));
console.log(XO("ooom"));
console.log(XO("Oo"));
console.log(XO('zzoo'));
console.log(XO("xxxm"));

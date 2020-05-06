'use strict';

function squareDigits(num) {
    let numString = '';
    let n = Array.from(String(num), Number);
    for (let i = 0; i < n.length; i++) {
        numString = `${numString + '' + (n[i] * n[i]).toString()}`;
    }
    return Number(numString);
}

// solution by: jeff
const squareDigitSolution = num => Number(('' + num).split('').map((val) => val * val).join(''));

function squareDigitsSolution1(num) {
    return parseInt(num.toString().split('').map((i) => parseInt(i * i)).join(""));
}

function squareDigitsSolution2(num){
    return +num.toString().split('').map(i => i*i).join('');
}

//expected output: 811181
console.log(squareDigits(9119));
console.log(squareDigitSolution(9119));
console.log(squareDigitsSolution1(9119));
console.log(squareDigitsSolution2(9119));



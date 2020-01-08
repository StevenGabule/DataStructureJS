// change length of decimals
console.log(1.23.toFixed(2))
console.log(1.23345.toPrecision(4))

// fixing math errors with decimals
console.log(.3 === Number((.1+.2).toFixed(1)))
console.log(((.1+.2) - .3) < Number.EPSILON)
console.log(Math.round((.1+.2) * 10) / 10)

// get random integer in range

// inclusive of min and max
console.log(Math.round(Math.random() * (10-2) + 2));
// include in min
console.log(Math.floor(Math.random() * (10-2) + 2));

const getRandomInt = (min, max) =>  Math.round(Math.random() * (max-min) + min);

console.log(getRandomInt(2,15))

// rounding decimals to integers
const  getRandomDecimal = (min, max) => Math.random() * (max-min) + min;
console.log(getRandomDecimal(2,20))

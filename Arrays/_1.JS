// const arr = [1, 2, 3, 4];
// const initialValue = 0;
// const sumWithInitial = arr.reduce((d, cv) => d + cv, initialValue)
// console.log(sumWithInitial);

// const a2 = [15,16,17,18,19];
// function reducer(acc, curr, i) {
// 	const returns = acc + curr;
// 	console.log(`acc: ${acc}, cv: ${curr}, i: ${i}`);
// 	return returns;	
// }

// const total = a2.reduce(reducer);
// console.log({total});

// *** Function sequential piping
const pipe = (...functions) => (initialValue) => functions.reduce((acc, fn) => fn(acc), initialValue);

// Building blocks to use for composition
const double = (x) => 2 * x;
const triple = (x) => 3 * x;
const quadruple = (x) => 4 * x;

// Composed functions for multiplication of specific values
const multiply6 = pipe(double, triple);
const multiply9 = pipe(triple, triple);
const multiply16 = pipe(quadruple, quadruple);
const multiply24 = pipe(double, triple, quadruple);

console.log(multiply6(6)) // 36
console.log(multiply9(9)) // 81
console.log(multiply16(16)) // 256
console.log(multiply24(10)) // 240





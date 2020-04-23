const square = (number) => number * number;
console.log(square(6));

const factorial = function fun(n) {
	return n < 2 ? 1 : n * fun(n - 1)
}
console.log(factorial(4));

function map(f, a) {
	let result = [];
	let i;
	for (i = 0; i != a.length; i++) {
		result[i] = f(a[i]);
	}
	return result;
}
const f = (x) => x * x * x;

let numbers = [0, 1, 2, 5, 10];
let cube = map(f, numbers);
console.log(cube);

/*var myFunc;
if (num === 0) {
	myFunc = function(theObject) {
		theObject.make = 'Toyota';
	}
}*/

// Nested functions and closures
function addSquares(a,b) {
	function square(x) {
		return x*x;
	}
	return square(a) + square(b);
}

console.log(addSquares(2,3));
console.log(addSquares(3,4));
console.log(addSquares(4,5));

var x = 5 ** 3;
console.log(x)







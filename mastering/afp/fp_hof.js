const repeatOperation = (op, times) => {
	for (let i = 0; i < times; i++) {
		op(i)
	}
}


repeatOperation(i => console.log(`Iteration ${i}`), 3)

// Consider the concept of function composition expressed via a utility function. A traditional
// implementation leverages the concept of reduction to apply a series of functions from right
// to left, effectively simulating mathematical function composition:
const compose = (...funcs) => input => funcs.reduceRight((acc, fn) => fn(acc), input);
const double = x => x * 2;
const square = x => x * x;
const composedFunction = compose(square, double);
console.log(composedFunction(5)); // Outputs: 100 square(double(5))


//  An advanced pattern related to function composition is point-free style. This approach
//  minimizes explicit parameter declaration by expressing functions solely as compositions of
//  other functions. Point-free style fosters concise code, though it demands a deep familiarity
//  with the underlying abstraction to avoid obfuscating intent. For example, a transformation
//  pipeline that processes an array of numbers through a series of operations might be
//  articulated as:
const pipe = (...funcs) => input => funcs.reduce((acc, fn) => fn(acc), input);
const filterEven = arr => arr.filter(n => n % 2 === 0);
const increment = arr => arr.map(n => n + 1);
const sum = arr => arr.reduce((a, b) => a + b, 0);

const processNumbers = pipe(filterEven, increment, sum);
console.log(processNumbers([1, 2, 3, 4, 5])); // Outputs 8: (2,4)->(3,5)->Sum

// Integrating function composition with error handling can be accomplished by designing
// composable functions that encapsulate error propagation without cluttering the codebase.
// For example, wrapping operations in monadic constructs such as Maybe or Either types
// allows for composition without compromising on robustness. The following example
// demonstrates an approach to error-handling composition using a simplified Maybe monad implementation:
const Maybe = value => ({
	map: fn => (value != null ? Maybe(fn(value)) : Maybe(null)),
	fold: (defaultValue, fn) => (value != null ? fn(value) : defaultValue)
});

const saveDivide = (numerator, denominator) => denominator === 0 ? Maybe(null) : Maybe(numerator / denominator);
const incrementIfValid = result => result.map(r => r + 1);
const processDivision = (num, den) => incrementIfValid(saveDivide(num, den)).fold('Division Error', result => result)




console.log(processDivision(10, 0)); // Division Error
console.log(processDivision(10, 2)); // 6



const state = {
	user: {
		name: 'alice',
		age: 30
	},
	tasks: ['task 1', 'task 2']
}

// instead of mutating the original state
const newState = {
	...state,
	user: {
		...state.user,
		age: 31,
	}
}

console.log(state.user.age); // 30 
console.log(newState.user.age); // 31

const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const multiply = x => x * 2;
const increment = x => x + 1;

const processNumber = compose(multiply, increment);
console.log(processNumber(3)); // 8; evaluates as multiply(increment(3))

function memoize(fn) {
	const cache = new Map();
	return function (...args) {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}

		const result = fn.apply(this, args);
		cache.set(key, result);
		return result;
	}
}

const factorial = memoize(function (n) {
	return n <= 1 ? 1 : n * factorial(n - 1);
})

console.log(factorial(10))



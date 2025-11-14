// Introduction & Core Philosophy
// Functional Programming (FP) is a programming paradigm that treats computation as the evaluation of 
// mathematical functions, avoiding state changes and mutable data. In JavaScript, FP techniques can 
// lead to more predictable, testable, and maintainable code.

// Part 1: Foundational Concepts
// 1.1 Pure Functions
// Pure functions are the building blocks of FP. They always return the same output for the same input 
// and have no side effects.

// impure function - modifies external state
let globalCounter = 0;
function impureIncrement(value) {
	globalCounter++;
	return value + globalCounter;
}

// Pure function - no side effects
function pureIncrement(value, counter) {
	return value + counter; // only depends on parameters
}

// Why this design matters:
// 1. Predictability: pureIncrement(5, 3) will ALWAYS return 8
// 2. Testability: No need to set up external state for testing
// 3. Parallelization: Can be safely executed in parallel
// 4. Memoization: Results can be cached since same input = same output


// 1.2 Immutability
// Immutability prevents data from being modified after creation, eliminating a whole class of bugs.

// Advanced immutability patterns with structural sharing
class ImmutableList {
	constructor(items = []) {
		this._items = Object.freeze([...items]);
	}

	// Instead of modifying, create new instance
	append(item) {
		return new ImmutableList([...this._items, item]);
	}

	update(index, value) {
		if (index < 0 || index >= this._items.length) {
			throw new Error('Index out of bounds')
		}

		// Create new array with updated value
		const newItems = [
			...this._items.slice(0, index),
			value,
			...this._items.slice(index + 1)
		];

		return new ImmutableList(newItems)
	}

	// Lazy evaluation with generators for performance
	*map(fn) {
		for (const item of this._items) {
			yield fn(item)
		}
	}

	toArray() {
		return [...this._items];
	}
}

// Usage demonstrating persistence
const list1 = new ImmutableList([1, 2, 3]);
const list2 = list1.append(4);
const list3 = list2.update(1, 20);

console.log(list1.toArray()); // [1,2,3] - unchanged
console.log(list2.toArray()); // [1,2,3,4]
console.log(list3.toArray()); // [1,20,3,4]

// Why this design:
// 1. Time-travel debugging: Can keep history of all states
// 2. Concurrent access: No locks needed, data never changes
// 3. Predictable state transitions: Easy to reason about


// Part 2: Higher-Order Functions & Composition
// 2.1 Function Composition
// Composition is about building complex operations from simple functions.

// Advanced composition with type-safe error handling
const compose = (...fns) => {
	return (initialValue) => {
		return fns.reduceRight((acc, fn) => {
			// Error boundary for each function
			try {
				return fn(acc)
			} catch (error) {
				console.error(`Error in function ${fn.name}: ${error}`)
				throw error;
			}
		}, initialValue)
	}
}

// Pipe is compose in reverse order (more intuitive for many)
const pipe = (...fns) => (initialValue) => fns.reduce((acc, fn) => fn(acc), initialValue);

// Real world example: Data processing pipeline
const processUserData = pipe(
	// validation
	(data) => {
		if (!data.email || !data.email.includes('@')) {
			throw new Error('Invalid email')
		}
		return data;
	},

	// normalization
	(data) => ({
		...data,
		email: data.email.toLowerCase().trim(),
		name: data.name?.trim() || 'Anonymous'
	}),

	// Enrichment
	(data) => ({
		...data,
		createdAt: new Date().toISOString(),
		id: 1234,
	}),

	// Transformation
	(data) => ({
		...data,
		displayName: `${data.name} <${data.email}>`,
		avatar: `https://api.avatars.com/${data.email}`
	})
)

// Usage
const rawUser = { email: 'somone@gmail.com', name: '   John Doe   ' };
const processedUser = processUserData(rawUser);

// Why compose/pipe design:
// 1. Modularity: Each function has single responsibility
// 2. Reusability: Functions can be reused in different pipelines
// 3. Testability: Each transformation can be tested in isolation
// 4. Readability: Pipeline clearly shows data flow


// 2.2 Currying & Partial Application
// Currying transforms a function with multiple arguments into a sequence of functions each taking a single argument.

// Advanced curry implementation with placeholder support
const curry = (fn) => {
	const arity = fn.length;
	const _ = curry.placeholder = Symbol('placeholder');

	return function curried(...args) {
		// Count non-placeholder arguments
		const validArgs = args.filter(arg => arg !== _);

		if (validArgs.length >= arity) {
			return fn.apply(this, args);
		}

		return function (...nextArgs) {
			const mergedArgs = args.map(arg => arg === _ && nextArgs.length ? nextArgs.shift() : arg).concat(nextArgs);
			return curried(...mergedArgs);
		}
	}
}

// Practical application: Configurable validators
const validateField = curry((rules, fieldName, value) => {
	const errors = [];

	for (const role of rules) {
		const error = role(value);
		if (error) {
			errors.push({ field: fieldName, error })
		}
	}

	return errors.length ? errors : null;
})

















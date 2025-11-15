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

// create specialized validators
const emailRules = [
	(val) => !val ? 'Required' : null,
	(val) => !val.includes('@') ? 'Invalid email' : null,
	(val) => !val.length > 100 ? 'Too long' : null,
];

const validateEmail = validateField(emailRules);
const validateUserEmail = validateEmail('userEmail')

// Usage
console.log(validateUserEmail('invalid')); // [{ field: 'userEmail', error: 'Invalid email' }]
console.log(validateUserEmail('valid@gmail.com')); // null

// Why currying design:
// 1. Configuration: Pre-configure functions with common parameters
// 2. Function factories: Create specialized functions from generic ones
// 3. Point-free style: Enable writing code without mentioning arguments
// 4. Composition: Curried functions compose naturally


// Part 3: Monads & Functors
// 3.1 Maybe Monad - Handling Null/Undefined
// The Maybe monad elegantly handles nullable values without explicit null checks.
class Maybe {
	constructor(value) {
		this._value = value;
	}

	static of(value) {
		return new Maybe(value)
	}

	static nothing() {
		return new Maybe(null)
	}

	isNothing() {
		return this._value === null || this._value === undefined;
	}

	map(fn) {
		return this.isNothing() ? Maybe.nothing() : Maybe.of(fn(this._value))
	}

	flatMap(fn) {
		return this.isNothing() ? Maybe.nothing() : fn(this._value);
	}

	filter(predicate) {
		if (this.isNothing()) return this;
		return predicate(this._value) ? this : Maybe.nothing();
	}

	getOrElse(defaultValue) {
		return this.isNothing() ? defaultValue : this._value;
	}

	// Advanced: Apply function in Maybe Context to value in Maybe context
	ap(maybeWithFunction) {
		return this.isNothing() || maybeWithFunction.isNothing()
			? Maybe.nothing()
			: Maybe.of(maybeWithFunction._value(this._value));
	}
}

// Real-world use case: Safe navigation of nested objects
const safeProp = (prop) => (obj) => obj && obj.hasOwnProperty(prop) ? Maybe.of(obj[prop]) : Maybe.nothing();

const getUserCity = (user) => {
	return Maybe.of(user)
		.flatMap(safeProp('address'))
		.flatMap(safeProp('city'))
		.map(city => city.toUpperCase())
		.getOrElse('Unknown City')
}

// Test with various inputs
console.log(getUserCity({ address: { city: 'New York' } })); // 'NEW YORK'
console.log(getUserCity({ address: {} })); // 'Unknown City'
console.log(getUserCity({})); // 'Unknown City'
console.log(getUserCity(null)); // 'Unknown City'

// Why Maybe monad design:
// 1. Null safety: Eliminates null pointer exceptions
// 2. Composability: Chain operations without null checks
// 3. Explicit: Makes nullable values part of the type system
// 4. Railway programming: Success track vs failure track

class Either {
	constructor(value, isRight = true) {
		this._value = value;
		this._isRight = isRight;
	}

	static right(value) {
		return new Either(value, true)
	}

	static left(value) {
		return new Either(value, false)
	}

	static tryCatch(fn, errorHandler = e => e) {
		try {
			return Either.right(fn())
		} catch (error) {
			return Either.left(errorHandler(error))
		}
	}

	map(fn) {
		return this._isRight ? Either.right(fn(this._value)) : this;
	}

	flatMap(fn) {
		return this._isRight ? fn(this._value) : this;
	}

	mapLeft(fn) {
		return this._isRight ? this : Either.left(fn(this._value));
	}

	fold(leftFn, rightFn) {
		return this._isRight ? rightFn(this._value) : leftFn(this._value);
	}

	getOrElse(defaultValue) {
		return this._isRight ? this._value : defaultValue;
	}

	orElse(fn) {
		return this._isRight ? this : fn(this._value);
	}
}

// Advanced use case: Validation pipeline with error accumulation
class Validation extends Either {
	static combine(validations) {
		const errors = validations
			.filter(v => !v._isRight)
			.map(v => v._value);

		const values = validations
			.filter(v => v._isRight)
			.map(v => v._value);

		return errors.length > 0
			? Either.left(errors.flat())
			: Either.right(values)
	}
}

function validateAge(age) {
	if (age < 18) return Either.left(['Must be 18 or older']);
	if (age > 120) return Either.left(['Invalid age']);
	return Either.right(age)
}

function validateEmail1(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email)
		? Either.right(email)
		: Either.left(['Invalid email format'])
}

function validatePassword(password) {
	const errors = []
	if (password.length < 8) errors.push('Password too short.');
	if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase.');
	if (!/[0-9]/.test(password)) errors.push('Must contain number.');

	return errors.length > 0
		? Either.left(errors)
		: Either.right(password);
}

// Complex validation example
const validateUser = (userData) => {
	const validations = [
		validateAge(userData.age),
		validateEmail(userData.email),
		validatePassword(userData.password),
	];

	return Validation
		.combine(validations)
		.map(() => userData)
		.mapLeft(errors => ({
			message: 'Validation failed',
			errors
		}))
}

// Why Either monad design:
// 1. Explicit error handling: Errors are values, not exceptions
// 2. Composable: Chain operations that might fail
// 3. Type safety: Compiler/linter can verify error handling
// 4. No hidden control flow: No unexpected jumps via exceptions











// 2.2 Currying & Partial Application
// Currying transforms a function with multiple arguments into a sequence 
// of functions each taking a single argument.

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
			const mergedArgs = args.map(arg => arg === _ && nextArgs.length
				? nextArgs.shift()
				: arg)
				.concat(nextArgs);
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
// 3.2 Either Monad - Error Handling
// Either monad provides functional error handling without try-catch.
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
		validateEmail1(userData.email),
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
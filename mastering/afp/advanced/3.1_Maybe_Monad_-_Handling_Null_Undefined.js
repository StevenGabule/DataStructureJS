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
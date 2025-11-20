// ============================================
// FUNCTOR COMPOSITION
// ============================================

class Compose {
	constructor(value) {
		this.value = value;
	}

	static of(value) {
		return new Compose(value);
	}

	map(fn) {
		return Compose.of(
			this.value.map(inner => inner.map(fn))
		);
	}
}

// Example: Maybe of Array
const maybeArray = Compose.of(
	Maybe.of([1, 2, 3, 4, 5])
);

const doubled = maybeArray.map(x => x * 2);
// Result: Maybe([2, 4, 6, 8, 10])

// ============================================
// NATURAL TRANSFORMATIONS
// ============================================

// Transform one functor to another while preserving structure
const NaturalTransformations = {
	// Maybe to Either
	maybeToEither: (maybe, leftValue = 'Nothing') => {
		return maybe.isNothing()
			? Either.left(leftValue)
			: Either.right(maybe._value);
	},

	// Either to Maybe
	eitherToMaybe: (either) => {
		return either._isRight
			? Maybe.of(either._value)
			: Maybe.nothing();
	},

	// List to Maybe (head)
	listToMaybe: (list) => {
		return list.length > 0
			? Maybe.of(list[0])
			: Maybe.nothing();
	},

	// Maybe to List
	maybeToList: (maybe) => {
		return maybe.isNothing() ? [] : [maybe._value];
	},

	// Result to Either
	resultToEither: (result) => {
		return result.isOk()
			? Either.right(result._value)
			: Either.left(result._value);
	},

	// Task to Promise
	taskToPromise: (task) => {
		return new Promise((resolve, reject) => {
			task.fork(reject, resolve);
		});
	},

	// Promise to Task
	promiseToTask: (promise) => {
		return new Task((resolve, reject) => {
			promise.then(resolve).catch(reject);
		});
	}
};

// ============================================
// MONAD TRANSFORMERS
// ============================================

// Combine multiple monads
class MaybeT {
	constructor(value) {
		// value is M<Maybe<A>> where M is another monad
		this.value = value;
	}

	static of(value, Monad) {
		return new MaybeT(Monad.of(Maybe.of(value)));
	}

	map(fn) {
		return new MaybeT(
			this.value.map(maybe => maybe.map(fn))
		);
	}

	flatMap(fn, Monad) {
		return new MaybeT(
			this.value.flatMap(maybe =>
				maybe.isNothing()
					? Monad.of(Maybe.nothing())
					: fn(maybe._value).value
			)
		);
	}
}

// Example: Maybe + IO
const readOptionalFile = (filename) => {
	return new MaybeT(
		new IO(() => {
			try {
				const content = fs.readFileSync(filename, 'utf8');
				return Maybe.of(content);
			} catch (error) {
				return Maybe.nothing();
			}
		})
	);
};

// Chain optional file operations
const processConfig = readOptionalFile('config.json')
	.map(content => JSON.parse(content))
	.flatMap(config =>
		config.includeFile
			? readOptionalFile(config.includeFile)
			: MaybeT.of(config, IO)
	);
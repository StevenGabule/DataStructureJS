// ============================================
// COMPLETE TRANSDUCER PROTOCOL
// ============================================

// Transducer protocol symbols
const TRANSDUCER_INIT = '@@transducer/init';
const TRANSDUCER_RESULT = '@@transducer/result';
const TRANSDUCER_STEP = '@@transducer/step';
const TRANSDUCER_REDUCED = '@@transducer/reduced';

class Reduced {
	constructor(value) {
		this[TRANSDUCER_REDUCED] = true;
		this.value = value;
	}
}

const isReduced = (x) => x && x[TRANSDUCER_REDUCED];
const unreduced = (x) => isReduced(x) ? x.value : x;
const ensureReduced = (x) => isReduced(x) ? x : new Reduced(x);

// Enhanced transducer utilities
const Transducers = {
	// Core transducers
	map: (fn) => (xf) => ({
		[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
		[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
		[TRANSDUCER_STEP]: (result, input) => xf[TRANSDUCER_STEP](result, fn(input))
	}),

	filter: (pred) => (xf) => ({
		[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
		[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
		[TRANSDUCER_STEP]: (result, input) =>
			pred(input) ? xf[TRANSDUCER_STEP](result, input) : result
	}),

	take: (n) => (xf) => {
		let taken = 0;
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				if (taken < n) {
					taken++;
					const ret = xf[TRANSDUCER_STEP](result, input);
					return taken === n ? ensureReduced(ret) : ret;
				}
				return ensureReduced(result);
			}
		};
	},

	drop: (n) => (xf) => {
		let dropped = 0;
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				if (dropped < n) {
					dropped++;
					return result;
				}
				return xf[TRANSDUCER_STEP](result, input);
			}
		};
	},

	takeWhile: (pred) => (xf) => ({
		[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
		[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
		[TRANSDUCER_STEP]: (result, input) => {
			if (pred(input)) {
				return xf[TRANSDUCER_STEP](result, input);
			}
			return ensureReduced(result);
		}
	}),

	dropWhile: (pred) => (xf) => {
		let dropping = true;
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				if (dropping && pred(input)) {
					return result;
				}
				dropping = false;
				return xf[TRANSDUCER_STEP](result, input);
			}
		};
	},

	partition: (n) => (xf) => {
		let part = [];
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => {
				if (part.length > 0) {
					result = xf[TRANSDUCER_STEP](result, part);
				}
				return xf[TRANSDUCER_RESULT](result);
			},
			[TRANSDUCER_STEP]: (result, input) => {
				part.push(input);
				if (part.length === n) {
					const ret = xf[TRANSDUCER_STEP](result, [...part]);
					part = [];
					return ret;
				}
				return result;
			}
		};
	},

	partitionBy: (fn) => (xf) => {
		let part = [];
		let prevValue;
		let hasValue = false;

		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => {
				if (part.length > 0) {
					result = xf[TRANSDUCER_STEP](result, part);
				}
				return xf[TRANSDUCER_RESULT](result);
			},
			[TRANSDUCER_STEP]: (result, input) => {
				const value = fn(input);
				if (hasValue && value !== prevValue) {
					const ret = xf[TRANSDUCER_STEP](result, [...part]);
					part = [input];
					prevValue = value;
					return ret;
				}
				part.push(input);
				prevValue = value;
				hasValue = true;
				return result;
			}
		};
	},

	scan: (fn, init) => (xf) => {
		let acc = init;
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				acc = fn(acc, input);
				return xf[TRANSDUCER_STEP](result, acc);
			}
		};
	},

	dedupe: () => (xf) => {
		let prev;
		let hasValue = false;

		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				if (!hasValue || input !== prev) {
					hasValue = true;
					prev = input;
					return xf[TRANSDUCER_STEP](result, input);
				}
				return result;
			}
		};
	},

	interpose: (separator) => (xf) => {
		let first = true;
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				if (!first) {
					result = xf[TRANSDUCER_STEP](result, separator);
				}
				first = false;
				return xf[TRANSDUCER_STEP](result, input);
			}
		};
	},

	// Advanced: sliding window
	window: (n) => (xf) => {
		let window = [];
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => xf[TRANSDUCER_RESULT](result),
			[TRANSDUCER_STEP]: (result, input) => {
				window.push(input);
				if (window.length > n) {
					window.shift();
				}
				return window.length === n
					? xf[TRANSDUCER_STEP](result, [...window])
					: result;
			}
		};
	},

	// Advanced: group by
	groupBy: (keyFn) => (xf) => {
		const groups = new Map();
		return {
			[TRANSDUCER_INIT]: () => xf[TRANSDUCER_INIT](),
			[TRANSDUCER_RESULT]: (result) => {
				for (const [key, values] of groups) {
					result = xf[TRANSDUCER_STEP](result, { key, values });
				}
				return xf[TRANSDUCER_RESULT](result);
			},
			[TRANSDUCER_STEP]: (result, input) => {
				const key = keyFn(input);
				if (!groups.has(key)) {
					groups.set(key, []);
				}
				groups.get(key).push(input);
				return result;
			}
		};
	}
};

// Enhanced transduce function
const transduce = (xform, reducer, init, coll) => {
	const xf = xform({
		[TRANSDUCER_INIT]: () => init,
		[TRANSDUCER_RESULT]: (x) => x,
		[TRANSDUCER_STEP]: reducer
	});

	let result = xf[TRANSDUCER_INIT]();

	for (const input of coll) {
		result = xf[TRANSDUCER_STEP](result, input);
		if (isReduced(result)) {
			result = unreduced(result);
			break;
		}
	}

	return xf[TRANSDUCER_RESULT](result);
};

// Composition helper
const comp = (...fns) => fns.reduce((f, g) => (x) => f(g(x)));
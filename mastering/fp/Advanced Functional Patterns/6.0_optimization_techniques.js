// 1. Lazy evaluation with generators
function* lazyMap(fn, iterable) {
	for (const item of iterable) {
		yield fn(item);
	}
}

// 2. Structural sharing for immutable updates
const updateNested = (obj, path, value) => {
	if (path.length === 0) return value;

	const [head, ...tail] = path;
	return {
		...obj,
		[head]: updateNested(obj[head] || {}, tail, value)
	};
};

// 3. Trampolining for tail-call optimization
const trampoline = (fn) => (...args) => {
	let result = fn(...args);
	while (typeof result === 'function') {
		result = result();
	}

	return result;
}

const factorialTCO = trampoline((n, acc = 1) => {
	if (n <= 1) return acc;
	return () => factorialTCO(n - 1, n * acc);
})

// 4. Memoization for expensive pure functions
const memoizeWeakMap = (fn) => {
	const cache = new WeakMap();

	return (obj, ...args) => {
		if (!cache.has(obj)) {
			cache.set(obj, new Map());
		}

		const objCache = cache.get(obj);
		const key = JSON.stringify(args);

		if (!objCache.has(key)) {
			objCache.set(key, fn(obj, ...args));
		}

		return objCache.get(key);
	}
}


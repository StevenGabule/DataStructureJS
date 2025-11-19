// ============================================
// ADVANCED TRANSDUCER COMPOSITION
// ============================================

// Transducer protocol
const mapping = fn => reducer => (acc, val) => reducer(acc, fn(val));
const filtering = (pred) => reducer => (acc, val) => pred(val) ? reducer(acc, val) : acc;
const taking = (n) => reducer => {
	let count = 0;
	return (acc, val) => count++ < n ? reducer(acc, val) : acc;
};
const dropping = (n) => reducer => {
	let count = 0;
	return (acc, val) => count++ < n ? acc : reducer(acc, val);
};

// Partitioning transducer
const partitioning = (size) => reducer => {
	let partition = [];

	return {
		'@@transducer/step': (acc, val) => {
			partition.push(val);
			if (partition.length === size) {
				const result = reducer(acc, partition);
				partition = [];
				return result;
			}

			return acc;
		},
		'@@transducer/result': (acc) => {
			if (partition.length > 0) {
				return reducer(acc, partition);
			}

			return acc;
		}
	};
};

// Window transducer (sliding window)
const windowing = (size) => reducer => {
	let window = [];
	return (acc, val) => {
		window.push(val);
		if (window.length > size) {
			window.shift();
		}

		return window.length === size ? reducer(acc, [...window]) : acc;
	};
};

// Scan transducer (like reducer but emits intermediate values)
const scanning = (fn, initial) => reducer => {
	let accumulated = initial;
	return (acc, val) => {
		accumulated = fn(accumulated, val);
		return reducer(acc, accumulated);
	};
};

// Real-world example: Stream processing pipeline
const processDataStream = compose(
	filtering(data => data.valid),
	mapping(data => ({
		...data,
		timestamp: Date.now(),
		processed: true
	})),
	windowing(5),
	mapping(window => ({
		average: window.reduce((sum, item) => sum + item.value, 0) / window.length,
		max: Math.max(...window.map(item => item.value)),
		min: Math.min(...window.map(item => item.value)),
		items: window
	})),
	filtering(stats => stats.average > 50),
	taking(100), // Limit to 100 results
);

// Custom reducers for different output formats
const toArray = (arr = [], val) => {
	arr.push(val);
	return arr;
};
const toMap = (map = new Map(), val) => map.set(val.id || Date.now(), val);
const toStats = (stats = { count: 0, sum: 0 }, val) => ({
	count: stats.count + 1,
	sum: stats.sum + val.average,
	mean: (stats.sum + val.average) / (stats.count + 1)
});

// Usage with different outputs
const dataStream = Array.from({ length: 1000 }, (_, i) => ({
	id: i,
	value: Math.random() * 100,
	valid: Math.random() > 0.1
}))

const arrayResult = data.stream.reduce(processDataStream(toArray), []);
const mapResult = data.stream.reduce(processDataStream(toMap), new Map());
const statsResult = data.stream.reduce(processDataStream(toStats), undefined);


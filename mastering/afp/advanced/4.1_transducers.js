// Part 4: Advanced Functional Patterns
// 4.1 Transducers - Composable Algorithmic Transformations
// Transducers separate the transformation logic from the iteration mechanism.

// Transducer implementation
const map = (fn) => (reducer) => (acc, val) => reducer(acc, fn(val));
const filter = (pred) => (reducer) => (acc, val) => pred(val) ? reducer(acc, val) : acc;
const take = (n) => (reducer) => {
	let count = 0;
	return (acc, val) => {
		if (count++ < n) return reducer(acc, val);
		return acc;
	}
}

// compose transducers
const compose = (...fns) => fns.reduce((f, g) => x => f(g(x)));

// transduce function
const transduce = (transducer, reducer, initial, collection) => {
	const transformedReducer = transducer(reducer);
	return collection.reduce(transformedReducer, initial);
}

// Processing large datasets efficiently
const processLargeDataset = compose(
	filter(user => user.active),
	map(user => ({
		...user,
		fullName: `${user.firstName} ${user.lastName}`
	})),
	filter(user => user.age >= 8),
	take(100)
);

// Can be applied to different data structures
const arrayPush = (arr, val) => { arr.push(val); return arr; };
const setAdd = (set, val) => set.add(val);

const users = Array.from({ length: 10000 }, (_, i) => ({
	id: i,
	firstName: `First${i}`,
	lastName: `Last${i}`,
	age: Math.floor(Math.random() * 50) + 10,
	action: Math.random() > 0.3
}));

// Process into array
const resultArray = transduce(
	processLargeDataset,
	arrayPush,
	[],
	users
);

// Process into Set (for uniqueness)
const resultSet = transduce(
	processLargeDataset,
	setAdd,
	new Set(),
	users.map(u => u.id)
);

// Why transducers design:
// 1. Performance: Single pass through data, no intermediate arrays
// 2. Composability: Build complex transformations from simple ones
// 3. Reusability: Same transformation for different data structures
// 4. Memory efficiency: Process infinite streams without buffering


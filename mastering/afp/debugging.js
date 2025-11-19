// Debugging: Use tap/debug functions to inspect intermediate values

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const tap = (label) => (value) => {
	console.log(`[${label}]: ${value}`)
	return value;
}

// Usage in pipeline
const debugPipeline = pipe(
	tap('input'),
	transform1,
	tap('after transform1'),
	transform2,
	tap('after transform2'),
	transform3,
	tap('final output')
);
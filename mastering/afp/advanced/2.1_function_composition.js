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
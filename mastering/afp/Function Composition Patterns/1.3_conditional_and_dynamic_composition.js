// ===========================================
// CONDITION COMPOSITION
// ===========================================

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
const pipeAsync = (...fns) => {
	return async (initialValue) => {
		let result = initialValue;

		for (const fn of fns) {
			result = await fn(result);
		}

		return result;
	}
}

const when = (predicate, fn) => x => predicate(x) ? fn(x) : x;
const unless = (predicate, fn) => x => predicate(x) ? x : fn(x);

// Skip certain transformations based on conditions
const processUser = pipe(
	when(user => !user.email, generateDefaultEmail),
	when(user => user.age < 18, addParentalControls),
	unless(user => user.verified, sendVerificationEmail),
	when(user => user.premium, addPremiumFeatures)
)

// ===========================================
// DYNAMIC COMPOSITION BUILDER
// ===========================================

class PipelineBuilder {
	constructor() {
		this.steps = [];
		this.conditions = new Map();
	}

	add(fn, options = {}) {
		this.steps.push({ fn, options });
		return this;
	}

	addIf(condition, fn) {
		this.steps.push({
			fn: when(condition, fn),
			conditional: true
		});
		return this;
	}

	addValidator(validator, errorMessage) {
		this.steps.push({
			fn: (input) => {
				if (!validator(input)) {
					throw new Error(errorMessage);
				}
				return input;
			},
			type: 'validator'
		});

		return this;
	}

	addTransformer(fn) {
		this.steps.push({ fn, type: 'transformer' })
		return this;
	}

	addLogger(message) {
		this.steps.push({
			fn: (input) => {
				console.log(message, input);
				return input;
			},
			type: 'logger'
		});

		return this;
	}

	build() {
		const functions = this.steps.map(step => step.fn);
		return pipe(...functions);
	}

	buildWithMetrics() {
		const functions = this.steps.map(step => {
			return async (input) => {
				const startTime = performance.now();
				const result = await step.fn(input);
				const duration = performance.now() - startTime;

				console.log(`Step ${step.fn.name || 'Anonymous'}: ${duration.toFixed(2)}ms`);
				return result;
			}
		});

		return pipeAsync(...functions);
	}
}

// Usage
const userPipeline = new PipelineBuilder()
	.addValidator(user => user.email, 'Email is required')
	.addTransformer(user => ({ ...user, email: user.email.toLowerCase() }))
	.addIf(user => !user.username, user => ({
		...user,
		username: user.email.split('@')[0]
	}))
	.addLogger('User after logging...')
	.build();





















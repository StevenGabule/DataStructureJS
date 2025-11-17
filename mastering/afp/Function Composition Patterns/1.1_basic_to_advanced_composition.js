// Traditional approach - nested function calls (hard to read)
// const result = capitalize(trim(toLowerCase("  HELLO WORLD  ")));

// Better: Right-to-left composition (mathematical style)
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Left-to-right composition (more intuitive)
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// ==========================================
// ADVANCED COMPOSITION WITH ERROR HANDLING
// ==========================================
const safeCompose = (...fns) => {
	return (initialValue) => {
		let result = initialValue;
		const errors = [];

		for (let i = fns.length - 1; i >= 0; i--) {
			try {
				result = fns[i](result);
			} catch (error) {
				errors.push({
					function: fns[i].name || `Anonymous at position ${i}`,
					error: error.message,
					input: result
				})

				// Decide whether to continue or stop
				if (error.fatal) {
					throw new CompositionError(errors)
				}
			}
		}

		return { result, errors }
	}
}

class CompositionError extends Error {
	constructor(errors) {
		super('Composition failed');
		this.errors = errors;
	}
}


// ==========================================
// ASYNC COMPOSITION
// ==========================================
const pipeAsync = (...fns) => {
	return async (initialValue) => {
		let result = initialValue;

		for (const fn of fns) {
			result = await fn(result);
		}

		return result;
	}
}

// With parallel processing where possible
const pipeAsyncOptimized = (...fns) => {
	return async (initialValue) => {
		const groups = groupIndependentFunctions(fns);
		let result = initialValue;

		for (const group of groups) {
			if (group.length === 1) {
				result = await group[0](result);
			} else {
				// Run independent functions in parallel
				const results = await Promise.all(
					group.map(fn => fn(result))
				)

				// Merge results (custom logic needed)
				result = mergeResults(results);
			}
		}

		return result;
	}
}

// Real-world example: Data processing pipeline
const processCustomerOrder = pipeAsync(
	validateOrder,
	checkInventory,
	calculatePricing,
	applyDiscounts,
	calculateTax,
	createInvoice,
	sendConfirmationEmail
);

// Usage
const order = {
	customerId: 'cust123',
	items: [
		{ productId: 'prod1', quantity: 1 },
		{ productId: 'prod2', quantity: 2 },
	],
	shippingAddress: {/*...*/ }
}

processCustomerOrder(order)
	.then(result => console.log('Order processed:', result))
	.catch(error => console.error('Order failed:', error))





































































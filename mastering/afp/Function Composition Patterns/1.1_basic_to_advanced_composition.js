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




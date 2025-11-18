// ============================================
// VARIADIC COMPOSITION (Multiple Arguments)
// ============================================

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const composeVariadic = (...fns) => {
	return (...args) => {
		// First function can take multiple arguments
		const [first, ...rest] = fns;
		return rest.reduce((acc, fn) => fn(acc), first(...args));
	}
}

// Example: String formatter
const formatUserName = composeVariadic(
	(first, middle, last) => ({ first, middle, last }),
	(name) => ({
		...name,
		full: `${name.first} ${name.middle} ${name.last}`.trim(),
	}),
	(name) => ({
		...name,
		initials: `${name.first[0]}${name.middle?.[0] || ''}${name.last[0]}`.toUpperCase()
	}),
	(name) => ({
		...name,
		display: `${name.full} (${name.initials})`
	})
);

console.log(formatUserName('John', 'Q', 'Doe'));
// { first: 'John', middle: 'Q', last: 'Doe', full: 'John Q Doe', initials: 'JQD', display: 'John Q Doe (JQD)' }

// ============================================
// BRANCHING COMPOSITION
// ============================================

const branch = (predicate, onTrue, onFalse) => {
	return (input) => {
		return predicate(input) ? onTrue(input) : onFalse(input)
	}
}

const either = (primaryFn, fallbackFn) => {
	return async (input) => {
		try {
			return await primaryFn(input)
		} catch (error) {
			console.warn(`Primary function failed, using callback: ${error.message}`);
			return await fallbackFn(input)
		}
	}
}

// Real use case: Payment processing
const processPayment = pipe(
	validatePaymentDetails,
	branch(
		payment => payment.amount > 1000,
		pipe(
			requireAdditionalVerification,
			checkFraudScore,
			processHighValuePayment
		),
		processStandardPayment
	),
	either(
		chargeMainPaymentGateway,
		chargeBackupPaymentGateway
	),
	logTransaction
)






























// Best Practices and Patterns

// ============================================
// MONAD SELECTION GUIDE
// ============================================

const MonadSelector = {
	// Use Maybe for nullable values
	handleNullable: (value) => {
		return Maybe.of(value)
			.map(v => v.toUpperCase())
			.flatMap(v => v.length > 0 ? Maybe.of(v) : Maybe.nothing())
			.getOrElse('default');
	},

	// Use Either for error handling with context
	handleErrors: async (operation) => {
		return Either.tryCatch(
			() => operation(),
			error => ({
				message: error.message,
				stack: error.stack,
				timestamp: Date.now()
			})
		);
	},

	// Use IO for side effects
	handleSideEffects: () => {
		return IO.of(null)
			.flatMap(() => DOM.querySelector('#input'))
			.map(input => input.value)
			.flatMap(value => HTTP.post('/api/data', { value }))
			.flatMap(() => DOM.querySelector('#output'))
			.flatMap(output => DOM.innerHTML(output, 'Success!'));
	},

	// Use Reader for dependency injection
	handleDependencies: () => {
		return Reader.ask()
			.map(env => env.database)
			.flatMap(db => Reader.of(db.query('SELECT * FROM users')))
			.map(users => users.filter(u => u.active));
	},

	// Use State for stateful computations
	handleState: () => {
		return State.get()
			.map(state => state.counter)
			.flatMap(counter =>
				State.put({ counter: counter + 1 })
					.map(() => counter)
			);
	},

	// Use Writer for logging
	handleLogging: () => {
		return new Writer(42, ['Initialized with 42'])
			.flatMap(x => new Writer(x * 2, [`Doubled to ${x * 2}`]), ArrayMonoid)
			.flatMap(x => new Writer(x + 8, [`Added 8 to get ${x + 8}`]), ArrayMonoid);
	},

	// Use Task for async operations
	handleAsync: () => {
		return Task.of(1)
			.map(x => x + 1)
			.flatMap(x => new Task((resolve) =>
				setTimeout(() => resolve(x * 2), 1000)
			));
	}
};

// ============================================
// COMBINING MONADS FOR COMPLEX SCENARIOS
// ============================================

// Real-world example: User authentication with multiple concerns
const authenticateUser = (credentials) => {
	// Start with validation (Maybe)
	const validated = Maybe.of(credentials)
		.flatMap(creds =>
			creds.username && creds.password
				? Maybe.of(creds)
				: Maybe.nothing()
		);

	// Convert to Either for better error messages
	const validatedEither = NaturalTransformations.maybeToEither(
		validated,
		'Invalid credentials format'
	);

	// Perform async operation with Result
	return validatedEither.fold(
		error => AsyncResult.of(Result.err(error)),
		creds => AsyncResult.fromPromise(
			fetch('/api/auth', {
				method: 'POST',
				body: JSON.stringify(creds)
			})
		)
			.flatMap(response => {
				// Log the attempt (Writer pattern)
				const log = {
					action: 'AUTH_ATTEMPT',
					username: creds.username,
					timestamp: Date.now(),
					success: response.ok
				};

				console.log('Audit:', log);

				// Continue with response processing
				return response.ok
					? AsyncResult.fromPromise(response.json())
					: new AsyncResult(Promise.resolve(
						Result.err('Authentication failed')
					));
			})
			.map(user => {
				// Store in state (State pattern)
				localStorage.setItem('user', JSON.stringify(user));
				return user;
			})
	);
};
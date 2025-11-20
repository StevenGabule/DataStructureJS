// ============================================
// READER MONAD - Functional Dependency Injection
// ============================================

class Reader {
	constructor(computation) {
		this.computation = computation;
	}

	static of(value) {
		return new Reader(() => value)
	}

	static ask() {
		return new Reader(env => env);
	}

	map(fn) {
		return new Reader(env => fn(this.computation(env)));
	}

	flatMap(fn) {
		return new Reader(env => fn(this.computation(env)).computation(env));
	}

	chain(fn) {
		return this.flatMap(fn);
	}

	run(env) {
		return this.computation(env);
	}

	local(fn) {
		return new Reader(env => this.computation(fn(env)));
	}
}

// ============================================
// REAL-WORLD: Configuration-Based Application
// ============================================
class AppConfig {
	constructor(config) {
		this.database = config.database;
		this.api = config.api;
		this.features = config.features;
		this.logging = config.logging;
	}
}

// Service functions that depend on configuration
const DatabaseService = {
	connect: () => Reader.ask().map(config => {
		console.log(`Connecting to ${config.database.host}:${config.database.port}`);
		return {
			host: config.database.host,
			port: config.database.port,
			connected: true
		};
	}),

	query: (sql) => Reader.ask().flatMap(config => {
		if (!config.database.connected) {
			return DatabaseService.connect().map(() => {
				console.log(`Executing Query: ${sql}`);
				return { results: [], sql }
			});
		}
		return Reader.of({ results: [], sql })
	})
}

const LoggingService = {
	log: (level, message) => Reader.ask().map(config => {
		if (config.logging.enabled && config.logging.level <= level) {
			const timestamp = new Date().toISOString();
			console.log(`[${timestamp}] [${level}] ${message}`);
		}

		return { logged: true, level, message };
	}),
	debug: (message) => LoggingService.log('DEBUG', message),
	info: (message) => LoggingService.log('INFO', message),
	error: (message) => LoggingService.log('ERROR', message),
}

const FeatureService = {
	isEnabled: (feature) => Reader.ask().map(config =>
		config.features[feature] === true
	),

	executeIfEnabled: (feature, action) =>
		FeatureService.isEnabled(feature).flatMap(enabled =>
			enabled ? action : Reader.of(null)
		)
};

// Compose services using Reader
const initializeApp = () => {
	return DatabaseService.connect()
		.flatMap(() => LoggingService.info('Database connected'))
		.flatMap(() => FeatureService.executeIfEnabled('analytics',
			LoggingService.info('Analytics enabled')
		))
		.flatMap(() => FeatureService.executeIfEnabled('caching',
			LoggingService.info('Caching enabled')
		))
		.map(() => ({ initialized: true }))
};

// Run with configuration
const config = new AppConfig({
	database: {
		host: 'localhost',
		port: 5432,
		connected: false
	},
	api: {
		baseUrl: 'https://api.example.com',
		timeout: 5000
	},
	features: {
		analytics: true,
		caching: false,
		beta: true,
	},
	logging: {
		enabled: true,
		level: 0
	}
});

// Execute the application
const appResult = initializeApp().run(config);

// =================================================
// DEPENDENCY INJECTION FOR SERVICES
// =================================================
class ServiceContainer {
	constructor() {
		this.services = new Map();
	}

	register(name, factory) {
		this.services.set(name, factory);
		return this;
	}

	get(name) {
		return Reader.ask().map(container => {
			const factory = container.services.get(name);
			if (!factory) throw new Error(`Service ${name} not found.`);
			return factory(container)
		});
	}
}

// Define services with dependencies
const createUserService = () => new Reader(container => ({
	create: (userData) =>
		container.get('database').flatMap(db =>
			container.get('logger').flatMap(logger => {
				logger.info(`Creating user: ${userData.email}`);

				// Simulate user creation
				return Reader.of({ id: Date.now(), ...userData });
			})
		),

	findById: (id) => container.get('database').flatMap(db =>
		container.get('cache').flatMap(cache => {
			// Check cache first
			const cached = cache.get(`user:${id}`);
			if (cached) return Reader.of(cached);

			// Fetch from database
			return Reader.of({ id, name: 'John Doe', email: 'john@example.com' });
		})
	)
}));

const createEmailService = () => new Reader(container => ({
	send: (to, subject, body) =>
		container.get('logger').flatMap(logger => {
			logger.info(`Sending email to ${to}: ${subject}`);
			return Reader.of({ sent: true, to, subject });
		})
}));

// Wire up dependencies
const container = new ServiceContainer()
	.register('database', () => ({ query: () => Promise.resolve([]) }))
	.register('cache', () => new Map())
	.register('logger', () => ({ info: console.log, error: console.error }))
	.register('userService', createUserService)
	.register('emailService', createEmailService);

// Use services with automatic dependency injection
const createUserWorkflow = (userData) => {
	return container.get('userService').flatMap(userService =>
		userService.create(userData).flatMap(user =>
			container.get('emailService').flatMap(emailService =>
				emailService.send(user.email, 'Welcome!', 'Thanks for signing up!')
					.map(() => user)
			)
		)
	);
};

// run with container
const newUser = createUserWorkflow({
	email: 'test@example.com'
}).run(container)





























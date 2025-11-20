// ============================================
// SUM TYPES (DISCRIMINATED UNIONS)
// ============================================

class ADT {
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}

	static create(types) {
		const adt = {};

		types.forEach(type => {
			if (typeof type === 'string') {
				// Nullary constructor
				adt[type] = new ADT(type, null);
			} else {
				// Constructor with parameters
				const [name, ...params] = type;
				adt[name] = (...args) => {
					const value = {};
					params.forEach((param, i) => {
						value[param] = args[i];
					});
					return new ADT(name, value);
				};
			}
		});

		return adt;
	}

	match(patterns) {
		const pattern = patterns[this.type];
		if (!pattern) {
			if (patterns._) {
				return patterns._(this.value);
			}
			throw new Error(`No pattern for ${this.type}`);
		}
		return pattern(this.value);
	}

	map(fn) {
		return new ADT(this.type, fn(this.value));
	}

	fold(patterns) {
		return this.match(patterns);
	}
}

// ============================================
// REAL-WORLD: REMOTE DATA PATTERN
// ============================================

const RemoteData = ADT.create([
	'NotAsked',
	'Loading',
	['Success', 'data'],
	['Failure', 'error']
]);

class RemoteDataManager {
	constructor() {
		this.cache = new Map();
	}

	fetch(url, options = {}) {
		const cacheKey = `${url}-${JSON.stringify(options)}`;

		// Return cached if available and not expired
		if (this.cache.has(cacheKey)) {
			const cached = this.cache.get(cacheKey);
			if (Date.now() - cached.timestamp < (options.cacheTTL || 60000)) {
				return Promise.resolve(cached.data);
			}
		}

		// Initial state
		let state = RemoteData.Loading;

		// Perform fetch
		return fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				state = RemoteData.Success(data);
				this.cache.set(cacheKey, {
					data: state,
					timestamp: Date.now()
				});
				return state;
			})
			.catch(error => {
				state = RemoteData.Failure(error.message);
				return state;
			});
	}

	static render(remoteData, handlers) {
		return remoteData.match({
			NotAsked: () => handlers.notAsked ? handlers.notAsked() : null,
			Loading: () => handlers.loading ? handlers.loading() : 'Loading...',
			Success: ({ data }) => handlers.success(data),
			Failure: ({ error }) => handlers.failure ? handlers.failure(error) : `Error: ${error}`,
			_: () => null
		});
	}
}

// Usage
const dataManager = new RemoteDataManager();

async function loadUserData(userId) {
	const remoteData = await dataManager.fetch(`/api/users/${userId}`);

	const result = RemoteDataManager.render(remoteData, {
		loading: () => console.log('Fetching user...'),
		success: (user) => {
			console.log('User loaded:', user);
			return user;
		},
		failure: (error) => {
			console.error('Failed to load user:', error);
			return null;
		}
	});

	return result;
}

// ============================================
// EXPRESSION TREE ADT
// ============================================

const Expr = ADT.create([
	['Const', 'value'],
	['Var', 'name'],
	['Add', 'left', 'right'],
	['Mul', 'left', 'right'],
	['Sub', 'left', 'right'],
	['Div', 'left', 'right']
]);

class ExpressionEvaluator {
	static evaluate(expr, env = {}) {
		return expr.match({
			Const: ({ value }) => value,
			Var: ({ name }) => {
				if (!(name in env)) {
					throw new Error(`Undefined variable: ${name}`);
				}
				return env[name];
			},
			Add: ({ left, right }) =>
				ExpressionEvaluator.evaluate(left, env) +
				ExpressionEvaluator.evaluate(right, env),
			Mul: ({ left, right }) =>
				ExpressionEvaluator.evaluate(left, env) *
				ExpressionEvaluator.evaluate(right, env),
			Sub: ({ left, right }) =>
				ExpressionEvaluator.evaluate(left, env) -
				ExpressionEvaluator.evaluate(right, env),
			Div: ({ left, right }) => {
				const rightVal = ExpressionEvaluator.evaluate(right, env);
				if (rightVal === 0) {
					throw new Error('Division by zero');
				}
				return ExpressionEvaluator.evaluate(left, env) / rightVal;
			}
		});
	}

	static optimize(expr) {
		return expr.match({
			Const: () => expr,
			Var: () => expr,
			Add: ({ left, right }) => {
				const optLeft = ExpressionEvaluator.optimize(left);
				const optRight = ExpressionEvaluator.optimize(right);

				// Constant folding
				if (optLeft.type === 'Const' && optRight.type === 'Const') {
					return Expr.Const(optLeft.value.value + optRight.value.value);
				}

				// Identity elimination
				if (optLeft.type === 'Const' && optLeft.value.value === 0) {
					return optRight;
				}
				if (optRight.type === 'Const' && optRight.value.value === 0) {
					return optLeft;
				}

				return Expr.Add(optLeft, optRight);
			},
			Mul: ({ left, right }) => {
				const optLeft = ExpressionEvaluator.optimize(left);
				const optRight = ExpressionEvaluator.optimize(right);

				// Constant folding
				if (optLeft.type === 'Const' && optRight.type === 'Const') {
					return Expr.Const(optLeft.value.value * optRight.value.value);
				}

				// Zero elimination
				if ((optLeft.type === 'Const' && optLeft.value.value === 0) ||
					(optRight.type === 'Const' && optRight.value.value === 0)) {
					return Expr.Const(0);
				}

				// Identity elimination
				if (optLeft.type === 'Const' && optLeft.value.value === 1) {
					return optRight;
				}
				if (optRight.type === 'Const' && optRight.value.value === 1) {
					return optLeft;
				}

				return Expr.Mul(optLeft, optRight);
			},
			Sub: ({ left, right }) => {
				const optLeft = ExpressionEvaluator.optimize(left);
				const optRight = ExpressionEvaluator.optimize(right);

				if (optLeft.type === 'Const' && optRight.type === 'Const') {
					return Expr.Const(optLeft.value.value - optRight.value.value);
				}

				return Expr.Sub(optLeft, optRight);
			},
			Div: ({ left, right }) => {
				const optLeft = ExpressionEvaluator.optimize(left);
				const optRight = ExpressionEvaluator.optimize(right);

				if (optLeft.type === 'Const' && optRight.type === 'Const') {
					return Expr.Const(optLeft.value.value / optRight.value.value);
				}

				return Expr.Div(optLeft, optRight);
			}
		});
	}

	static toString(expr) {
		return expr.match({
			Const: ({ value }) => String(value),
			Var: ({ name }) => name,
			Add: ({ left, right }) =>
				`(${ExpressionEvaluator.toString(left)} + ${ExpressionEvaluator.toString(right)})`,
			Mul: ({ left, right }) =>
				`(${ExpressionEvaluator.toString(left)} * ${ExpressionEvaluator.toString(right)})`,
			Sub: ({ left, right }) =>
				`(${ExpressionEvaluator.toString(left)} - ${ExpressionEvaluator.toString(right)})`,
			Div: ({ left, right }) =>
				`(${ExpressionEvaluator.toString(left)} / ${ExpressionEvaluator.toString(right)})`
		});
	}
}

// Example expression: (x + 2) * (y - 3)
const expr = Expr.Mul(
	Expr.Add(Expr.Var('x'), Expr.Const(2)),
	Expr.Sub(Expr.Var('y'), Expr.Const(3))
);

console.log(ExpressionEvaluator.toString(expr));
console.log(ExpressionEvaluator.evaluate(expr, { x: 5, y: 8 })); // (5+2)*(8-3) = 35

// ============================================
// COMMAND PATTERN WITH ADT
// ============================================

const Command = ADT.create([
	['Move', 'direction', 'distance'],
	['Rotate', 'angle'],
	['Scale', 'factor'],
	['Composite', 'commands'],
	['Undo'],
	['Redo']
]);

class CommandProcessor {
	constructor() {
		this.history = [];
		this.future = [];
		this.state = { x: 0, y: 0, angle: 0, scale: 1 };
	}

	execute(command) {
		const newState = command.match({
			Move: ({ direction, distance }) => {
				const rad = (this.state.angle * Math.PI) / 180;
				const dx = Math.cos(rad) * distance;
				const dy = Math.sin(rad) * distance;

				return {
					...this.state,
					x: this.state.x + dx,
					y: this.state.y + dy
				};
			},

			Rotate: ({ angle }) => ({
				...this.state,
				angle: (this.state.angle + angle) % 360
			}),

			Scale: ({ factor }) => ({
				...this.state,
				scale: this.state.scale * factor
			}),

			Composite: ({ commands }) => {
				return commands.reduce(
					(state, cmd) => {
						this.state = state;
						return this.execute(cmd);
					},
					this.state
				);
			},

			Undo: () => {
				if (this.history.length > 0) {
					this.future.push(this.state);
					return this.history.pop();
				}
				return this.state;
			},

			Redo: () => {
				if (this.future.length > 0) {
					this.history.push(this.state);
					return this.future.pop();
				}
				return this.state;
			}
		});

		// Save state for undo (except for undo/redo commands)
		if (command.type !== 'Undo' && command.type !== 'Redo') {
			this.history.push(this.state);
			this.future = []; // Clear redo stack
		}

		this.state = newState;
		return newState;
	}

	batch(commands) {
		return this.execute(Command.Composite(commands));
	}
}

// Usage
const processor = new CommandProcessor();

processor.execute(Command.Move('forward', 10));
processor.execute(Command.Rotate(90));
processor.execute(Command.Move('forward', 5));
processor.execute(Command.Scale(2));

console.log('Current state:', processor.state);

processor.execute(Command.Undo());
console.log('After undo:', processor.state);

processor.execute(Command.Redo());
console.log('After redo:', processor.state);
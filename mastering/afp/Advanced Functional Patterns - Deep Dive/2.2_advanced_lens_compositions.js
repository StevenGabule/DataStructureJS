// ============================================
// POLYMORPHIC LENSES
// ============================================

class PolymorphicLens {
	constructor(lenses) {
		this.lenses = lenses;
	}

	static create(lensMap) {
		return new PolymorphicLens(lensMap);
	}

	get(obj) {
		const type = this.detectType(obj);
		const lens = this.lenses[type];
		if (!lens) throw new Error(`No lens for type: ${type}`);
		return lens.get(obj);
	}

	set(value, obj) {
		const type = this.detectType(obj);
		const lens = this.lenses[type];
		if (!lens) throw new Error(`No lens for type: ${type}`);
		return lens.set(value, obj);
	}

	detectType(obj) {
		if (Array.isArray(obj)) return 'array';
		if (obj instanceof Map) return 'map';
		if (obj instanceof Set) return 'set';
		if (typeof obj === 'object') return 'object';
		return typeof obj;
	}
}

// Example: Lens that works with different collection types
const sizeLens = PolymorphicLens.create({
	array: Lens.of(
		arr => arr.length,
		(_, arr) => arr // Size is read-only for arrays
	),
	map: Lens.of(
		map => map.size,
		(_, map) => map // Size is read-only for maps
	),
	set: Lens.of(
		set => set.size,
		(_, set) => set // Size is read-only for sets
	),
	object: Lens.of(
		obj => Object.keys(obj).length,
		(_, obj) => obj // Size is read-only for objects
	)
});

// ============================================
// PRISM - PARTIAL LENSES
// ============================================

class Prism {
	constructor(preview, review) {
		this.preview = preview; // Get optional value
		this.review = review;   // Create from value
	}

	static of(preview, review) {
		return new Prism(preview, review);
	}

	getOption(obj) {
		try {
			const result = this.preview(obj);
			return result !== undefined
				? { hasValue: true, value: result }
				: { hasValue: false };
		} catch {
			return { hasValue: false };
		}
	}

	reverseGet(value) {
		return this.review(value);
	}

	modify(fn, obj) {
		const option = this.getOption(obj);
		if (option.hasValue) {
			return this.review(fn(option.value));
		}
		return obj;
	}

	composeLens(lens) {
		return Prism.of(
			obj => {
				const option = this.getOption(obj);
				return option.hasValue ? lens.get(option.value) : undefined;
			},
			value => this.review(value)
		);
	}

	composePrism(prism) {
		return Prism.of(
			obj => {
				const option1 = this.getOption(obj);
				if (option1.hasValue) {
					const option2 = prism.getOption(option1.value);
					return option2.hasValue ? option2.value : undefined;
				}
				return undefined;
			},
			value => this.review(prism.review(value))
		);
	}
}

// Common prisms
const Prisms = {
	// String to number
	stringToNumber: Prism.of(
		str => {
			const num = parseFloat(str);
			return isNaN(num) ? undefined : num;
		},
		num => String(num)
	),

	// JSON parsing
	jsonParse: Prism.of(
		str => {
			try {
				return JSON.parse(str);
			} catch {
				return undefined;
			}
		},
		obj => JSON.stringify(obj)
	),

	// Array head
	head: Prism.of(
		arr => arr.length > 0 ? arr[0] : undefined,
		value => [value]
	),

	// Object property (partial)
	prop: (key) => Prism.of(
		obj => obj && obj.hasOwnProperty(key) ? obj[key] : undefined,
		value => ({ [key]: value })
	),

	// Type guard prism
	guard: (predicate) => Prism.of(
		value => predicate(value) ? value : undefined,
		value => value
	)
};

// ============================================
// TRAVERSAL - LENS OVER MULTIPLE TARGETS
// ============================================

class Traversal {
	constructor(traverse) {
		this.traverse = traverse;
	}

	static of(traverse) {
		return new Traversal(traverse);
	}

	toList(obj) {
		const results = [];
		this.traverse((value) => {
			results.push(value);
			return value;
		}, obj);
		return results;
	}

	modify(fn, obj) {
		return this.traverse(fn, obj);
	}

	set(value, obj) {
		return this.traverse(() => value, obj);
	}

	compose(other) {
		return Traversal.of((fn, obj) =>
			this.traverse(
				(innerObj) => other.traverse(fn, innerObj),
				obj
			)
		);
	}
}

// Common traversals
const Traversals = {
	// Each element in array
	each: Traversal.of((fn, arr) => arr.map(fn)),

	// Each value in object
	values: Traversal.of((fn, obj) => {
		const result = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[key] = fn(obj[key]);
			}
		}
		return result;
	}),

	// Deep traversal
	deep: (predicate) => {
		const traverse = (fn, obj) => {
			if (predicate(obj)) {
				return fn(obj);
			}

			if (Array.isArray(obj)) {
				return obj.map(item => traverse(fn, item));
			}

			if (typeof obj === 'object' && obj !== null) {
				const result = {};
				for (const key in obj) {
					if (obj.hasOwnProperty(key)) {
						result[key] = traverse(fn, obj[key]);
					}
				}
				return result;
			}

			return obj;
		};

		return Traversal.of(traverse);
	},

	// Filtered traversal
	filtered: (predicate) => Traversal.of((fn, arr) =>
		arr.map(item => predicate(item) ? fn(item) : item)
	)
};

// ============================================
// REAL-WORLD: REDUX-LIKE STORE WITH LENSES
// ============================================

class LensStore {
	constructor(initialState, rootLens = Lens.of(x => x, (v, x) => v)) {
		this.rootLens = rootLens;
		this.state = initialState;
		this.subscriptions = new Map();
		this.middleware = [];
	}

	// Create a focused store on a specific lens
	focus(lens) {
		return new LensStore(
			lens.get(this.state),
			this.rootLens.compose(lens)
		);
	}

	// Subscribe to changes
	subscribe(lens, callback) {
		if (!this.subscriptions.has(lens)) {
			this.subscriptions.set(lens, new Set());
		}
		this.subscriptions.get(lens).add(callback);

		// Return unsubscribe function
		return () => {
			const callbacks = this.subscriptions.get(lens);
			if (callbacks) {
				callbacks.delete(callback);
			}
		};
	}

	// Dispatch an update
	dispatch(lens, updater) {
		const oldValue = lens.get(this.state);
		const newState = lens.over(updater, this.state);

		if (newState !== this.state) {
			// Apply middleware
			const change = {
				lens,
				oldValue,
				newValue: lens.get(newState),
				oldState: this.state,
				newState
			};

			const finalState = this.middleware.reduce(
				(state, mw) => mw(change, state),
				newState
			);

			this.state = finalState;

			// Notify subscribers
			this.notify(lens, lens.get(finalState));
		}
	}

	notify(lens, value) {
		const callbacks = this.subscriptions.get(lens);
		if (callbacks) {
			callbacks.forEach(cb => cb(value));
		}
	}

	// Add middleware
	use(middleware) {
		this.middleware.push(middleware);
		return this;
	}

	// Get current value through lens
	view(lens) {
		return lens.get(this.state);
	}

	// Set value through lens
	set(lens, value) {
		this.dispatch(lens, () => value);
	}

	// Update value through lens
	over(lens, fn) {
		this.dispatch(lens, fn);
	}
}

// Example: Todo app with lenses
const todoStore = new LensStore({
	todos: [],
	filter: 'all',
	ui: {
		inputValue: '',
		loading: false
	}
});

// Define lenses
const todosLens = LensFactory.prop('todos');
const filterLens = LensFactory.prop('filter');
const inputLens = LensFactory.path('ui', 'inputValue');
const loadingLens = LensFactory.path('ui', 'loading');

// Specific todo lens
const todoByIdLens = (id) =>
	todosLens.compose(
		LensFactory.find(todo => todo.id === id)
	);

// Add middleware for logging
todoStore.use((change, state) => {
	console.log('State change:', {
		path: change.lens,
		old: change.oldValue,
		new: change.newValue
	});
	return state;
});

// Subscribe to changes
todoStore.subscribe(todosLens, (todos) => {
	console.log('Todos updated:', todos);
});

// Dispatch updates
todoStore.over(todosLens, todos => [
	...todos,
	{ id: Date.now(), text: 'New todo', completed: false }
]);
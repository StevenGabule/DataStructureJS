// ============================================
// ADVANCED LENS SYSTEM
// ============================================

class Lens {
	constructor(getter, setter) {
		this.getter = getter;
		this.setter = setter;
	}

	static of(getter, setter) {
		return new Lens(getter, setter);
	}

	get(obj) {
		return this.getter(obj);
	}

	set(value, obj) {
		return this.setter(value, obj);
	}

	over(fn, obj) {
		return this.set(fn(this.get(obj)), obj);
	}

	compose(...lenses) {
		return lenses.reduce((acc, lens) =>
			Lens.of(
				obj => lens.get(acc.get(obj)),
				(value, obj) => acc.set(
					lens.set(value, acc.get(obj)),
					obj
				)
			),
			this
		);
	}

	// Traverse with a function
	traverse(fn) {
		return Lens.of(
			obj => fn(this.get(obj)),
			(value, obj) => this.set(value, obj)
		);
	}

	// Conditional lens
	when(predicate) {
		return Lens.of(
			obj => predicate(obj) ? this.get(obj) : undefined,
			(value, obj) => predicate(obj) ? this.set(value, obj) : obj
		);
	}

	// Optional lens (for Maybe values)
	optional() {
		return Lens.of(
			obj => {
				try {
					return { hasValue: true, value: this.get(obj) };
				} catch {
					return { hasValue: false };
				}
			},
			(maybeValue, obj) => {
				if (maybeValue.hasValue) {
					return this.set(maybeValue.value, obj);
				}
				return obj;
			}
		);
	}
}

// Lens factory functions
const LensFactory = {
	// Property lens
	prop: (key) => Lens.of(
		obj => obj[key],
		(value, obj) => ({ ...obj, [key]: value })
	),

	// Path lens (nested properties)
	path: (...keys) => {
		return keys.reduce(
			(acc, key) => acc.compose(LensFactory.prop(key)),
			Lens.of(x => x, (v, x) => v)
		);
	},

	// Index lens for arrays
	index: (i) => Lens.of(
		arr => arr[i],
		(value, arr) => {
			const copy = [...arr];
			copy[i] = value;
			return copy;
		}
	),

	// Find lens (first matching element)
	find: (predicate) => Lens.of(
		arr => arr.find(predicate),
		(value, arr) => {
			const index = arr.findIndex(predicate);
			if (index === -1) return arr;

			const copy = [...arr];
			copy[index] = value;
			return copy;
		}
	),

	// Filter lens
	filter: (predicate) => Lens.of(
		arr => arr.filter(predicate),
		(values, arr) => {
			const indices = [];
			arr.forEach((item, i) => {
				if (predicate(item)) indices.push(i);
			});

			const copy = [...arr];
			indices.forEach((index, i) => {
				if (i < values.length) {
					copy[index] = values[i];
				}
			});
			return copy;
		}
	),

	// Map lens (transform all elements)
	mapped: (lens) => Lens.of(
		arr => arr.map(item => lens.get(item)),
		(values, arr) => arr.map((item, i) =>
			i < values.length ? lens.set(values[i], item) : item
		)
	),

	// ISO lens (isomorphism - reversible transformation)
	iso: (to, from) => Lens.of(to, (value, _) => from(value))
};

// ============================================
// REAL-WORLD: STATE MANAGEMENT WITH LENSES
// ============================================

class StateManager {
	constructor(initialState) {
		this.state = initialState;
		this.subscribers = new Set();
		this.lenses = new Map();
	}

	// Register a lens for a specific part of state
	registerLens(name, lens) {
		this.lenses.set(name, lens);
		return this;
	}

	// Get value using lens
	view(lensName) {
		const lens = this.lenses.get(lensName);
		if (!lens) throw new Error(`Lens ${lensName} not found`);
		return lens.get(this.state);
	}

	// Set value using lens
	set(lensName, value) {
		const lens = this.lenses.get(lensName);
		if (!lens) throw new Error(`Lens ${lensName} not found`);

		const newState = lens.set(value, this.state);
		this.updateState(newState);
	}

	// Modify value using lens
	over(lensName, fn) {
		const lens = this.lenses.get(lensName);
		if (!lens) throw new Error(`Lens ${lensName} not found`);

		const newState = lens.over(fn, this.state);
		this.updateState(newState);
	}

	updateState(newState) {
		if (newState !== this.state) {
			this.state = newState;
			this.notify();
		}
	}

	subscribe(fn) {
		this.subscribers.add(fn);
		return () => this.subscribers.delete(fn);
	}

	notify() {
		this.subscribers.forEach(fn => fn(this.state));
	}
}

// Example: Complex application state
const appState = {
	user: {
		profile: {
			name: 'John Doe',
			email: 'john@example.com',
			settings: {
				theme: 'dark',
				notifications: {
					email: true,
					push: false
				}
			}
		},
		posts: [
			{ id: 1, title: 'First Post', likes: 10, comments: [] },
			{ id: 2, title: 'Second Post', likes: 20, comments: [] }
		]
	},
	ui: {
		modals: {
			login: false,
			settings: false
		},
		loading: false
	}
};

// Create state manager with lenses
const stateManager = new StateManager(appState);

// Register lenses for different parts of state
stateManager
	.registerLens('userName',
		LensFactory.path('user', 'profile', 'name'))
	.registerLens('emailNotifications',
		LensFactory.path('user', 'profile', 'settings', 'notifications', 'email'))
	.registerLens('firstPost',
		LensFactory.path('user', 'posts').compose(LensFactory.index(0)))
	.registerLens('postLikes',
		LensFactory.path('user', 'posts')
			.compose(LensFactory.mapped(LensFactory.prop('likes'))))
	.registerLens('highLikedPosts',
		LensFactory.path('user', 'posts')
			.compose(LensFactory.filter(post => post.likes > 15)))
	.registerLens('loginModal',
		LensFactory.path('ui', 'modals', 'login'));

// Use lenses to interact with state
console.log(stateManager.view('userName')); // 'John Doe'
stateManager.set('userName', 'Jane Smith');
stateManager.over('postLikes', likes => likes.map(l => l * 2));

// ============================================
// FORM HANDLING WITH LENSES
// ============================================

class FormHandler {
	constructor(initialValues = {}) {
		this.values = initialValues;
		this.errors = {};
		this.touched = {};
		this.lenses = new Map();
	}

	// Create lenses for form fields
	field(name) {
		if (!this.lenses.has(name)) {
			const path = name.split('.');
			this.lenses.set(name, {
				value: LensFactory.path(...path),
				error: LensFactory.path(...path).compose(
					Lens.of(
						() => this.errors[name],
						(value) => ({ ...this.errors, [name]: value })
					)
				),
				touched: LensFactory.path(...path).compose(
					Lens.of(
						() => this.touched[name],
						(value) => ({ ...this.touched, [name]: value })
					)
				)
			});
		}

		return {
			get: () => this.lenses.get(name).value.get(this.values),
			set: (value) => {
				this.values = this.lenses.get(name).value.set(value, this.values);
				this.touched[name] = true;
				this.validate(name, value);
			},
			error: () => this.errors[name],
			touched: () => this.touched[name],
			reset: () => {
				delete this.errors[name];
				delete this.touched[name];
			}
		};
	}

	validate(name, value) {
		// Example validation
		if (!value) {
			this.errors[name] = 'Required';
		} else if (name.includes('email') && !value.includes('@')) {
			this.errors[name] = 'Invalid email';
		} else {
			delete this.errors[name];
		}
	}

	getValues() {
		return this.values;
	}

	isValid() {
		return Object.keys(this.errors).length === 0;
	}
}

// Usage
const form = new FormHandler({
	user: {
		name: '',
		email: '',
		address: {
			street: '',
			city: '',
			country: ''
		}
	}
});

form.field('user.name').set('John Doe');
form.field('user.email').set('john@example.com');
form.field('user.address.city').set('New York');

console.log(form.getValues());
console.log(form.isValid());
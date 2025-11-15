// 4.2 Lenses - Immutable Nested Updates
// Lenses provide a functional way to access and update nested immutable data structures.
class Lens {
	constructor(getter, setter) {
		this.getter = getter;
		this.setter = setter;
	}

	static of(getter, setter) {
		return new Lens(getter, setter);
	}

	get(obj) {
		return this.getter(obj)
	}

	set(value, obj) {
		return this.setter(value, obj)
	}

	modify(fn, obj) {
		return this.set(fn(this.get(obj)), obj);
	}

	compose(otherLens) {
		return Lens.of(
			obj => otherLens.get(this.get(obj)),
			(value, obj) => this.modify(innerObj => otherLens.set(value, innerObj), obj)
		);
	}
}

// Helper to create property lenses
const lensProp = (prop) => Lens.of(
	obj => obj[prop],
	(value, obj) => ({ ...obj, [prop]: value })
);

// Helper to create index lenses for arrays
const lensIndex = (index) => Lens.of(
	arr => arr[index],
	(value, arr) => [
		...arr.slice(0, index),
		value,
		...arr.slice(index + 1)
	]
);

// Complex needed structure example
const state = {
	users: [
		{ id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
		{ id: 2, profile: { name: 'Mark', settings: { theme: 'light' } } },
	],
	ui: {
		modal: { visible: false }
	}
}

// create lenses for deep access
const userLens = lensProp('users');
const firstUserLens = userLens.compose(lensIndex(0))
const profileLens = lensProp('profile')
const settingsLens = lensProp('settings');
const themeLens = lensProp('theme')

// compose lenses for deep nested access
const firstUserThemeLens = firstUserLens
	.compose(profileLens)
	.compose(settingsLens)
	.compose(themeLens);

// use the lens
console.log(firstUserThemeLens.get(state)); // dark

const newState = firstUserThemeLens.set('light', state);
console.log(newState.users[0].profile.settings.theme); // light
console.log(state.users[0].profile.settings.theme); // dark (unchanged)

// Why lenses design:
// 1. Composability: Build complex accessors from simple ones
// 2. Immutability: Updates create new objects, preserving original
// 3. Reusability: Same lens works for get, set, and modify
// 4. Type safety: Can be typed to ensure correct access patterns

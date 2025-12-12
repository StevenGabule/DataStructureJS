// * 1.2 Immutability
// * Immutability prevents data from being modified after creation, 
// * eliminating a whole class of bugs.

// * Advanced immutability patterns with structural sharing
class ImmutableList {
	constructor(items = []) {
		this._items = Object.freeze([...items]);
	}

	// Instead of modifying, create new instance
	append(item) {
		return new ImmutableList([...this._items, item]);
	}

	update(index, value) {
		if (index < 0 || index >= this._items.length) {
			throw new Error('Index out of bounds')
		}

		// Create new array with updated value
		const newItems = [
			...this._items.slice(0, index),
			value,
			...this._items.slice(index + 1)
		];

		return new ImmutableList(newItems)
	}

	// Lazy evaluation with generators for performance
	*map(fn) {
		for (const item of this._items) {
			yield fn(item)
		}
	}

	toArray() {
		return [...this._items];
	}
}

// Usage demonstrating persistence
const list1 = new ImmutableList([1, 2, 3]);
const list2 = list1.append(4);
const list3 = list2.update(1, 20);

console.log(list1.toArray()); //  [1,2,3] - unchanged
console.log(list2.toArray()); // [1,2,3,4]
console.log(list3.toArray()); // [1,20,3,4]

const doubled = list1.map(x => x * 2);
console.log("doubled", [...doubled]);

for (const value of list1.map(x => x * 2)) {
	console.log("value: ", value);
}


// Why this design:
// 1. Time-travel debugging: Can keep history of all states
// 2. Concurrent access: No locks needed, data never changes
// 3. Predictable state transitions: Easy to reason about
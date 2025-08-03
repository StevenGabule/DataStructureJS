class PGroup {
	members;
	constructor(members) {
		this.members = members;
	}

	/**
		* Adds a value to the group.
		* @param {*} value - The value to add.
		* @returns {PGroup} A new PGroup instance with the value added,
		* or the original instance if the value was already present.
		*/
	add(value) {
		if (this.has(value)) return this;

		// Create a new PGroup with a new array of members.
		// this.members.concat([value]) creates a new array.
		return new PGroup(this.members.concat([value]))
	}

	/**
	 * Removes a value from the group.
	 * @param {*} value - The value to remove.
	 * @returns {PGroup} A new PGroup instance without the specified value,
	 * or the original instance if the value was not found.
	 */
	delete(value) {
		// if the group doesn't have the value, no change is needed.
		if (!this.has(value)) return this;

		// Create a new PGroup with a new, filtered array of members.
		// this.members.filter(...) creates a new array.
		return new PGroup(this.members.filter(m => m !== value));
	}

	/**
 * Checks if a value is in the group.
 * @param {*} value - The value to check for.
 * @returns {boolean} True if the value exists, otherwise false.
 */
	has(value) {
		return this.members.includes(value);
	}
}

// The "empty" instance is a shared, immutable starting point.
// It's a PGroup that contains an empty array of members.
PGroup.empty = new PGroup([]);

let a = PGroup.empty.add('a');
console.log("Initial 'a' group members:", a.members);
// -> Initial 'a' group members: [ 'a' ]

let ab = a.add('b');
console.log("'ab' group members: ", ab.members);

let b = ab.delete('a')
console.log("'b' group members: ", b.members);

// Check if the original group 'a' was mutated (it wasn't)
console.log("\n--- Verifying Immutability ---");
console.log("Does 'a' have 'b'?", a.has("b")); // → false
console.log("Original 'a' group members are still:", a.members); // → ["a"]

// Check if the final group 'b' has the correct members
console.log("Does 'b' have 'a'?", b.has("a")); // → false
console.log("Does 'b' have 'b'?", b.has("b")); // → true


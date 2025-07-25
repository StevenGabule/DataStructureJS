// const colors = ['r', 'y', 'b'];
// colors[5] = 'g';
// const iterator = colors.keys();
// for (const key of iterator) {
// 	console.log({key, val: colors[key]})
// }

// const arr = [4, 0, 6, 87];
// arr.copyWithin(0, 1, 2);
// console.log(arr)

// *** generic array methods
// const arrayLike = {
// 	0: "a",
// 	1: "b",
// 	2: "c",
// 	length: 3
// }
// console.log(Array.prototype.join.call(arrayLike, '+'));

// *** Array like objects
// function f() {
// 	console.log(Array.prototype.join.call(arguments, '+'))
// }

// f('a', 'b', 'c', 'd', 'e'); // a+b+c+d+e

// Flat
// const a1 = [0,1,2,[3,4]];
// console.log({a1: a1.flat()});

/**
 * @param {number[]} arr array that have sub array
 * @returns {number[]} return a single array
 */
function flatArrays(arr) {
	const arrInputs = [];
	const length = arr.length;
	for (let i = 0; i < length; i++) {
		if (Array.isArray(arr[i])) {
			for (let j = 0; j < arr[i].length; j++) {
				if (Array.isArray(arr[i][j])) {
					for (let x = 0; x < arr[i][j].length; x++) {
						if (Array.isArray(arr[i][j][x])) {
							for (let r = 0; r < arr[i][j][x].length; r++) {
								arrInputs.push(arr[i][j][x][r])
							}
						} else {
							arrInputs.push(arr[i][j][x])
						}
					}
				} else {
					arrInputs.push(arr[i][j])
				}
			}
		} else {
			arrInputs.push(arr[i])
		}
	}
	console.log(arrInputs)
}

const a2 = [0, 1, [2, [3, [4, 5]]]];
flatArrays(a2);


/**
 * Flattens a nested array using recursion.
 * @param {any[]} arr The potentially nested array to flatten.
 * @returns {any[]} A new completely flatten array.
 */
function flattenWithRecursion(arr) {
	let flattenedArray = []
	for (let i = 0; i < arr.length; i++) {
		const element = arr[i];
		if (Array.isArray(element)) {
			const nestedFlattened = flattenWithRecursion(element);
			for (let j = 0; j < nestedFlattened.length; j++) {
				flattenedArray.push(nestedFlattened[j]);
			}
		} else {
			flattenedArray.push(element);
		}
	}

	return flattenedArray;
}
console.log(flattenWithRecursion(a2));


/**
 * Flattens a nested array using on iterative approach with a stack.
 * This avoids deep recursion and potential stack overflow errors.
 * @param {any[]} arr The potentially nested array to flatten.
 * @returns {any[]} A new, completely flattened array.
 */
function flattenWithStack(arr) {
	const stack = [];
	for (let i = 0; i < arr.length; i++) {
		stack.push(arr[i])
	}

	const flattenedArray = [];

	while (stack.length > 0) {
		const currentItem = stack.pop();
		if (Array.isArray(currentItem)) {
			for (let i = currentItem.length - 1; i >= 0; i--) {
				stack.push(currentItem[i])
			}
		} else {
			flattenedArray.push(currentItem)
		}
	}

	const finalArray = [];
	for (let i = flattenedArray.length - 1; i >= 0; i--) {
		finalArray.push(flattenedArray[i])
	}

	return finalArray;
}

const nestedArray = [0, 1, [2, [3, [4, 5]]], 6, [7, 8]];
const flattened = flattenWithStack(nestedArray)
console.log(flattened);

// console.log({a2: a2.flat(2)});
// console.log({a2: a2.flat(Infinity)});
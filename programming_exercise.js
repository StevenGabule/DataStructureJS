/***
* Check to see if a string has the same amount of 'x's and 'o's. 
* The method must return a boolean
* and be case insensitive. The string can contain any char.
* Examples input/output:
* XO("ooxx") => true
* XO("xooxx") => false
* XO("ooxXm") => true
* XO("zpzpzpp") => true // when no 'x' and 'o' is present should return true
* XO("zzoo") => false
*/
const in1 = 'ooxx'; // must be true
const in2 = 'xooxx'; // must be false
const in3 = 'ooxXm'; // must be true
const in4 = 'zpzpzpp'; // must be true
const in5 = 'zzoo'; // must be f

function checkIfOXEqualSize(val) {
	let countX = 0;
	let countO = 0;
	const valString = val.toLowerCase();
	for (let i = 0; i < valString.length; i++) {
		if (valString[i].toLowerCase() === 'o') {
			countO++;
		}
		if (valString[i] === 'x') {
			countX++;
		}
	}

	return countX === countO;
}

// console.log(checkIfOXEqualSize(in1)) // t
// console.log(checkIfOXEqualSize(in2)) // f
// console.log(checkIfOXEqualSize(in3)) // t
// console.log(checkIfOXEqualSize(in4)) // t
// console.log(checkIfOXEqualSize(in5)) // f

/**
* Implement the function uniqueInOrder which takes as argument a sequence and returns a list of items
* without any elements with the same value next to each other and preserving the original order of elements
*
* For example:
* uniqueInOrder('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']
* uniqueInOrder('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']
* uniqueInOrder([1,2,2,3,3])       == [1,2,3]
**/

function uniqueInOrder(orderInput) {
	if (Array.isArray(orderInput)) {
		orderInput = orderInput.join('');
	}
	let prev = orderInput[0]; // get the front
	const uniqueSequence = [prev];
	for (let index = 1; index < orderInput.length; index++) {
		if (prev !== orderInput[index]) {
			uniqueSequence.push(orderInput[index])
		}
		prev = orderInput[index];
	}
	return uniqueSequence;
}

console.log(uniqueInOrder('AAAABBBCCDAABBB'))
console.log(uniqueInOrder('ABBCcAD'))
console.log(uniqueInOrder('AAAABBBCCDAABBB'))
console.log(uniqueInOrder([1, 2, 2, 3, 3]))
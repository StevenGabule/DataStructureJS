// function multiplyNumbers(n) {
// 	let total = 1;
// 	let head = n;

// 	for (let i = 1; i <= 4; i++) {
// 		total = total * head;
// 		--head;
// 	}

// 	return total;
// }


// console.log(multiplyNumbers(5)) // 120

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
// const in1 = 'ooxx'; // must be true
// const in2 = 'xooxx'; // must be false
// const in3 = 'ooxXm'; // must be true
// const in4 = 'zpzpzpp'; // must be true
// const in5 = 'zzoo'; // must be false

// function XO(word) {
// 	word = word.toLowerCase();

// 	if (word.indexOf('x') === -1 && word.indexOf('o') === -1) return true;

// 	if (word.length % 2 === 1) return false;

// 	return (/^[ox]/i).test(word);
// }

// console.log(XO(in1));
// console.log(XO(in2));
// console.log(XO(in3));
// console.log(XO(in4));
// console.log(XO(in5));

/**
* Implement the function uniqueInOrder which takes as argument a  sequence and returns 
* a list of items without any elements with the same value next to each other and 
* preserving the original order of elements
* For example:
* uniqueInOrder('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']
* uniqueInOrder('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']
* uniqueInOrder([1,2,2,3,3])       == [1,2,3]
*/

function uniqueInOrder(str) {
	let uniq = [str[0]];
	let prevLetter = str[0];
	let totalStr = str.length;
	for (let i = 1; i < totalStr; i++) {
		if (prevLetter !== str[i]) {
			uniq.push(str[i])
			prevLetter = str[i];
		}
	}
	return uniq;
}

console.log(uniqueInOrder('AAAABBBCCDAABBB'))
console.log(uniqueInOrder('ABBCcAD'))
console.log(uniqueInOrder('AAAABBBCCDAABBB'))
console.log(uniqueInOrder([1, 2, 2, 3, 3]))
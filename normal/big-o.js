function fastPower(num, p) {
	return num ** p;
}

// console.log("fastPower: " + fastPower(5,2)); 


function iterativePower(num, p) {
	let result = 1;
	
	for(let i = 0; i < p; i += 1) {
		result *= num;
	}
	
	return result;
}

// console.log(iterativePower(5,2));


function factorial(num) {
	if(num === 0) {
		return 1;
	}
	
	return factorial(num - 1) * num;
}

// console.log(factorial(5)); // 120


/*
	input: 5
	process: 5 x 4 x 3 x 2 x 1 = 120
	output: 120	
*/
function bruteforceFactorial(num) {
	let total = 0;
	let origNum = num;
	
	for(let x = num; x > 1; x--) {
		total = origNum === num ? (origNum * (origNum - 1)) : total * (origNum - 1);
		origNum = origNum - 1;
	}
		
	return total;
}

// console.log(bruteforceFactorial(5)); // 120

// Better solutions - iterative factorial
function newFactorial(num) {
	if(num < 0) return undefined;
	if(num === 0) return 1;
	
	let result = 1;
	for(let i = 2; i <= num; i++) {
		result *=i;
	}
	
	return result;
}
// console.log(newFactorial(5)); // 120

function factorial(num) {
	if(num < 0) return undefined;
	if(num === 0 || num === 1) return 1;
	return num * factorial(num - 1);
}
// console.log(factorial(5)); // 120



// O(n²) example
// Let’s write a function that generates all 
// possible pairs out of provided letters
/**
* Get all possible pairs out of provided letters.
*
* Example:
* letter = ['a', 'b']
* output = ['aa', 'ab', 'ba', 'bb']
*
* @param {string[]} letters
* @return {string[]}
*/
function pairs(letters) {
		const result = [];
		for(let i = 0; i < letters.length; i += 1) {
			for(let j = 0; j < letters.length; j += 1) {
				result.push(`${letters[i]}${letters[j]}`)
			}
		}
		return result;
}

// console.log(pairs(['a', 'b']));


function multipleArrayInPlace(arr, multiplier) {
	for(let i = 0; i < arr.length; i += 1) {
		arr[i] *= multiplier;
	}
	
	return arr;
}

// console.log(multipleArrayInPlace([1,2,3], 2)); // [ 2, 4, 6 ]


function multipleArray(arr, multiplier) {
	const multipliedArray = [...arr];
	for(let i = 0; i < multipliedArray.length; i += 1) {
		multipliedArray[i] *= multiplier;
	}
	
	return multipliedArray;
}

console.log(multipleArray([1,2,3], 2)); // [ 2, 4, 6 ]












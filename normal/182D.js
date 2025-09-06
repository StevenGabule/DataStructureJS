// Result: 2
// const a = 'abcdabcd';
// const b = 'abcdabcdabcdabcd';

// Result: 1
function commonDivisors(a, b) {
	const A = a.length;
	const B = b.length;
	const S = Math.min(A, B);
	let r = 0;

	// start from 1, not 0 (can't have a divisor of length 0)
	for (let i = 1; i <= S; ++i) {
		// check if i divisors both string lengths
		if (A % i !== 0 || B % i !== 0) continue;

		let w = true;

		// check if the first characters of both strings match
		for (let j = 0; j < i; ++j) {
			if (a[j] !== b[j]) {
				w = false;
				break;
			}
		}
		if (!w) continue;

		// check if string a is periodic with a period i
		for (let j = 0; j < A; ++j) {
			if (a[j] !== a[j % i]) {
				w = false;
				break;
			}
		}
		if (!w) continue;

		// check if string b is periodic with a period i
		for (let j = 0; j < B; ++j) {
			if (b[j] !== b[j % i]) {
				w = false;
				break;
			}
		}
		if (!w) continue;

		++r;
	}

	return r;
}

// Test cases
console.log("Test 1:");
let a = 'abcdabcd';
let b = 'abcdabcdabcdabcd';
console.log(`commonDivisors("${a}", "${b}") = ${commonDivisors(a, b)}`); // Expected: 2

console.log("\nTest 2:");
a = 'aaa';
b = 'aa';
console.log(`commonDivisors("${a}", "${b}") = ${commonDivisors(a, b)}`); // Expected: 1

console.log("\nTest 3:");
a = 'aaae';
b = 'aa';
console.log(`commonDivisors("${a}", "${b}") = ${commonDivisors(a, b)}`); // Expected: 0

console.log("\nTest 4:");
a = 'ababab';
b = 'abab';
console.log(`commonDivisors("${a}", "${b}") = ${commonDivisors(a, b)}`); // Expected: 1

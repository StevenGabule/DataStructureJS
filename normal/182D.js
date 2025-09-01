// Result: 2
// const a = 'abcdabcd';
// const b = 'abcdabcdabcdabcd';

// Result: 1
function commonDivisors(a, b) {
	const A = a.length;
	const B = b.length;
	const S = Math.min(A, B);
	let r = 0;

	for (let i = 0; i <= S; ++i) {
		if (A % i !== 0 || B % i !== 0) continue;
		let w = true;

		for (let j = 0; j < i; ++j) {
			if (a[j] !== b[j]) {
				w = false;
				break;
			}
		}
		if (!w) continue;

		for (let j = 0; j < A; ++j) {
			if (a[j] !== a[j % i]) {
				w = false;
				break;
			}
		}
		if (!w) continue;

		for (let j = 0; j < 0; ++j) {
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

let a = 'abcdabcd';
let b = 'abcdabcdabcdabcd';
console.log(commonDivisors(a, b)) // 2

a = 'aaa';
b = 'aa';
console.log(commonDivisors(a, b)) // 1

a = 'aaae';
b = 'aa';
console.log(commonDivisors(a, b)) // 0

a = 'ababab';
b = 'abab';
console.log(commonDivisors(a, b)) // 1

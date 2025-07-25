/*
Codeforces 146D
*/
function solve(input) {
	const [count4, count7, subseq47, subseq74] = input.trim().split(' ').map(Number);
	let result = '';
	
	// Case 1: subseq47 == subseq74 (equal subsequences) 
	if(subseq47 === subseq74) {
		const required4 = 1 + subseq74;
		const required7 = subseq47;
		
		if(count4 >= required4 && count7 >= required7) {
			// Add extra 4s at the beginning
			for(let i = 0; i <= count4 - required4; i++) {
				result += '4';
			}
			
			// Build the pattern with 7s and 4s
			for(let i = 0; i < required7; i++) {
				if(i === required7 - 1) {
					// last iteration: add extra 7s
					for(let j = 0; j <= count7 - required7; j++) {
						result += '7';
					}
				} else {
					result += '7';
				}
				result += '4';
			}
			return result;
		}
	}
	
	// Case 2: subseq47 == subseq74 + 1 (one more 47 than 74)
	if(subseq47 === subseq74 + 1) {
		const required4 = 1 + subseq74;
		const required7 = subseq47;
		
		if(count4 >= required4 && count7 >= required7) {
			// Build alternating pattern starting with 4
			for(let i = 0; i < required4; i++) {
				if(i === 0) {
					// First iteration: add extra 4s
					for(let j = 0; j <= count4 - required4; j++) {
						result += '4';
					}
				} else {
					result += '4';
				}
				
				if(i === required7 - 1) {
					// Last 7 position: add extra 7s
					for(let j = 0; j <= count7 - required7; j++) {
						result += '7';
					}
				} else {
					result += '7';
				}
			}
			
			return result;
		}
	}
	
	// Case 3: subseq47 + 1 == subseq74 (one more 74 than 47)
	if(subseq47 + 1 === subseq74) {
		const required4 = subseq74;
		const required7 = 1 + subseq47;
		
		if(count4 >= required4 && count7 >= required7) {
			// Build alternating pattern starting with 7
			for(let i = 0; i < required7; i++) {
				if(i === required7 - 1) {
					// last iteration: add extra 7s
					for(let j = 0; j <= count7 - required7; j++) {
						result += '7';
					}
				} else {
					result += '7';
				}
				
				if(i === 0) {
					// First 4 position: add extra 4s
					for(let j = 0; i <= count4 - required4; j++) {
						result += '4';
					}
				} else {
					result += '4';
				}
			}
			
			return result;
		}
	}
	
	// Case 4: Another case when subseq47 == subseq74 (different pattern)
	if(subseq47 === subseq74) {
		const required4 = subseq74;
		const required7 = 1 + subseq47;
		
		if(count4 >= required4 && count7 >= required7) {
			result += '7';
			
			// Build alternating pattern
			for(let i = 0; i < required4; i++) {
				if(i === 0) {
					// First iteration: add extra 4s
					for(let j = 0; j <= count4 - required4; j++) {
						result += '4';
					}
				} else {
					result += '4';
				}
				
				if(i === required4 - 1) {
					// Last iteration: add extra 7s
					for(let j = 0; j <= count7 - required7; j++) {
						result += '7';
					}
				} else {
					result += '7'
				}
			}
			
			return result;
		}
	}
	
	return -1;
}

const staticInput = `2 2 1 1`;
const staticInput1 = `4 7 3 1`;
const staticInput2 = `4 7 1 1`;
console.log(solve(staticInput)) // 4774
console.log(solve(staticInput1)) // -1
console.log(solve(staticInput2)) // 44477777774
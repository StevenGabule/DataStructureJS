/*
Codeforces 146D - Optimized Solution
*/
function solve(input) {
	const [count4, count7, subseq47, subseq74] = input.trim().split(' ').map(Number);
	
	// Early Validation: check if solution is mathematically possible
	const diff = Math.abs(subseq47 - subseq74);
	if(diff > 1) {
		return '-1';
	}
	
	let pattern = '';
	let required4, required7;
	
	if(subseq47 === subseq74) {
		// Two possible patterns for equal subsequences
		// Patter 1: 4 * (7 * 4)
		required4 = subseq47 + 1;
		required7 = subseq74;
		
		if(count4 >= required4 && count7 >= required7) {
			pattern = buildPattern1(count4, count7, required4, required7);
		} else {
			// Patter 2: 7*(4*7)* -> alternative for equal counts.
			required4 = subseq47;
			required7 = subseq74 + 1;
			
			if(count4 >= required4 && count7 >= required7) {
				pattern = buildPattern2(count4, count7, required4, required7);
			}
		}
	} else if(subseq47 === subseq74 + 1) {
		// Pattern: (4*7)*4* -> one more 47 than 74
		required4 = subseq47 + 1;
		required7 = subseq74;
		
		if(count4 >= required4 && count7 >= required7) {
			pattern = buildPattern3(count4, count7, required4, required7);
		}
	} else if(subseq74 === subseq47 + 1) {
		// Pattern: (7*4)*7* -> one more 74 than 47
		required4 = subseq47;
		required7 = subseq74 + 1;
		
		if(count4 >= required4 && count7 >= required7) {
			pattern = buildPattern4(count4, count7, required4, required7);
		}
	}
	
	return pattern || '-1';
}

// Pattern 1: 4*(47)*7* -> equal 47 and 74 counts
function buildPattern1(count4, count7, required4, required7) {
	let result = '';
	
	// Add all 4s first
	result += '4'.repeat(count4);
	
	// add alternating 74 pairs
	for(let i = 0; i < required7; i++) {
		result += '7';
		if(i < required4 - 1) {
			result += '4';
		}
	}
	
	result += '7'.repeat(count7 - required7);
	
	return result;
}

// Pattern 2: 7*(47)*4* -> equal 47 and 74 counts (alternative)
function buildPattern2(count4, count7, required4, required7) {
	let result = '';
	
	// Add initial 7
	result += '7';
	
	// Add alternative 47 pairs
	for(let i = 0; i < required4; i++) {
		result += '4';
		if(i < required7 - 1) {
			result += '7';
		}
	}
	
	// Add remaining 4s and 7s
	result += '4'.repeat(count4 - required4);
	result += '7'.repeat(count7 - required7);
	
	return result;
}

// Patter 3: (47)*4* -> one more 47 than 74
function buildPattern3(count4, count7, required4, required7) {
	let result = '';
	
	// Add extra 4s at the beginning
	result += '4'.repeat(count4 - required4);
	
	// add alternating 47 pairs
	for(let i = 0; i < required7; i++) {
		result += '4' + '7';
	}
	
	// add final 4
	result += '4';
	
	// add remaning 7s
	result += '7'.repeat(count7 - required7);
	
	return result;
}

// Pattern 4: (74)*7* -> one more 74 than 47
function buildPattern4(count4, count7,required4,required7) {
	let result = '';
	
	// add extra 7s at the beginning
	result += '7'.repeat(count7 - required7);
	
	// Add alternating 74 pairs
	for(let i = 0; i < required4; i++) {
		result += '7' + '4';
	}
	
	// Add final 7
	result += '7';
	
	// add remaining 4s
	result += '4'.repeat(count4 - required4);
	
	return result;
}

const staticInput = `2 2 1 1`;
const staticInput1 = `4 7 3 1`;
const staticInput2 = `4 7 1 1`;
console.log(solve(staticInput))  // 4774
console.log(solve(staticInput1)) // -1
console.log(solve(staticInput2)) // 44477777774









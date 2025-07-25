function solve(input) {
	const lines = input.trim().split('\n');
	const [stringLength, maxOperations] = lines[0].split(' ').map(Number);
	let numberString = lines[1];
	
	let currentPosition = 0;
	let operationsUsed = 0;
	let wasStuckBefore = false;
	let foundCycle = false;
	
	// Covert string to array for easier manipulation
	let digits = numberString.split('');
	
	// Perform Operations to fix '47' patterns
	for(; operationsUsed < maxOperations; operationsUsed++) {
		const previousPosition = currentPosition;
		
		// Find next '47' pattern
		while(currentPosition < stringLength - 1 &&
			!(digits[currentPosition] === '4' && digits[currentPosition + 1] === '7')
		) {
			currentPosition++;
		}
		
		// If we reached the end without finding '47', we're done
		if(currentPosition === stringLength - 1) {
			break;
		}
		
		// check for cycle (stuck at same position and was stuck before)
		if(currentPosition === previousPosition && wasStuckBefore) {
			foundCycle = true;
			break;
		}
		
		// Fix the '47' pattern based on position
		if((currentPosition + 1) % 2 === 1) {
			// odd position: change both to '4'
			digits[currentPosition] = '4';
			digits[currentPosition + 1] = '4';
			wasStuckBefore = false;
		} else {
			// Even position: change both '7'
			digits[currentPosition] = '7';
			digits[currentPosition + 1] = '7';
			
			// Move back one position if possible
			if(currentPosition > 0) {
				currentPosition--;
			}
			wasStuckBefore = true;
		}
	}
	
	if(foundCycle) {
		const remainingOperations = maxOperations - operationsUsed;
		
		// Set up the pattern for alternating
		digits[currentPosition] = '4';
		digits[currentPosition + 2] = '7'
		
		// Alternate middle digit based on remaining operations
		digits[currentPosition + 1] = (remainingOperations % 2 === 1) ? '4' : '7'
	}
	
	return digits.join('');
}
const staticInput0 = `7 4
4727447`;

const staticInput1 = `4 2
4478`;

const staticInput = `6 2
474747`;

console.log(solve(staticInput0)); // 4427477 
console.log(solve(staticInput1)); // 4478
console.log(solve(staticInput0)); // 4427477


// Note
// In the first sample the number changes in the following sequence: 4727447 → 4427447 → 4427477 → 4427447 → 4427477.
// In the second sample: 4478 → 4778 → 4478.
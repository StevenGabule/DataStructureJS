// * Codeforces 151C

/* 
 * Finds the smallest prime factor of a given number.
 * The original C++ function was named 'div'
 * 
 * @param {number} number - The number to analyze. Must be an integer greater than 1.
 * @returns {number} The smallest prime factor, or -1 if the number is prime.
 */
 function findSmallestPrimeFactor(number) {
	// we only need to check for divisors up to the square root of the number
	const limit = Math.floor(Math.sqrt(number));
	
	// Iterate from 2 up to the calculated limit
	for(let i = 2; i <= limit; i++) {
		// if 'i' divides the number evenly, it's the smallest prime factor.
		if(number % i === 0) {
			return i;
		}
	}
	
	// If no factors are found, the number is prime.
	return -1;
 }         
 
 /**
  * Analyze  the game based on the input number and determine the outcome
  *
  * @param {number} startingNumber - The initial number of the game.
  */
  function analyzeGame(startingNumber) {
	// A copy of the starting number that will be modified.
	let remainingNumber = startingNumber;
	
	// An array to store the prime factors
	const primeFactors = [];
	
	while(true) {
		const factor = findSmallestPrimeFactor(remainingNumber);
		
		// If no smaller factor is found, it means the remaning number is prime.
		// we break the loop to add it as the last factor.
		if(factor === -1) {
			break;
		}
		
		// Divide the number by the found factor.
		remainingNumber /= factor;
		
		// add the factor to our list.
		primeFactors.push(factor);
	}
	
	// Add the final remaining number, which is the last prime factor.
	primeFactors.push(remainingNumber);
	
	// --- Determine the game's outcome based on the number of prime factors ---
	
	// Case 1: The number has 0 or 1 prime factors (i.e., it's the nubmer 1 or a prime).
	// The first player has no strategic move and will lose. The problem asks to output
	// "1" (implying player 1 wins) and "0" as the move
	if(primeFactors.length <= 1) {
		console.log('1');
		console.log('0');
		return;
	}
	
	// Case 2: The number is a product of exactly two prime factors(e.g., 6 = 2*3)
	// Any move the first player makes will leave a prime number. The second player can
	// always win from the position.
	if(primeFactors.length === 2) {
		console.log('2');
		return;
	}	
	
	// Case 3: The number has more than two prime factors (e.g., 12 = 2*2*3)
	if(primeFactors.length > 2) {
		console.log('1');
		
		// The winning move is to leave the product of the two smallest prime factors.
		console.log(primeFactors[0] * primeFactors[1]);
		return;
	}
  }
  
analyzeGame(6) 
// 2

console.log("--------------------");
analyzeGame(30) 
// 1
// 6

console.log("--------------------");
analyzeGame(1) 
// 1
// 0
  
  
  
  
  
  
  
  
  
  
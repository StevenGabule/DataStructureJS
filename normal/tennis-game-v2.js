/**
 * Solves codeforces problem 496D - Tennis Game
 * @param {number[]} points - An array representing the winner of each point (1 or 2)
 * @returns {void} - this function prints the result directly to the console.
 */
 function solveCodeforcesTennis(points) {
	const n = points.length;
	const possibleTValues = [];
	
	// 1. The simulation loop for each possible 't' remains the same.
	for(let t = 1; t <= n; t++) {
		let player1SetScore = 0;
		let player2SetScore = 0;
		let player1MatchScore = 0;
		let player2MatchScore = 0;
		let winnerOfLastSet = 0;
		
		for(let i = 0; i < n; i++) {
			const winner = points[i];
			
			if(winner === 1) {
				player1SetScore++;
			} else {
				player2SetScore++;
			}
			
			// check if a set has been won
			if(player1SetScore === t) {
				player1MatchScore++;
				winnerOfLastSet = 1;
				player1SetScore = 0;
				player2SetScore = 0;
			} else if(player2SetScore === t) {
				player2MatchScore++;
				winnerOfLastSet = 2;
				player1SetScore = 0;
				player2SetScore = 0;
				
			}
		}
		
		// 2. The validation logic is the same.
		// A player must have more sets won at the end.
		if(player1MatchScore === player2MatchScore) {
			continue;
		}
		
		// The player who won the match must have won the last point.
		const matchWinner = player1MatchScore > player2MatchScore ? 1 : 2;
		
		if(matchWinner !== winnerOfLastSet) {
			continue;
		}
		
		// 3. The key change: only store 't', not 's'.
		possibleTValues.push(t);
	}
	
	// 4. Format the output as required by codeforces
	// Line 1: the count of solutions.
	console.log(possibleTValues.length);
	
	// Line 2: The sorted 't' values, joined by spaces.
	console.log(possibleTValues.sort((a,b) => a - b).join(' '));
 }


// Example 1: points  = [1,2,1,2,1], n = 5;
// Example 1: points = [1, 2, 1, 2, 1], n = 5
const points1 = [1, 2, 1, 2, 1];
console.log("Solution for [1, 2, 1, 2, 1]:");
solveCodeforcesTennis(points1);
// Expected Output:
// 2
// 1 3

console.log('----------------------------------------');

// Example 2: points = [1, 1, 2, 2, 1, 1], n = 6
const points2 = [1, 1, 2, 2, 1, 1];
console.log("Solution for [1, 1, 2, 2, 1, 1]:");
solveCodeforcesTennis(points2);
// Expected Output:
// 2
// 2 4
 
 
 
 
 
 
 
 
 
 
 
 
 
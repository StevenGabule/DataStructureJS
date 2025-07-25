/**
 * Solves the Tennis Game problem using a brute force approach.
 * @param {number[]} points - An Array representing the winner of each point (1 or 2)
 * @returns {Array<[number, number]>}
 */
 function solveTennisGame(points) {
	const n = points.length;
	const possibleSolutions = [];
	
	// 1. Iterate through all possible 't' values (points to win a set).
	// 't' can be from 1 to the total number of points.
	for(let t = 1; t <= n; t++) {
		let player1SetScore = 0;
		let player2SetScore = 0;
		let player1MatchScore = 0;
		let player2MatchScore = 0;
		let lastPointWinner = 0;
		
		// 2. Simulation the match for the current 't' value.
		for(let i = 0; i < n; i++) {
			const winner = points[i];
			lastPointWinner = winner;
			
			if(winner === 1) {
				player1SetScore++;
			} else {
				player2SetScore++;
			}
			
			// check if a set has been won
			if(player1SetScore === t) {
				player1MatchScore++;
				player1SetScore = 0;
				player2SetScore = 0;
			} else if(player2SetScore === t) {
				player2MatchScore++;
				player1SetScore = 0;
				player2SetScore = 0;
			}
		}
		
		// 3. Validate the outcome of the simulation.
		const matchWinnerScore = Math.max(player1MatchScore, player2MatchScore);
		const matchLoserScore = Math.min(player1MatchScore, player2MatchScore);
		
		// The match must have a clear winner.
		if(matchWinnerScore === matchLoserScore) {
			continue;
		}
		
		// The player who won the final set must be the player who won the very last point.
		const matchWinner = player1MatchScore > player2MatchScore ? 1 : 2;
		if(matchWinner !== lastPointWinner) {
			continue;
		}
		
		const s = matchWinnerScore;
		
		possibleSolutions.push([s, t]);
	}
	
	possibleSolutions.sort((a,b) => {
		if(a[0] !== b[0]) {
			return a[0] - b[0]; // Sort by 's' first
		} 
		return a[1] - b[1]; // then by 't'
	});
	
	return possibleSolutions;
 }
 
 
// Example: The sequence from the explanation
const points1 = [1,2,1,2,1];
console.log("Solutions for [1,2,1,2,1]:")
console.log(solveTennisGame(points1)); // Expected output: [[1, 3], [3, 1]]

console.log('----------------------------------------');

const points2 = [1,1,2,2,1,1];
console.log("Solutions for [1,1,2,2,1,1]:")
console.log(solveTennisGame(points2)); // Expected output: [[1, 4], [2, 2]]
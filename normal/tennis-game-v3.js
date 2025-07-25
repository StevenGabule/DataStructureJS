/*
 * Helper function to find the number of wins before a certain index.
 * This is effectively a binary search.
 * @param {number[]} wins_array - The sorted array of win indices.
 * @param {number} index  - The index to search before.
 * @returns {number}
 */
 function findWinsBefore(wins_array, index) {
	let low = 0, high = wins_array.length;
	let count = 0;
	while(low < high) {
		let mid = low + Math.floor((high - low) / 2);
		if(wins_array[mid] < index) {
			count = mid + 1;
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	
	return count;
 }

/*
 * Solves codeforces 496D with an efficient O(n log n) approach.
 * @param {number[]} points - An array representing the winner of each points (1 or 2)
 * @returns {void}
 */
 function solveCodeForcesTennisOptimized(points) {
	 const n = points.length;
	 
	 // 1. Pre-computation: Store the indices of each player's wins.
	 const p1_win_indices = [];
	 const p2_win_indices = [];
	 
	 for(let i = 0; i < n; i++) {
		 if(points[i] === 1)  {
			p1_win_indices.push(i);
		 } else {
			p2_win_indices.push(i);
		 }
	 }
	 
	 const possibleTValues = [];
	 
	 // 2. Main loop: check again possible 't' value.
	 for(let t = 1; t <= n; t++) {
		 let p1_sets = 0;
		 let p2_sets = 0;
		 let p1_wins_total = 0;
		 let p2_wins_total = 0;
		 let current_index = -1;
		 
		 // 3. Fast Simulation: Jump from set to set.
		 while(true) {
			// Find the index of the next potential win for each player
			const p1_target_win_num = p1_wins_total + t;
			const p2_target_win_num = p2_wins_total + t;
			
			let p1_next_win_idx = Infinity;
			if(p1_target_win_num <= p1_win_indices.length) {
				p1_next_win_idx = p1_win_indices[p1_target_win_num - 1];
			}
			
			let p2_next_win_idx = Infinity;
			if(p2_target_win_num <= p2_win_indices.length) {
				p2_next_win_idx = p2_win_indices[p2_target_win_num - 1];
			}
			
			if(p1_next_win_idx === Infinity && p2_next_win_idx === Infinity) {
				break;
			}
			
			// Determine who wins the current set
			if(p1_next_win_idx < p2_next_win_idx) {
				p1_sets++;
				current_index = p1_next_win_idx;
				p1_wins_total += t;
				
                // We need to find how many points player 2 scored up to this point
				p2_wins_total = findWinsBefore(p2_win_indices, current_index);
			} else {
				p2_sets++;
				current_index = p2_next_win_idx;
				p2_wins_total += t;
				p1_wins_total = findWinsBefore(p1_win_indices, current_index);
			}
		 }
		 
		 // 4. Validation: must be the last point and have a clear winner.
		 if(current_index === n - 1) {
			 if(p1_sets > p2_sets && points[n-1] === 1) {
				 possibleTValues.push(t);
			 } else if (p2_sets > p1_sets && points[n-1] === 2) {
				 possibleTValues.push(t)
			 }
		 } 
	 }
	 
	 console.log(possibleTValues.length);
	 console.log(possibleTValues.join(' '));
 }
 
 // --- Example Usage ---
const points1 = [1, 2, 1, 2, 1];
console.log("Solution for [1, 2, 1, 2, 1]:");
solveCodeForcesTennisOptimized(points1);
// Expected Output:
// 2
// 1 3


console.log('----------------------------------------');

const points2 = [1, 1, 2, 2, 1, 1];
console.log("Solution for [1, 1, 2, 2, 1, 1]:");
solveCodeForcesTennisOptimized(points2);
// Expected Output:
// 2
// 2 4

console.log('----------------------------------------');

const points3 = [1, 2, 1, 2, 1];
console.log("Solution for [1, 2, 1, 2, 1]: ");
solveCodeForcesTennisOptimized(points3);

console.log('----------------------------------------');

const points4 = [1, 1, 1, 1];
console.log("Solution for [1, 1, 1, 1]: ");
solveCodeForcesTennisOptimized(points4);

console.log('----------------------------------------');

const points5 = [1, 2, 1, 2];
console.log("Solution for [1, 2, 1, 2]: ");
solveCodeForcesTennisOptimized(points5);

console.log('----------------------------------------');

const points6 = [2, 1, 2, 1, 1, 1, 1, 1];
console.log("Solution for [2, 1, 2, 1, 1, 1, 1, 1] ");
solveCodeForcesTennisOptimized(points6);
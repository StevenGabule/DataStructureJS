/*
Codeforces 139D - History
Find number of events that are included in some other event
*/

function solve(input) {
	const lines = input.trim().split('\n');
	const numberOfEvents =  parseInt(lines[0]);
	
	const events = [];
	
	// read all events
	for(let i = 1; i <= numberOfEvents; i++) {
		const [startYear, endYear] = lines[i].split(' ').map(Number);
		events.push({start: startYear, end: endYear, index: i - 1});
	}
	
	let includedCount = 0;
	
	// Check each event agains all other events
	for(let i = 0; i < numberOfEvents; i++) {
		const currentEvent = events[i];
		let isIncluded = false;
		
		// Check if current event is included in any other event
		for(let j = 0; j < numberOfEvents; j++) {
			if(i === j) continue; // don't compare event with itself
			
			const otherEvent = events[j];
			
			// Event j includes event i if: aj < ai and bi < bj
			if(otherEvent.start < currentEvent.start && 
			  currentEvent.end < otherEvent.end
			) {
				isIncluded = true;
				break;
			}
		}
		
		if(isIncluded) {
			includedCount++;
		}
	}
	
	return includedCount;
}

const staticInput = `5
1 10
2 9
3 8
4 7
5 6`;

const staticInput1 = `5
1 100
2 50
51 99
52 98
10 60`;

const staticInput2 = `1
1 1000000000`;

console.log(solve(staticInput));   // 4
console.log(solve(staticInput1));  // 4
console.log(solve(staticInput2));  // 0
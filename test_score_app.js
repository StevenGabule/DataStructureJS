var total = 0;
var entryCount = 0;
var entry;

do {
	entry = prompt('Enter test score or enter 999 to end entries', 999);
	entry = parseInt(entry);
	if (entry >= 0 && entry <= 100) {
		total += entry;
		entryCount++;
	} else if(entry !== 999) {
		console.log('Enter must by a valid number from 0 through 100 Or enter 999 to end entries!')
	}
} while(entry != 999);
console.log(`Average score is: ${parseInt(total / entryCount)}`)


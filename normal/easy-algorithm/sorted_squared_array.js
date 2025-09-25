const numsOfArray = [-7, -5, -4, 3, 6, 8, 9];

function sortedSquaredArray(arr) {
	// const sortedNumbers = arr.map(a => a * a).sort((a, b) => a - b);
	// for(const val of sortedNumbers) {
	// 	console.log(val);
	// }
	
	const sortedNumbersSquare = Array(arr.length).fill(0);
	let smallerValueIdx = 0
	let largerValueIdx = arr.length - 1;
		
	for(let i = arr.length-1; i >= 0; i--) {
		const smallerValue = arr[smallerValueIdx];
		const largerValue = arr[largerValueIdx];
		if(Math.abs(smallerValue) > Math.abs(largerValue)) {
			sortedNumbersSquare[i] = smallerValue * smallerValue;
			smallerValueIdx += 1;
		} else {
			sortedNumbersSquare[i] = largerValue * largerValue;
			largerValueIdx -= 1;
		}
	}
	 console.log(sortedNumbersSquare)
}

sortedSquaredArray(numsOfArray);
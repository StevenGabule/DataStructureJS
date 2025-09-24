const arrayOfNumbers = [5, 1, 22, 6, -1, 8, 10];
const sequence = [1, 6, -1, 10];

function validateSubsequence(arr, seq) {
	let arrIdx = 0;
	let seqIdx = 0;
	
	while(arrIdx < arr.length && seqIdx < seq.length) {
		if(arr[arrIdx] === seq[seqIdx]) seqIdx++;
		arrIdx++;
	}
	
	return seqIdx === seq.length;
}

function validateSubsequence1(arr, seq) {
	let seqIdx = 0;
	for(const val of arr) {
		if(seqIdx === seq.length) return true;
		if(seq[seqIdx] === val) seqIdx += 1;
	}
	
	return seqIdx === seq.length;
}

console.log(validateSubsequence(arrayOfNumbers, sequence));
console.log(validateSubsequence1(arrayOfNumbers, sequence));

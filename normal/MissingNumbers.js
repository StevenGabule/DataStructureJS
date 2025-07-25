function missingNumbers(nums) {
	const n = nums.length;
	for(let i = 0; i <= n;i++) {
		let found = false;
		for(let num of nums) {
			if(num === i) {
				found = true;
				break;
			}
		}
		if(!found) {
			return i;
		}
	}
}

function newMissingNumbers(nums) {
	const actualSum = nums.reduce((sum,num) => sum + num, 0);
	const n = nums.length;
	const expectedSum = (n * (n + 1)) / 2;
	return expectedSum - actualSum;
}

console.log(missingNumbers([3,0,1,5,2])); // 4
console.log(newMissingNumbers([3,0,1,5,2])); // 4
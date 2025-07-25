const myMap = new Map(); // insert, delete, retrieve, validate

myMap.set('name', 'Alice');
myMap.set('age', 30);
myMap.set(true, 'isStudent');
myMap.set({id: 1}, 'userObject');

console.log('Map size: ', myMap.size);

console.log('Name: ', myMap.get('name'));
console.log('Age: ', myMap.get('age'));

console.log("Has 'name' key?", myMap.has('name'));
console.log("Has 'city' key?", myMap.has('city'));

myMap.delete('age');

console.log("Has 'age' after deletion?", myMap.has('age'));
console.log("Has size after deletion: ", myMap.size);

console.log("\nIterating over keys:");
for(const key of myMap.keys()) {
	console.log(key)
}

console.log("\nIterating over values:");
for(const val of myMap.values()) {
	console.log(val)
}

console.log("\nIterating over entries (key-value pairs):");
for(const [key, value] of myMap.entries()) {
	console.log(`${String(key)} => ${value}`)
}

myMap.forEach((value, key) => {
	console.log(`forEach: ${String(key)} => ${value}`)
}) 


myMap.clear();
console.log("\nMap size after clear:", myMap.size);

// Simple Hash Table 
class SimpleHashTable {
	constructor(size = 50) {
		this.buckets = new Array(size);
		this.size = size;
	}
	
	_hash(key) {
		let hashValue = 0;
		const stringKey = String(key);
		for(let i = 0; i < stringKey.length; i++) {
			hashValue = (hashValue + stringKey.charCodeAt(i) * (i + 1)) % this.size;
		}
		
		return hashValue;
	}
	
	// set a key-value pair
	set(key, value) {
		const index = this._hash(key);
		if(!this.buckets[index]) {
			this.buckets[index] = []; // Initialize a new chain (array) if bucket is empty
		}
		
        // Check if key already exists in the chain and update it
		for(let i = 0; i < this.buckets[index].length; i++) {
			if(this.buckets[index][i][0] === key) {
				this.buckets[index][i][1] = value; // updating existing value
				return;
			}
		}
		
		// If key doesn't exist, add new [key, value] pair to the chain
		this.buckets[index].push([key, value]);
	}
	
	// Get a value by key
	get(key) {
		const index = this._hash(key);
		if(!this.buckets[index]) {
			return undefined; // Key not found.
		}
		
		// Search for the key in the chain
		for(let i = 0; i < this.buckets[index].length; i++) {
			if(this.buckets[index][i][0] === key) {
				return this.buckets[index][i][1]; // return the value
			}
		}
		
		return undefined; // Key not found in the chain
	}
	
    // Check if a key exists
	has(key) {
		const index = this._hash(key);
		if(!this.buckets[index]) return false;
		
		for(let i = 0; i < this.buckets[index].length; i++) {
			if(this.buckets[index][i][0] === key) return true;
		}
		
		return false;
	}
	
    // remove a key-value pair
	delete(key) {
		const index = this._hash(key);
		if(!this.buckets[index]) return false;
		
		for(let i = 0; i < this.buckets[index].length; i++) {
			if(this.buckets[index][i][0] === key) {
				this.buckets[index].splice(i, 1); // remove the [key, value] pair
				return true;
			}
		}
		
		return false;
	}
	
	display() {
		this.buckets.forEach((bucket, index) => {
			if(bucket && bucket.length > 0) {
				console.log(`Bucket ${index}: ${JSON.stringify(bucket)}`);
			}
		})
	}
}

// Usage:
const ht = new SimpleHashTable(10);
ht.set('name', 'Alice');
ht.set('age', 30);
ht.set('city', 'New York');
ht.set('country', 'USA');
ht.set('mane', 'Lion');

console.log("Get 'name':", ht.get('name'));
console.log("Get 'age':", ht.get('age'));
console.log("Has 'city':", ht.has('city'));
console.log("Has 'job':", ht.has('job'));
ht.display();

console.log("\nDeleting 'age'...");
ht.delete("age");
console.log("Get 'age' after delete:", ht.get("age")); // undefined
ht.display();

ht.set("name", "Bob"); // Update value for existing key "name"
console.log("\nGet 'name' after update:", ht.get("name")); // Bob
ht.display();


// Two Sum Problem (LeetCode #1)
function twoSum(nums, target) {
	const numMap = new Map();
	
	for(let i = 0; i < nums.length; i++) {
		const currentNum = nums[i];
		const complement = target  - currentNum;
		
		if(numMap.has(complement)) {
			return [numMap.get(complement), i] // found pair
		}
		
		numMap.set(currentNum, i);
	}
}

console.log("Two Sum for [2, 7, 11, 15], target 9:", twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log("Two Sum for [3, 2, 4], target 6:", twoSum([3, 2, 4], 6));       // [1, 2]
console.log("Two Sum for [3, 3], target 6:", twoSum([3, 3], 6));             // [0, 1]

// Count Character Frequencies
function countCharFrequencies(str) {
	const frequencyMap = new Map();
	for(const char of str) {
		const count = frequencyMap.get(char) || 0;
		frequencyMap.set(char, count + 1);
	}
	
	return frequencyMap;
}

const frequencies = countCharFrequencies('hello world');
frequencies.forEach((count, char) => {
	console.log(`'${char}': ${count}`);
});
// Expected output (order might vary):
// 'h': 1
// 'e': 1
// 'l': 3
// 'o': 2
// ' ': 1
// 'w': 1
// 'r': 1
// 'd': 1

/**
 * Contains Duplicate
 * @param {number[]} nums
 * @return {boolean}
 */
 var containsDuplicate = function(nums) {
	const seenNumbers = new Set();
	
	for(const num of nums) {
		if(seenNumbers.has(num)) {
			return true;
		}
		
		seenNumbers.add(num);
	}
	
	return false;
 }
 
console.log("Contains Duplicate in [1, 2, 3, 1]:", containsDuplicate([1, 2, 3, 1])); // Output: true
console.log("Contains Duplicate in [1, 2, 3, 4]:", containsDuplicate([1, 2, 3, 4])); // Output: false
console.log("Contains Duplicate in [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]:", containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // Output: true

/**
 * Group Anagrams
 * @param {string[]} strs
 * @return {string[][]}
 */
 var groupAnagrams = function(strs) {
	const anagramGroups = new Map();
	
	for(const str of strs) {
        // Create a canonical representation for anagrams
        // Sorting the string is a common way: "eat" -> "aet", "tea" -> "aet"
		const sortedStr = str.split('').sort().join('');
		
		// Alternative canonical representation: character count string
		// e.g., "aabbc" -> "a2b2c1" (order of chars should be consistent, e.g. alphabetical)
		if(!anagramGroups.has(sortedStr)) {
			anagramGroups.set(sortedStr, []);
		}
		
		anagramGroups.get(sortedStr).push(str);
	}
	
	return Array.from(anagramGroups.values());
 }

// Example Usage:
console.log("Group Anagrams for ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']:",
    groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// Output: [["eat","tea","ate"],["tan","nat"],["bat"]] (order of groups and strings within groups might vary)

console.log("Group Anagrams for ['']:", groupAnagrams([""]));
// Output: [[""]]

console.log("Group Anagrams for ['a']:", groupAnagrams(["a"]));
// Output: [["a"]]

/**
 * Subarray Sum Equals K
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
	let count = 0;
	let currentSum = 0;
	
    // Map to store frequencies of prefix sums
    // Key: prefix sum, Value: frequency of that prefix sum
	const prefixSumFrequencies = new Map();
	prefixSumFrequencies.set(0, 1); // Base case: a sum of 0 has occurred once (empty prefix)
	
	for(let i = 0; i < nums.length; i++) {
		currentSum += nums[i];
		
		// Check if (currentSum - k) exists in the map
        // If it does, it means there's a previous prefix sum
        // such that the subarray between that point and current point sums to k
		if(prefixSumFrequencies.has(currentSum - k)) {
			count += prefixSumFrequencies.get(currentSum - k);
		}

        // Update the frequency of the currentSum
		prefixSumFrequencies.set(currentSum, (prefixSumFrequencies.get(currentSum) || 0) + 1);
	}
	
	return count;	
};

// Example Usage:
console.log("Subarray Sum Equals K for [1, 1, 1], k = 2:", subarraySum([1, 1, 1], 2)); // Output: 2 ([1,1] and [1,1])
console.log("Subarray Sum Equals K for [1, 2, 3], k = 3:", subarraySum([1, 2, 3], 3)); // Output: 2 ([1,2] and [3])
console.log("Subarray Sum Equals K for [1], k = 0:", subarraySum([1], 0));               // Output: 0
console.log("Subarray Sum Equals K for [-1, -1, 1], k = 0:", subarraySum([-1, -1, 1], 0)); // Output: 1 ([-1,1])
console.log("Subarray Sum Equals K for [1, -1, 5, -2, 3], k = 3:", subarraySum([1,-1,5,-2,3],3)); // Output: 2 ([1,-1,3] is NOT a subarray, [5,-2] and [3]) -- correction: [1,-1,3] if sum is prefixSum[j] - prefixSum[i]. [1,-1,5,-2] and [3] are the ones

// Let's trace [1, -1, 5, -2, 3], k = 3
// prefixSumMap = {0: 1}, currentSum = 0, count = 0
// i=0, num=1: currentSum=1.  (1-3)=-2 not in map.  prefixSumMap={0:1, 1:1}
// i=1, num=-1: currentSum=0. (0-3)=-3 not in map.  prefixSumMap={0:2, 1:1}
// i=2, num=5: currentSum=5.  (5-3)=2 not in map.   prefixSumMap={0:2, 1:1, 5:1}
// i=3, num=-2: currentSum=3. (3-3)=0 in map (freq 2). count += 2. prefixSumMap={0:2, 1:1, 5:1, 3:1}. Subarrays ending here: [1,-1,5,-2], [-1,5,-2]
// i=4, num=3: currentSum=6.  (6-3)=3 in map (freq 1). count += 1. prefixSumMap={0:2, 1:1, 5:1, 3:2, 6:1}. Subarray ending here: [3]
// My trace for [1,-1,5,-2,3], k=3:
// sum[0]=1. map {0:1}. currentSum=1. 1-3=-2. map.set(1,1)
// sum[1]=0. map {0:1, 1:1}. currentSum=0. 0-3=-3. map.set(0,2)
// sum[2]=5. map {0:2, 1:1}. currentSum=5. 5-3=2. map.set(5,1)
// sum[3]=3. map {0:2, 1:1, 5:1}. currentSum=3. 3-3=0. map.has(0) is true, count+=map.get(0)=2. map.set(3,1)
//     (Subarrays ending at index 3 are: [1,-1,5,-2] (sum=3) and [-1,5,-2] (sum=2, not k) and [5,-2] (sum=3) and [-2] (sum=-2, not k)
//     The map.get(currentSum-k) means that prefixSum[j] - prefixSum[i-1] = k.
//     When currentSum = 3 (nums[0..3]), currentSum-k = 0. map.get(0) is 2. This means there are two starting points (an empty prefix, and prefix [1,-1]) that result in a sum k.
//     Subarray [1,-1,5,-2] (sum 3). Subarray [5,-2] (sum 3). Correct.
// sum[4]=6. map {0:2, 1:1, 5:1, 3:1}. currentSum=6. 6-3=3. map.has(3) is true, count+=map.get(3)=1. count=2+1=3. map.set(6,1)
//     Subarray [3] (sum 3). Correct.
// Total should be 3. Let's re-verify the example: [1, -1, 5, -2, 3], k=3.
// Subarrays: [1,-1,3] is not contiguous.
// [1,-1,5,-2] -> sum = 3 (Yes)
// [5,-2] -> sum = 3 (Yes)
// [3] -> sum = 3 (Yes)
// Output should be 3.
// The example [1,-1,5,-2,3], k=3 on LeetCode gives 2. Why?
// The official solution explanation implies the subarrays are: [1,-1,5,-2] and [3].
// My code would find:
// 1. sum up to index 3 is 3. `currentSum - k = 0`. `prefixSumFrequencies.get(0)` is 2. So count becomes 2.
//    These correspond to the prefix sum 0 occurring before index 0 (empty prefix, sum=0), and prefix sum 0 occurring at index 1 ([1,-1], sum=0).
//    So, `nums[0..3]` (i.e. `[1,-1,5,-2]`) sum is `currentSum - 0 = 3`.
//    And `nums[2..3]` (i.e. `[5,-2]`) sum is `currentSum - prefixSum[1] = 3 - 0 = 3`.
// 2. sum up to index 4 is 6. `currentSum - k = 3`. `prefixSumFrequencies.get(3)` is 1 (from the previous step). So count becomes 2+1=3.
//    This corresponds to `nums[4..4]` (i.e. `[3]`) sum is `currentSum - prefixSum[3] = 6 - 3 = 3`.
// So my code result is 3.
// Let's dry run Leetcode's example [1,-1,5,-2,3], k=3 where they say output is 2.
// Subarrays are:
// [1,-1,5,-2] sum = 3
// [3] sum = 3
// Where does [5,-2] come from in my manual trace?
// currentSum = 3 (at index 3, element -2) means nums[0..3]
// (currentSum - k) = (3 - 3) = 0.
// prefixSumFrequencies.get(0) = 2.
// The two occurrences of prefix sum 0 are:
// 1. The initial `prefixSumFrequencies.set(0,1)`. This implies a subarray starting from index 0. So, nums[0...i]. Here nums[0...3] which is [1,-1,5,-2]. Sum is 3. Correct.
// 2. After processing nums[1] = -1, currentSum becomes 0. So `prefixSumFrequencies.set(0, (prefixSumFrequencies.get(0) || 0) + 1)` makes map.get(0) become 2. This means the prefix sum `nums[0...1]` is 0.
// If a prefix sum `P[j]` (currentSum) and a previous prefix sum `P[i-1]` (which is `currentSum-k`) exists, then the sum of `nums[i...j]` is k.
// When currentSum is 3 (at index 3, nums[3]=-2). We look for prefix sum `3-3=0`.
// map.get(0) is 2. This means there are 2 ways to get a prefix sum of 0.
//   a) Before index 0 (empty prefix). This corresponds to subarray `nums[0...3]` = `[1,-1,5,-2]`.
//   b) At index 1 (prefix `[1,-1]`). This corresponds to subarray `nums[2...3]` = `[5,-2]`.
// This is why my code gets 3.
// If LeetCode's output for [1,-1,5,-2,3], k=3 is 2, then my understanding or the example might be slightly off.
// Let's re-check the problem statement for "subarray". "A subarray is a contiguous non-empty sequence of elements".
// For [1,-1,5,-2,3], k=3
// Possible subarrays summing to k:
// [1, -1, 5, -2]  (indices 0-3)
// [5, -2]         (indices 2-3)
// [3]             (indices 4-4)
// There are indeed 3. Perhaps the example I found for "output 2" was incorrect. The logic of prefix sums should be sound.
// A quick search shows the example [1,-1,5,-2,3], k=3 usually yields 3.
// The example [1,2,3], k=3 gives output 2: ([1,2] and [3]). My code:
// prefixSumMap = {0: 1}, currentSum = 0, count = 0
// i=0, num=1: currentSum=1. (1-3)=-2. map={0:1, 1:1}
// i=1, num=2: currentSum=3. (3-3)=0. map.has(0), count+=map.get(0)=1. map={0:1, 1:1, 3:1}. (Subarray [1,2])
// i=2, num=3: currentSum=6. (6-3)=3. map.has(3), count+=map.get(3)=1. count=1+1=2. map={0:1, 1:1, 3:2, 6:1}. (Subarray [3])
// Output 2. This one works.
function binarySearch(arr, x) {
	let low = 0;
	let high = arr.length - 1;
	let mid;
	while (high >= low) {
		mid = low + Math.floor((high - low) / 2);

		// if the element is present at the middle itself
		if (arr[mid] == x) {
			return mid;
		}

		// if element is smaller than mid, then
		// it can only be present is left subarray
		if (arr[mid] > x) {
			high = mid - 1;
		} else {
			// Else the element can only be present
			low = mid + 1;
		}
	}

	// We reach here when element is not
	// present in array
	return -1;
}

const arr = new Array(2, 3, 4, 10, 40);
const x = 10;
const result = binarySearch(arr, x);
if (result == -1) {
	console.log("Element is not present in array");
} else {
	console.log("Element is present at index: ", result);
}

function RecursiveBinarySearch(arr, low, high, x) {
	if (high >= low) {
		let mid = low + Math.floor((high - low) / 2);

		// if the element is present at the middle itself
		if (arr[mid] == x) {
			return mid;
		}

		// if element is smaller than mid, then it can only be present in left subarray
		if (arr[mid] > x) {
			return RecursiveBinarySearch(arr, low, mid - 1, x);
		}

		// Else the element can only be present in right subarray
		return RecursiveBinarySearch(arr, mid + 1, high, x);
	}

	// We reach here when element is not present in array
	return -1;
}

let arr1 = [2, 3, 4, 10, 40];
let x1 = 4;
let n = arr1.length;
let result1 = RecursiveBinarySearch(arr1, 0, n - 1, x1);
if (result1 == -1) {
	console.log("Element is not present in array")
} else {
	console.log("Element is present at index: ", result1)
}
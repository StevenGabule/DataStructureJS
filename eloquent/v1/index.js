// Converting amount with science notation 'e'
// ex: 2.998e8
function convertScienceNotationNumber(numberWithE) {
	const [primaryNumber, expTotal] = numberWithE.split('e');
	let totalCalculationExp = 10;
	let count = 1;
	while (count <= expTotal - 1) {
		totalCalculationExp = (totalCalculationExp * 10);
		count++;
	}
	console.log(`Total points: ${(primaryNumber * totalCalculationExp).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`)
}

// convertScienceNotationNumber('2.998e8');

/**
 * Converts a number in scientific notation (e.g., '2.998e8') to a formatted string
 * with commas and optional fixed decimal places.
 * 
 * @param {string} scientificStr - Number in scientific notation (e.g., '1.23e4')
 * @param {number} [decimals=2] - Number of decimal places to show
 * @returns {string} Formatted number (e.g., "299,800,000.00")
 */
 function formatScientificNumber(scientificStr, decimals = 2) {
	// input validation
	if(typeof scientificStr !== "string") {
		throw new TypeError("Input must be a string");
	}
	
	// Convert to number (handles 'e' and 'E', positive/negative exponents)
	const num = Number(scientificStr);
	
	// check for invalid numbers (e.g., 'abc')
	if(isNaN(num)) {
		throw new Error(`Invalid scientific notation: "${scientificStr}"`)
	}
	
	// Format with commas and fixed decimals
	return num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
 }
 
 
// Usage
console.log(formatScientificNumber('2.998e8'));     // "299,800,000.00"
console.log(formatScientificNumber('1.5e-3', 4));   // "0.0015"
console.log(formatScientificNumber('5E6'));         // "5,000,000.00"








// calculate miles per gallon

let again = 'd';
do {
	let miles = '1000'; // prompt('Enter miles driven')
	let gallons = '12a00'; // prompt('Enter gallon of gas used')

	if (isNaN(miles) || isNaN(gallons)) {
		console.log('Oops... input is not a number: ' + (isNaN(miles) ? miles : gallons));
	} else {
		gallons = parseFloat(gallons)
		miles = parseFloat(miles);
		if(miles > 0 && gallons > 0) {
			console.log("Miles per gallon = " + ( miles / gallons));
		} else {
			console.log("One or both entries are invalid.")
		}
	}
} while(again === 'y')
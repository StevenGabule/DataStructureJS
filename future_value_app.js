let futureValue;

let investment = parseFloat('10000'); // prompt('Enter investment amount as xxxxx.xx', 10000)
let rate = parseFloat('7.5'); // prompt('Enter interest rate as xx.x', 7.5)
let years = parseInt('10'); // prompt('Enter numbers of years', 10)

futureValue = investment;
for (let i = 0; i < years; i++) {
	futureValue = futureValue + (futureValue * rate / 100);
}
console.log(futureValue)

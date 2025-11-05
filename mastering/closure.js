// Lexical scoping
function init() {
	let name = "Mozilla";
	
	function displayName() {
		console.log(name)
	}
	
	displayName();
}

// init();

function makeFunc() {
	let name = "Mozilla";
	
	function displayName() {
		console.log(name)
	}
	
	return displayName;
}

// const myFunc = makeFunc();
// myFunc();

function makeAdder(x) {
	return function (y) {
		return x + y;
	}
}

// const add5 = makeAdder(5);
// const add10 = makeAdder(10);

// console.log(add5(2)); // 7;
// console.log(add10(2)); // 12;

// const counter = (function() {
// 	let privateCounter = 0;
// 	function changeBy(val) {
// 		privateCounter += val;
// 	}
	
// 	return {
// 		increment() {
// 			changeBy(1)
// 		},
// 		decrement() {
// 			changeBy(-1)
// 		},
		
// 		value() {
// 			return privateCounter;
// 		}
// 	}
// })()

// console.log(counter.value());

// counter.increment();
// counter.increment();
// console.log(counter.value());

// counter.decrement();
// console.log(counter.value());

// function outer() {
// 	let getY;
// 	{
// 		const y = 6;
// 		getY = () => y;
// 	}
// 	console.log(typeof y); // undefined
// 	console.log(getY()); // 6
// }

// outer();

// let x = 5;
// export const getX = () => x;
// export const setX = (val) => {
// 	x = val;
// }

// IIFE
// const credits = ((num) => {
// 	let credits = num;
// 	console.log(`initial credits value: ${credits}`);
// 	return () => {
// 		credits -= 1;
// 		if(credits > 0) console.log(`Playing game, ${credits} credits(s) remaining`);
// 		if(credits <= 0) console.log(`Not enough credits, please add a credit`);
// 	}
// })(3);

// credits();
// credits();
// credits();

function createBankAccount(initialBalance) {
	let balance = initialBalance;
	
	return {
		deposit(amount) {
			balance += amount;
			return balance;
		},
		withdraw(amount) {
			if(amount <= balance) {
				balance -= amount;
				return balance;
			}
			
			return "Insufficient funds";
		},
		getBalance() {
			return balance;
		}
	};
}

const myAccount = createBankAccount(1000);
myAccount.deposit(500); // 1500
myAccount.withdraw(200); // 1300
// myAccount.balance = 0;  // This won't work - balance is protected!


// Function Factories
// Create specialized functions with preset configurations:
function createMultiplier(multiplier) {
	return function(number) {
		return number * multiplier;
	}
}

const doubleNum = createMultiplier(2);
const tripleNum = createMultiplier(3);

console.log(doubleNum(5)); // 10
console.log(tripleNum(5)); // 15


// Event Handlers with State
function setupButton() {
	let clickCount = 0;
	
	document.getElementById('myButton').addEventListener('click', function() {
		clickCount++;
		console.log(`Button clicked ${clickCount} times`)
	});
}


// Callbacks and Async Operations
// Preserve context for asynchronous code:
function fetchUserData(userId) {
	const timestamp = new Date().toISOString();
	
	fetch(`/api/users/${userId}`).then(res => res.json()).then(data => {
		// this callback has access to userId and timestamp
		console.log(`User ${userId} fetched at ${timestamp}`, data);
	});
}

// Module Pattern
// Create modules with public and private methods:
const calculator = (function() {
	let history = [];
	
	function addToHistory(operation) {
		history.push(operation);
	}
	
	// Public API
	return {
		add(a,b) {
			const result = a + b;
			addToHistory(`${a} + ${b} = ${result}`);
			return result;
		},
		multiply(a,b) {
			const result = a * b;
			addToHistory(`${a} * ${b} = ${result}`);
			return result;
		},
		getHistory() {
			return [...result]; // return a copy
		}
	}
})();

calculator.add(5, 3); // 8
calculator.multiply(4, 2); // 8
console.log(calculator.getHistory());

// Currying and Partial Application
function curry(fn) {
	return function curried(...args) {
		if(args.length >= fn.length){
			return fn.apply(this, args);
		} else {
			return function(...nextArgs) {
				return curried.apply(this, args.concat(nextArgs));
			}
		}
	}
}

function add(a,b,c) {
	return a+b+c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6

function delayedGreeting(name) {
	setTimeout(function() { console.log(`Hello ${name}!`) }, 1000)
}

delayedGreeting("Alice");

// WRONG - all functions will log 3
for(var i = 0; i < 3; i++) {
	setTimeout(function() {
		console.log(i)
	}, 1000)
}

// outputs: 3,3,3


// CORRECT - using let (block scope)
for(let i = 0; i < 3; i++) {
	setTimeout(function() {
		console.log(i)
	}, 1000)
}

// Output: 0, 1, 2

// CORRECT - using IIFE to create closure
for(var i = 0; i < 3; i++) {
	(function(index) {
		setTimeout(function() {
			console.log(index)
		}, 1000)
	})(i)
}

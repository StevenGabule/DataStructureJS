// Spread Operator (...) - "Spread out" elements
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // 1,2,3,4,5,6

// Object spreading (crucial for react state updates)
const original = { name: 'John', age: 30 }
const updated = { ...original, age: 31 }

// Function arguments spreading
function sum(a, b, c) {
	return a + b + c;
}

const numbers = [1, 2, 3];
sum(...numbers); // Equivalent to sum(1,2,3)

// Rest Parameters - 'Collect' remaining elements
function collectArgs(first, ...rest) {
	console.log(first);
	console.log(rest);
}

// React Props Rest Pattern
function Button({ children, className, ...restProps }) {
	return (
		<button className={`btn ${className}`} {...restProps}>
			{children}
		</button>
	)
}
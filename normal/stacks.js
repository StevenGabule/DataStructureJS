class Stack {
	constructor() {
		this.items = [];
	}
	
	push(elem) {
		this.items.push(elem);
	}
	
	pop() {
		if(this.isEmpty()) {
			return undefined;
		}
		return this.items.pop();
	}
	
	peek() {
		
		if(this.isEmpty()) {
			return undefined;
		}
		return this.items[this.items.length - 1];
	}
	
	isEmpty() {
		return this.items.length === 0;
	}
	
	size() {
		return this.items.length
	}
	
	print() {
		console.log(this.items.toString());
	}
}

// Example Usage:
// const myStack = new Stack();
// myStack.push(10);
// myStack.push(20);
// myStack.push(30);

// myStack.print(); // Output: 10,20,30

// console.log("Top element:", myStack.peek()); // Output: Top element: 30
// console.log("Popped element:", myStack.pop()); // Output: Popped element: 30
// myStack.print(); // Output: 10,20

// console.log("Is stack empty?", myStack.isEmpty()); // Output: Is stack empty? false
// console.log("Stack size:", myStack.size()); // Output: Stack size: 2

// myStack.pop();
// myStack.pop();
// console.log("Is stack empty after popping all?", myStack.isEmpty()); // Output: Is stack empty after popping all? true
// console.log("Popped from empty stack:", myStack.pop()); // Output: Popped from empty stack: undefined

// *** Balanced Parentheses Checker ***
function isBalanced(s) {
	const stack = [];
	const map = {
		"(": ")",
		"[": "]",
		"{": "}",
	};
	
	for(let i = 0; i < s.length; i++) {
		const char = s[i];
		
		if(map[char]) {
			stack.push(char);
		} else {
			if(stack.length === 0) {
				return false;
			}
			const lastOpen = stack.pop();
			if(map[lastOpen] !== char) {
				return false;
			}
		}
	}
	
	return stack.length === 0;
}

console.log("Is '()[]{}' balanced?", isBalanced("()[]{}")); // true
console.log("Is '([)]' balanced?", isBalanced("([)]"));   	// false
console.log("Is '{[]}' balanced?", isBalanced("{[]}"));     // true
console.log("Is ']' balanced?", isBalanced("]"));         	// false
console.log("Is '' balanced?", isBalanced(""));           	// true

// Reverse a String using Stack
function reverseStringWithStack(str) {
	const stack = new Stack();
	let reversedStr = '';
	
	for(let i = 0; i < str.length; i++) {
		stack.push(str[i]);
	}
	
	while(!stack.isEmpty()) {
		reversedStr += stack.pop();
	}
	
	return reversedStr;
}

console.log("Reversing 'hello':", reverseStringWithStack("hello")); // olleh
console.log("Reversing 'world':", reverseStringWithStack("world")); // dlrow



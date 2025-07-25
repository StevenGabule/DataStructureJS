// 1. ARRAY-BASED QUEUE (Simple but less efficient)
class ArrayQueue {
	constructor() {
		this.items = [];
	}
	
	// Add element to rear - O(1)
	enqueue(element) {
		this.items.push(element);
	}
	
	// Remove from front - O(n) due to array shifting
	dequeue() {
		if(this.isEmpty()) {
			return null;
		}
		
		return this.items.shift();
	}
	
	// View front element - O(1)
	peek() {
		if(this.isEmpty()) {
			return null;
		}
		
		return this.items[0];
	}
	
	// Check if empty - O(1)
	isEmpty() {
		return this.items.length === 0;
	}
	
	// Get size - O(1)
	size() {
		return this.items.length;
	}
	
	// Clear queue - O(1)
	clear() {
		this.items = [];
	}
	
	print() {
		console.log(this.items.join(' <- '));
	}
}

const arrQueue = new ArrayQueue();
arrQueue.enqueue('PHP');
arrQueue.enqueue('JS');
arrQueue.enqueue('Rust');
arrQueue.enqueue('Python');
console.log('isEmpty: ', arrQueue.isEmpty());
console.log('size: ', arrQueue.size());
console.log('peek: ', arrQueue.peek());
arrQueue.print();

console.log('deque: ', arrQueue.dequeue());

arrQueue.print();

console.log('\n\n\n');

// 2. OPTIMIZED ARRAY-BASED QUEUE (Using object for O(1) dequeue)
class OptimizeQueue {
	constructor() {
		this.items = {};
		this.frontIndex = 0;
		this.backIndex = 0;
	}
	
	// Add element to rear - O(1)
	enqueue(elem) {
		this.items[this.backIndex] = elem;
		this.backIndex++;
	}
	
	// Remove from front - O(1)
	dequeue() {
		if(this.empty()) return null;
		
		const item = this.items[this.frontIndex];
		delete this.items[this.frontIndex];
		this.frontIndex++;
		return item;
	}

	// View front element - O(1)
	peek() {
		if(this.isEmpty()) return null;
		
		return this.items[this.frontIndex];
	}
	
	// Check if empty - O(1)
	isEmpty() {
		return this.frontIndex === this.backIndex;
	}
	
	// Get size - O(1)
	size() {
		return this.backIndex - this.frontIndex;
	}
	
	// Clear queue - O(1)
	clear() {
		this.items = [];
		this.frontIndex = 0;
		this.backIndex = 0;
	}
	
	print() {
		const elements = [];
		for(let i = this.frontIndex; i < this.backIndex; i++) {
			elements.push(this.items[i]);
		}
		console.log(elements.join(' <- '));
	}
}

class Node {
	constructor(data) {
		this.data = data;
		this.next = null;
	}
}

class LinkedListQueue {
	constructor() {
		this.front = null;
		this.rear = null;
		this.length = 0;
	}
	
	// Add element to rear - O(1)
	enqueue(element) {
		const newNode = new Node(element);
		
		if(this.isEmpty) {
			this.front = newNode;
			this.rear = newNode;
		} else {
			this.rear.next = newNode;
			this.rear = newNode;
		}
		
		this.length++;
	}
	
	// Remove from front - O(1)
	dequeue() {
		if(this.isEmpty()) return null;
		
		const data = this.front.data;
		this.front = this.front.next;
		
		if(!this.front) {
			this.rear = null;
		}
		
		this.length--;
		return data;
	}
	
	// View front element - O(1)
	peek() {
		if(this.isEmpty()) return null;
		
		return this.front.data;
	}
	
	// Check if empty - O(1)
	isEmpty() {
		return this.front === null;
	}
	
	// Get size - O(1)
	size() {
		return this.length;
	}
	
	// Clear queue - O(1)
	clear() {
		this.front = null;
		this.back = null;
		this.length = 0;
	}
	
	// Print queue - O(n)
	print() {
		if(this.isEmpty()) return;
		
		let current = this.front;
		const elements = [];
		
		while(current) {
			elements.push(current.data);
			current = current.next;
		}
		
		console.log('Front -> ' + elements.join(' <- ') + ' <- Rear');
	}
}

class CircularQueue {
	constructor(capacity) {
		this.items = new Array(capacity);
		this.capacity = capacity;
		this.front = -1;
		this.rear = -1;
		this.currentSize = 0;
	}
	
	// Add element to rear - O(1)
	enqueue(element) {
		if(this.isFull) return false;
		
		if(this.isEmpty) this.front = 0;
		
		this.rear = (this.rear + 1) % this.capacity;
		this.items[this.rear] = element;
		this.currentSize++;
		return true;
	}
	
	// Remove from front - O(1)
	dequeue() {
		if(this.isEmpty()) return null;
		
		const item = this.items[this.front];
		this.items[this.front] = undefined;
		
		if(this.front === this.rear) {
			this.front = -1;
			this.rear = -1;
		} else {
			this.front = (this.front + 1) % this.capacity;
		}
		
		this.currentSize--;
		return item;
	}
	
	// View front element - O(1)
	peek() {
		if(this.isEmpty()) return null;
		
		return this.items[this.front];
	} 
	
	// Check if empty - O(1)
	isEmpty() {
		return this.currentSize === 0;
	}
	
	// Check if full - O(1)
	isFull() {
		return this.currentSize ===  this.capacity;
	}
	
	// Get size - O(1)
	size() {
		return this.currentSize;
	}
	
	// Print Queue - O(n)
	print() {
		if(this.isEmpty()) return;
		
		const elements = [];
		let i = this.front;
		let count = 0;
		
		while(count < this.currentSize) {
			elements.push(this.items[i]);
			i = (i + 1) % this.capacity;
			count++;
		}
		
		console.log('Front -> ' + elements.join(' <- ') + ' <- Rear');
	}
}











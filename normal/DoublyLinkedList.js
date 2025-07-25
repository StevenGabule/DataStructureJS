class DoublyNode {
	constructor(data) {
		this.data = data;
		this.next = null;
		this.prev = null;
	}
}

class DoublyLinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.size = 0;
	}
	
	prepend(data){
		const newNode = new DoublyNode(data);
		
		if(!this.head) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			newNode.next = this.head;
			this.head.prev = newNode;
			this.head = newNode;
		}
		
		this.size++;
	}
	
	append(data) {
		const newNode = new DoublyNode(data);
		
		if(!this.head) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next = newNode;
			newNode.prev= this.tail;
			this.tail = newNode;
		}
		
		this.size++;
	}
	
	insertAt(position, data) {
		if(position < 0 || position > this.size) {
			throw new Error('Invalid position');
		}
		
		if(position === 0) {
			this.prepend(data);
			return;
		}
		
		if(position === this.size) {
			this.append(data);
			return;
		}
		
		const newNode = new DoublyNode(data);
		let current = this.head;
		let index = 0;
		
		// Traverse to the position
		while(index < position) {
			current = current.next;
			index++;
		}
		
		newNode.prev = current.prev;
		newNode.next = current;
		newNode.prev.next = newNode;
		newNode.prev = newNode;
		
		this.size++;
	}
	
	// Remove from beginning - O(1)
	removeFirst() {
		if(!this.head) {
			return null;
		}
		
		const removedData = this.head.data;
		
		if(this.head === this.tail) {
			this.head = null;
			this.tail = null;
		} else {
			this.head = this.head.next;
			this.head.prev = null;
		}
		
		this.size--;
		return removedData;
	}
	
	
	// Remove from end - O(1)
	removeLast() {
		if(!this.tail) {
			return null;
		}
		
		const removedData = this.tail.data;
		
		if(this.head === this.tail) {
			this.head = null;
			this.tail = null;
		} else {
			this.tail = this.tail.prev;
			this.tail.next = null;
		}
		
		this.size--;
		return removedData;
	}
	
	// Remove at specific position - O(n)
	removeAt(position) {
		if(position < 0 || position >= this.size) {
			throw new Error('Invalid position');
		}
		
		if(position === 0) {
			return this.removeFirst();
		}
		
		if(position ===  this.size - 1) {
			return this.removeLast();
		}
		
		let current;
		
		// Optimize traversal by starting from closer end
		if(position < this.size / 2) {
			// start from head
			current= this.head;
			let index = 0;
			while(index < position) {
				current = current.next;
				index++;
			}
		} else {
			// start from tail
			current = this.tail;
			let index = this.size - 1;
			while(index > position) {
				current = current.prev;
				index--;
			}
		}
		
		// remove the node
		current.prev.next = current.next;
		current.next.prev = current.prev;
		this.size--;
		
		return current.data;
	}
	
	removeByValue(data) {
		let current = this.head;
		
		while(current) {
			if(current.data === data) {
				if(current ===  this.head) {
					return this.removeFirst();
				} else if(current === this.tail) {
					return this.removeLast();
				} else {
					current.prev.next = current.next;
					current.next.prev = current.prev;
					this.size--;
					return current.data;
				}
			}
			current = current.next;
		}
		
		return null;
	}	
	
	// Find element by value - O(n)
	find(data) {
		let current = this.head;
		let index = 0;
		
		while(current) {
			if(current.data === data) {
				return index;
			}
			
			current = current.next;
			index++;
		}
		
		return -1;
	}
	
	get(position) {
		if(position < 0 || position >= this.size) {
			return null;
		}
		
		let current;
		
		// optimize traversal
		if(position < this.size / 2) {
			current = this.head;
			
			for(let i = 0; i < position; i++) {
				current = current.next;
			}
		} else {
			current = this.tail;
			for(let i = this.size - 1; i > position; i--){
				current = current.prev;
			}
		}
		
		return current.data;
	}
	
	// Print list forward - O(n)
	printForward() {
		if(!this.head) {
			console.log('List is empty!');
			return;
		}
		
		let current = this.head;
		let output = '';
		
		while(current) {
			output += current.data;
			if(current.next) {
				output += ' <-> ';
			}
			current = current.next;
		}
		
		console.log(output);
	}

	// Print list backward - O(n)
	printBackward() {
		if(!this.tail) {
			console.log('List is empty!');
			return;
		}
		
		let current = this.tail;
		let output = '';
		
		while(current) {
			output += current.data;
			if(current.prev) {
				output += ' <-> ';
			}
			current = current.prev;
		}
		
		console.log(output);
	}
	
	// Reverse the linked list - O(n)
	reverse() {
		if(!this.head) return;
		
		let current = this.head;
		let temp = null;
		
		// Swap next and prev for all nodes
		while(current) {
			temp = current.prev;
			current.prev = current.next;
			current.next = temp;
			current = current.prev;
		}
		
		// Swap head and tail
		temp = this.head;
		this.head = this.tail;
		this.tail = temp;
	}
	
	// Convert to array - O(n)
	toArray() {
		const result = [];
		let current = this.head;
		
		while(current) {
			result.push(current.data);
			current = current.next;
		}
		
		return result;
	}
	
	// Clear the list - O(1)
	clear() {
		this.head = null;
		this.tail = null;
		this.size = 0;
	}
	
	// Check if empty - O(1)
	isEmpty() {
		return this.size === 0;
	}
	
	// Get size - O(1)
	getSize() {
		return this.size;
	}
}


// Example usage
// console.log('=== Basic Doubly Linked List Operations ===');
// const dll = new DoublyLinkedList();

// dll.append(10);
// dll.append(20);
// dll.append(30);
// dll.prepend(5);
// dll.insertAt(2, 15);
// console.log('Initial list (forward):');
// dll.printForward(); // 5 <-> 10 <-> 15 <-> 20 <-> 30

// console.log('Initial list (background):');
// dll.printBackward(); // 30 <-> 20 <-> 10 <-> 5

// Removing Elements
// console.log('\nRemoved first: ', dll.removeFirst()); // 5
// console.log('Removed last: ', dll.removeLast()); // 30
// console.log('Removed at position 1: ', dll.removeAt(1)); // 15


// Reverse the list
// dll.reverse();
// console.log('\nReversed Lists:');
// dll.printForward();

// LRU Cache 
class LRUCache {
	constructor(capacity) {
		this.capacity = capacity;
		this.cache = new Map();
		this.dll = new DoublyLinkedList();
	}
	
	get(key) {
		if(!this.cache.has(key)) {
			return -1;
		}
		
		const value = this.cache.get(key);
		this.dll.removeByValue(key);
		this.dll.prepend(key);
		
		return value;
	}
	
	put(key, value) {
		if(this.cache.has(key)) {
			this.dll.removeByValue(key)
		} else if(this.cache.size >= this.capacity) {
			const lru = this.dll.removeLast();
			this.cache.delete(lru);
		}
		
		this.dll.prepend(key);
		this.cache.set(key,value);
	}
	
	display() {
		console.log('LRU cache status:');
		this.dll.printForward();
	}
}

// LRU Cache example
// console.log('\n--- LRU Cache Example ---');
// const lru = new LRUCache(3);

// lru.put('a', 1);
// lru.put('b', 2);
// lru.put('c', 3);
// lru.display(); // c <-> b <-> a

// console.log('Get a:', lru.get('a'));
// lru.display(); // a <-> c <-> b

// lru.put('d', 4);
// lru.display(); // d <-> a <-> c

// 2. Browser History Implementation
class BrowserHistory {
	constructor() {
		this.history = new DoublyLinkedList();
		this.current = null;
	}
	
	visit(url) {
		// Remove all forward history when visiting new page
		if(this.current && this.current.next) {
			let node = this.current.next;
			while(node) {
				this.history.size--;
				node = node.next;
			}
			this.current.next = null;
			this.history.tail = this.current;
		}
		
		// Add new page
		const newNode = new DoublyNode(url);
		
		if(!this.history.head) {
			this.history.head = newNode;
			this.history.tail = newNode;
		} else {
			this.history.tail.next = newNode;
			newNode.prev = this.history.tail;
			this.history.tail = newNode;
		}
		
		this.current = newNode;
		this.history.size++;
	}
	
	back() {
		if(this.current && this.current.prev) {
			this.current = this.current.prev;
			return this.current.data;
		}
		return null;
	}
	
	forward() {
		if(this.current && this.current.next) {
			this.current = this.current.next;
			return this.current.data;
		} 
		
		return null;
	}
	
	getCurrentUrl() {
		return this.current ? this.current.data : null;
	}
	
	printHistory() {
		console.log('Browser History:');
		this.history.printForward();
		console.log('Current: ', this.getCurrentUrl());
	}
}

// console.log('\n--- Browser History Example ---');
// const browser = new BrowserHistory();
// browser.visit('google');
// browser.visit('youtube');
// browser.visit('facebook');
// browser.printHistory();

// console.log('\nGo back:', browser.back());
// console.log('Go back:', browser.back());
// console.log('Go forward:', browser.forward());

// browser.visit('twitter');
// browser.printHistory();


class TextEditor {
	constructor() {
		this.states = new DoublyLinkedList();
		this.currentState = null;
	}
	
	write(text) {
		// Remove all states after current (lose redo history)
		if(this.currentState && this.currentState.next) {
			let node = this.currentState.next;
			while(node) {
				this.states.size--;
				node = node.next;
			}
			
			this.currentState.next = null;
			this.states.tail = this.currentState;
		}
		
		// add new state
		const newNode = new DoublyNode(text);
		
		if(!this.states.head) {
			this.states.head = newNode;
			this.states.tail = newNode;
		} else {
			this.states.tail.next = newNode;
			newNode.prev = this.states.tail;
			this.states.tail = newNode;
		}
		
		this.currentState = newNode;
		this.states.size++;
	}
	
	undo() {
		if(this.currentState && this.currentState.prev) {
			this.currentState = this.currentState.prev;
			return this.currentState.data;
		}
		
		return null;
	}
	
	redo() {
		if(this.currentState && this.currentState.next) {
			this.currentState = this.currentState.next;
			return this.currentState.data;
		}
		
		return null;
	}
	
	getCurrentText() {
		return this.currentState ? this.currentState.data : '';
	}
}


// Text Editor example
console.log('\n--- Text Editor Example ---');
const editor = new TextEditor();

editor.write('Hello');
editor.write('Hello World');
editor.write('Hello World!');

console.log('Current: ', editor.getCurrentText());  // Hello World!
console.log('Undo: ', editor.undo());  // Hello World
console.log('Undo: ', editor.undo());  // Hello
console.log('Redo: ', editor.redo());  // Hello World

editor.write('Hello Javascript');
console.log('Current: ', editor.getCurrentText()); // Hello JavaScript
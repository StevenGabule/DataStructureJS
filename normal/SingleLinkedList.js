class Node {
	constructor(data) {
		this.data = data;
		this.next = null;
	}
}

class LinkedList {
	constructor() {
		this.head = null;
		this.size = 0;
	}
	
	prepend(data) {
		const newNode = new Node(data);
		newNode.next = this.head;
		this.head = newNode;
		this.size++;
	}
	
	append(data) {
		const newNode = new Node(data);
		
		if(!this.head) {
			this.head = newNode;
		} else {
			let current = this.head;
			while(current.next) {
				current = current.next;
			}
			current.next = newNode;
		}
		this.size++;
	}
	
	insertAt(position, data) {
		if(position < 0 || position > this.size) {
			throw new Error('Invalid position')
		}
		
		if(position === 0) {
			this.prepend(data);
			return;
		}
		
		const newNode = new Node(data);
		let current = this.head;
		let previous;
		let index = 0;
		
		while(index < position) {
			previous = current;
			current = current.next;
			index++;
		}
		
		newNode.next = current;
		previous.next = newNode;
		this.size++;
	}
	
	removeFirst() {
		if(!this.head) {
			return null;
		}
		
		const removedData = this.head.data;
		this.head = this.head.next;
		this.size--;
		return removedData;
	}
	
	removeLast() {
		if(!this.head) {
			return null;
		}
		
		if(!this.head.next) {
			const removedData = this.head.data;
			this.head = null;
			this.size--;
			return removedData;
		}
		
		let current = this.head;
		let previous;
		
		while(current.next) {
			previous = current;
			current = current.next;
		}
		
		previous.next = null;
		this.size--;
		
		return current.data;
	}
	
	removeAt(position) {
		if(position < 0 || position >= this.size) {
			throw new Error('Invalid position.')
		}
		
		if(position === 0) {
			return this.removeFirst();
		}
		
		let current = this.head;
		let previous;
		let index = 0;
		
		while(index < position) {
			previous = current;
			current = current.next;
			index++;
		}
		
		previous.next = current.next;
		this.size--;
		return current.data;
	}
	
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
		
		let current = this.head;
		let index = 0;
		
		while(index < position) {
			current = current.next;
			index++;
		}
		
		return current.data;
	}
	
	contains(data) {
		return this.find(data) !== -1;
	}
	
	clear() {
		this.head = null;
		this.size = 0;
	}
	
	isEmpty() {
		return this.size === 0;
	}
	
	getSize() {
		return this.size;
	}
	
	toArray() {
		const result = [];
		let current = this.head;
		
		while(current) {
			result.push(current.data);
			current = current.next;
		}
		
		return result;
	}
	
	print() {
		if(!this.head) {
			console.log('List is empty!');
			return;
		}
	
		let current = this.head;
		let output = '';
		while(current) {
			output += current.data;
			if(current.next) {
				output += ' -> ';
			}
			current = current.next;
		}
		console.log(output);
	}
	
	reverse() {
		let previous = null;
		let next = null;
		let current = this.head;
		
		while(current) {
			next = current.next;
			current.next = previous;
			previous = current;
			current = next;
		}
		this.head.previous;
	}
 }
 
 // Example usage
const list = new LinkedList();

// Adding elements
list.append(10);
list.append(20);
list.append(30);
list.prepend(5);
list.insertAt(2, 15);

console.log('Initial list:');
list.print(); // 5 -> 10 -> 15 -> 20 -> 30

 
 
// Removing elements
console.log('\nRemoved first:', list.removeFirst()); // 5
console.log('Removed last:', list.removeLast()); // 30
console.log('Removed at position 1:', list.removeAt(1)); // 15

console.log('\nList after removals:');
list.print(); // 10 -> 20

// Finding and accessing elements
console.log('\nFind 20:', list.find(20)); // 1
console.log('Get element at position 0:', list.get(0)); // 10
console.log('Contains 15?', list.contains(15)); // false

// Other operations
console.log('\nList size:', list.getSize()); // 2
console.log('Is empty?', list.isEmpty()); // false
console.log('As array:', list.toArray()); // [10, 20]

// Reverse the list
list.reverse();
console.log('\nReversed list:');
list.print(); // 20 -> 10
 
 
// Finding middle element
function findMiddle(linkedList) {
	if(!linkedList.head) return null;
	
	let slow = linkedList.head;
	let fast = linkedList.head;
	
	while(fast && fast.next) {
		slow = slow.next;
		fast = fast.next.next;
	}
	
	return slow.data;
}
 
// Detecting cycle in linked list
function hasCycle(head) {
	if(!head) return false;
	
	let slow = head;
	let fast = head;
	
	while(fast && fast.next) {
		slow = slow.next;
		fast = fast.next.next;
		
		if(slow === fast) {
			return true;
		}
	}
		
	return false;
}
 
 
// Merge two sorted linked lists
function mergeSortedLists(list1, list2) {
	const dummy = new Node(0);
	let current = dummy;
	let l1 = list1.head;
	let l2 = list2.head;
	
	while(l1 && l2) {
		if(l1.data <= l2.data) {
			current.next = l1;
			l1 = l1.next;
		} else {
			current.next = l2;
			l2 = l2.next;
		}
		current = current.next;
	}
	
	current.next = l1 || l2;
	
	const mergedList = new LinkedList();
	mergedList.head = dummy.next;
	
	// update size
	let temp = mergedList.head;
	while(temp){
		mergedList.size++;
		temp = temp.next;
	}
	
	return mergedList;
}

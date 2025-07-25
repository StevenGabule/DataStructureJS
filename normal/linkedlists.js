// The main operations on linked lists are:
// • prepend - add a node to the beginning of the list
// • append - add a node to the end of the list
// • delete - remove a node from the list
// • deleteTail - remove the last node from the list
// • deleteHead - remove the first node from the list
// • find - find a node in the list

class LinkedListNode {
	constructor(value, next = null) {
		this.value = value;
		this.next = next;
	}
	
	toString(callback) {
		return callback ? callback(this.value) : `${this.value}`;
	}
}

class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}
	
	prepend(value) {
		const newNode = new LinkedListNode(value, this.head);
		this.head = newNode;
		
		if(!this.tail) {
			this.tail = newNode;
		}
		
		return this;
	}
	
	append(value) {
		const newNode = new LinkedListNode(value);
		
		// If there is no head yet let's make new node a head.
		if(!this.head) {
			this.head = newNode;
			this.tail = newNode;
			
			return this;
		}
		
		const currentTail = this.tail;
		currentTail.next = newNode;
		
		// Attach new node to the end of linked list.
		this.tail = newNode;
		return this;
	}
	
	delete(value) {
		if(!this.head) {
			return null;
		}
		
		let deletedNode = null;
		
		while(this.head && this.head.value === value) {
			deletedNode = this.head;
			this.head = this.head.next;
		}
		
		let currentNode = this.head;
	}
}



































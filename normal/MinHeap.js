class MinHeap {
	constructor() {
		this.heap = [];
	}
	
	_getParentIndex(childIndex) {
		return Math.floor((childIndex - 1) / 2);
	}
	
	_getLeftChildIndex(parentIndex) {
		return 2 * parentIndex + 1;
	}
	
	_getRightChildIndex(parentIndex) {
		return 2 * parentIndex + 2;
	}
	
	_hasParent(childIndex) {
		return this._getParentIndex(childIndex) >= 0;
	}
	
	_hasLeftChild(parentIndex) {
		return this._getLeftChildIndex(parentIndex) < this.heap.length;
	}
	
	_hasRightChild(parentIndex) {
		return this._getRightChildIndex(parentIndex) < this.heap.length;
	}
	
	_parent(childIndex) {
		return this.heap[this._getParentIndex(childIndex)];
	}
	
	_leftChild(parentIndex) {
		return this.heap[this._getLeftChildIndex(parentIndex)];
	}
	
	_rightChild(parentIndex) {
		return this.heap[this._getRightChildIndex(parentIndex)];
	}
	
	_swap(indexOne, indexTwo) {
		[this.heap[indexOne], this.heap[indexTwo]] = [this.heap[indexTwo], this.heap[indexOne]];
	}
	
	peek() {
		if(this.heap.length === 0) return null;
		
		return this.heap[0];
	}
	
	extractMin() {
		if(this.heap.length === 0) return null;
		if(this.heap.length === 1) return this.heap.pop();
		
		const item = this.heap[0];
		this.heap[0] = this.heap.pop();
		this._heapifyDown();
		return item;
	}
	
	insert(item) {
		this.heap.push(item);
		this._heapifyUp();
	}
	
	_heapifyUp() {
		let currentIndex = this.heap.length - 1;
		while(this._hasParent(currentIndex) && this._parent(currentIndex) > this.heap[currentIndex]) {
			const parentIndex = this._getParentIndex(currentIndex);
			this._swap(parentIndex, currentIndex);
			currentIndex = parentIndex;
		}
	}
	
	_heapifyDown() {
		let currentIndex = 0;
		while(this._hasLeftChild(currentIndex)) {
			let smallerChildIndex = this._getLeftChildIndex(currentIndex);
			
			// If there's a right child and it's smaller than the left child
			if(this._hasRightChild(currentIndex) && this._rightChild(currentIndex) < this._leftChild(currentIndex)) {
				smallerChildIndex = this._getRightChildIndex(currentIndex);
			}
			
			// If the current element is smaller than its smallest child, heap property is satisfied
			if(this.heap[currentIndex] < this.heap[smallerChildIndex]) {
				break;
			} else {
				this._swap(currentIndex, smallerChildIndex);
			}
			
			currentIndex = smallerChildIndex;
		}
	}
	
	size() {
		return this.heap.length;
	}
	
	isEmpty() {
		return this.heap.length === 0;
	}
	
	buildHeap(array) {
		this.heap = [...array];
		const firstNonLeafIndex = Math.floor(this.heap.length / 2) - 1;
		for(let i = firstNonLeafIndex; i >= 0; i--) {
			this._heapifyDownFromIndex(i);
		}
	}
	
	_heapifyDownFromIndex(startIndex) {
		let currentIndex = startIndex;
		while(this._hasLeftChild(currentIndex)) {
			let smallerChildIndex = this._getLeftChildIndex(currentIndex);
			if(this._hasRightChild(currentIndex) && this._rightChild(currentIndex) < this._leftChild(currentIndex)) {
				smallerChildIndex = this._getRightChildIndex(currentIndex);
			}
			
			if(this.heap[currentIndex] < this.heap[smallerChildIndex]) break;
			else this._swap(currentIndex, smallerChildIndex);
			
			currentIndex = smallerChildIndex;
		}
	}
	
	printHeap() {
		console.log(this.heap);
	}
}

const minHeap = new MinHeap();
minHeap.insert(10);
minHeap.insert(4);
minHeap.insert(15);
minHeap.insert(20);
minHeap.insert(0);
minHeap.insert(30);
console.log("MinHeap after insertions:");
minHeap.printHeap();

console.log("Peek min:", minHeap.peek()); // 0

console.log("Extract min:", minHeap.extractMin()); // 0
console.log("MinHeap after extractMin:");
minHeap.printHeap();

console.log("Extract min:", minHeap.extractMin()); // 4
console.log("MinHeap after extractMin:");
minHeap.printHeap();

console.log("Building heap from array [5, 3, 8, 1, 9, 2]:");
const newHeap = new MinHeap();
newHeap.buildHeap([5, 3, 8, 1, 9, 2]);
newHeap.printHeap(); // Expected: [1, 3, 2, 5, 9, 8] or similar
console.log("Peek min from built heap:", newHeap.peek()); // 1


class PriorityQueue {
    constructor() {
        // The Priority Queue is composed of a MinHeap.
        // The heap will store elements and automatically keep the
        // one with the lowest value (highest priority) at the top.
        this._heap = new MinHeap();
    }

    /**
     * Adds an element to the queue. The value itself is the priority.
     * @param {*} item The item to enqueue.
     */
    enqueue(item) {
        this._heap.insert(item);
    }

    /**
     * Removes and returns the element with the highest priority (the minimum value).
     * @returns {*} The highest-priority item.
     */
    dequeue() {
        return this._heap.extractMin();
    }

    /**
     * Returns the element with the highest priority without removing it.
     * @returns {*} The highest-priority item.
     */
    peek() {
        return this._heap.peek();
    }

    /**
     * Checks if the queue is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this._heap.isEmpty();
    }

    /**
     * Gets the number of elements in the queue.
     * @returns {number}
     */
    size() {
        return this._heap.size();
    }
}

// Example Usage:
console.log("--- Priority Queue Example ---");
const emergencyRoom = new PriorityQueue();

// Patients arrive. The number represents the severity (lower is more urgent).
emergencyRoom.enqueue(5); // Minor injury
emergencyRoom.enqueue(2); // Severe cut
emergencyRoom.enqueue(1); // Heart attack
emergencyRoom.enqueue(4); // Broken bone

console.log("Next patient to see (peek):", emergencyRoom.peek()); // Expected: 1

console.log("Serving patient:", emergencyRoom.dequeue()); // Expected: 1
console.log("Next patient to see:", emergencyRoom.peek()); // Expected: 2

console.log("Serving patient:", emergencyRoom.dequeue()); // Expected: 2
console.log("Serving patient:", emergencyRoom.dequeue()); // Expected: 4
console.log("Serving patient:", emergencyRoom.dequeue()); // Expected: 5

console.log("Is the emergency room empty?", emergencyRoom.isEmpty()); // Expected: true


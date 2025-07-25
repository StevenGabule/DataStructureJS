class TreeNode {
	constructor(key) {
		this.key = key;
		this.left = null;
		this.right = null;
	}
}

class BinarySearchTree {
	constructor() {
		this.root = null;
	}
	
	insert(key) {
        const newNode = new TreeNode(key);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this._insertNode(this.root, newNode);
        }
    }
	
	 _insertNode(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this._insertNode(node.left, newNode);
            }
        } else if (newNode.key > node.key) { // Standard BSTs don't allow duplicates
            if (node.right === null) {
                node.right = newNode;
            } else {
                this._insertNode(node.right, newNode);
            }
        }
        // If newNode.key === node.key, we can choose to ignore, update, or throw error.
        // Here, we implicitly ignore duplicates by not having an 'else' for equality.
    }
	
	search(key) {
		return this._searchNode(this.root, key);
	}
	
	_searchNode(node, key) {
		if(node === null) return null;
		
		if(key < node.key) {
			return this._searchNode(node.left, key);
		} else if(key > node.key) {
			return this._searchNode(node.right, key);
		} else {
			return node; // key found!
		}
	}
	
	delete(key) {
		this.root = this._deleteNode(this.root, key);
	}
	
	_deleteNode(node, key) {
		if(node === null) return null;
		
		// navigate to the node to be deleted
		if(key < node.key) {
			node.left = this._deleteNode(node.left, key);
			return node;
		} else if(key > node.key) {
			node.right = this._deleteNode(node.right, key);
			return node;
		} else {
			// node with the key found
			
			// case 1: Node has no children (leaf node)
			if(node.left === null && node.right === null) {
				node = null;
				return node;
			}
			
			// case 2: Node has one child
			if(node.left === null) { // Has only right child
				node = node.right;
				return node;
			} else if(node.right === null) {
				node = node.left;
				return node;
			}
			
			// case 3: Node has two children
			// Find the in-order successor (smallest value in th right subtree)
			const successor = this._findMinNode(node.right);
			
			node.key = successor.key; // Replace node's key with successor's key
			
			// Delete the successor from the right subtree
			node.right = this._deleteNode(node.right, successor.key);
			
			return node;
		}
	}
	
    // Helper to find the minimum node in a subtree (used for deletion)
	_findMinNode(node) {
		if(node.left === null) {
			return node;
		}
		
		return this._findMinNode(node.left);
	}
	
	// Helper to find the maximum node in a subtree
	_findMaxNode(node) {
		if(node.right === null) return node;
		
		return this._findMaxNode(node.right)
	}
	
	findMin() {
		if(this.root === null) return null;
		return this._findMinNode(this.root).key;
	}
	
	findMax() {
		if(this.root === null) return null;
		return this._findMaxNode(this.root).key;
	}
	
    // --- TRAVERSALS ---
    // In-order: Left -> Root -> Right (visits nodes in ascending order)
	inOrderTraversal(cb) {
		this._inOrder(this.root, cb);
	}
	
	_inOrder(node, cb) {
		if(node !== null) {
			this._inOrder(node.left, cb);
			cb(node.key);
			this._inOrder(node.right, cb);
		}
	}
	
	// Pre-order: Root -> Left -> Right
	preOrderTraversal(cb) {
		this._preOrder(this.root, cb);
	}
	
	_preOrder(node, cb) {
		if(node !== null) {
			cb(node.key);
			this._preOrder(node.left, cb);
			this._preOrder(node.right, cb);
		}
	}

    // Post-order: Left -> Right -> Root
	postOrderTraversal(cb) {
		this._postOrder(this.root, cb)
	}
	
	_postOrder(node, cb) {
		if(node !== null) {
			this._postOrder(node.left, cb);
			this._postOrder(node.right, cb);
			cb(node.key);
		}
	}
	
	getRootNode() {
        return this.root;
    }

    isEmpty() {
        return this.root === null;
    }
}


// Example Usage:
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log("In-order traversal:");
const inOrderResult = [];
bst.inOrderTraversal(key => inOrderResult.push(key));
console.log(inOrderResult.join(' -> ')); // Output: 20 -> 30 -> 40 -> 50 -> 60 -> 70 -> 80

console.log("\nPre-order traversal:");
const preOrderResult = [];
bst.preOrderTraversal(key => preOrderResult.push(key));
console.log(preOrderResult.join(' -> ')); // Output: 50 -> 30 -> 20 -> 40 -> 70 -> 60 -> 80

console.log("\nPost-order traversal:");
const postOrderResult = [];
bst.postOrderTraversal(key => postOrderResult.push(key));
console.log(postOrderResult.join(' -> ')); // Output: 20 -> 40 -> 30 -> 60 -> 80 -> 70 -> 50

console.log("\nSearch for 40:", bst.search(40) ? bst.search(40).key : 'Not found'); // Output: 40
console.log("Search for 90:", bst.search(90) ? bst.search(90).key : 'Not found'); // Output: Not found

console.log("\nMinimum key:", bst.findMin()); // Output: 20
console.log("Maximum key:", bst.findMax()); // Output: 80

console.log("\nDeleting 20 (leaf node)...");
bst.delete(20);
bst.inOrderTraversal(key => console.log(key)); // 30, 40, 50, 60, 70, 80

console.log("\nDeleting 30 (node with one child)...");
bst.delete(30);
bst.inOrderTraversal(key => console.log(key)); // 40, 50, 60, 70, 80

console.log("\nDeleting 50 (node with two children)...");
bst.delete(50); // Successor is 60
bst.inOrderTraversal(key => console.log(key)); // 40, 60, 70, 80
console.log("New root:", bst.getRootNode().key); // Should be 60 if 50 was root and replaced by 60

// Search in a Binary Search Tree
var searchBST = function(root, val) {
	if(root === null || root.val === val) {
		return root;
	}
	
	if(val < root.val) {
		return searchBST(root.left, val);
	} else {
		return searchBST(root.right, val);
	}
}


var searchBSTIterative = function(root, val) {
    let currentNode = root;
    while (currentNode !== null && currentNode.val !== val) {
        if (val < currentNode.val) {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
    }
    return currentNode;
};


/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    const stack = [];
    let count = 0;
    let currentNode = root;

    while (currentNode !== null || stack.length > 0) {
        // Go as far left as possible
        while (currentNode !== null) {
            stack.push(currentNode);
            currentNode = currentNode.left;
        }

        // Process the node (this is the in-order part)
        currentNode = stack.pop();
        count++;
        if (count === k) {
            return currentNode.val;
        }

        // Move to the right subtree
        currentNode = currentNode.right;
    }
    return -1; // Should not happen if k is valid and tree has at least k nodes
};

// Recursive in-order traversal approach
var kthSmallestRecursive = function(root, k) {
    const result = [];
    function inOrder(node) {
        if (!node || result.length >= k) { // Optimization: stop if k elements found
            return;
        }
        inOrder(node.left);
        if (result.length < k) { // Add to result only if we haven't found k elements yet
            result.push(node.val);
        }
        if (result.length < k) { // Check again before traversing right
             inOrder(node.right);
        }
    }
    inOrder(root);
    return result[k - 1]; // k is 1-indexed
};

**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    if (!nums || nums.length === 0) {
        return null;
    }

    function buildBST(left, right) {
        if (left > right) {
            return null; // Base case: empty subarray
        }

        // Choose the middle element as the root
        // If even number of elements, either mid or mid-1 can be chosen.
        // Math.floor((left + right) / 2) or Math.ceil((left + right) / 2)
        const mid = Math.floor((left + right) / 2);
        const rootNode = new TreeNode(nums[mid]);

        // Recursively build left and right subtrees
        rootNode.left = buildBST(left, mid - 1);
        rootNode.right = buildBST(mid + 1, right);

        return rootNode;
    }

    return buildBST(0, nums.length - 1);
};

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    let currentNode = root;

    while (currentNode) {
        if (p.val < currentNode.val && q.val < currentNode.val) {
            // Both p and q are in the left subtree
            currentNode = currentNode.left;
        } else if (p.val > currentNode.val && q.val > currentNode.val) {
            // Both p and q are in the right subtree
            currentNode = currentNode.right;
        } else {
            // Found the split point, or one of p/q is the current node
            // This means currentNode is the LCA
            return currentNode;
        }
    }
    return null; // Should not be reached if p and q are in the BST
};

// Recursive version
var lowestCommonAncestorRecursive = function(root, p, q) {
    if (!root) return null;

    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestorRecursive(root.left, p, q);
    } else if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestorRecursive(root.right, p, q);
    } else {
        return root; // This is the LCA
    }
};








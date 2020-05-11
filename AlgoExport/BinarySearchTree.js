/*
def findClosestValueInBST(tree, target):
    return findClosestValueInBstHelper(tree, target, float("inf"))

def findClosestValueInBstHelper(tree, target, closest):
    if tree is None:
        return closest
    if abs(target - closest) > abs(target - tree.value):
        closest = tree.value
    if target < tree.value:
        return findClosestValueInBstHelper(tree.left, target, closest)
    elif target > tree.value:
        return findClosestValueInBstHelper(tree.right, target, closest)
    else:
        return closest;
 */

/* Generated from Java with JSweet 2.2.0-SNAPSHOT - http://www.jsweet.org */
var org;
(function (org) {
    var jsweet;
    (function (jsweet) {
        var Node = (function () {
            function Node(data) {
                if (this.data === undefined)
                    this.data = 0;

                if (this.parent === undefined)
                    this.parent = null;

                if (this.left === undefined)
                    this.left = null;

                if (this.right === undefined)
                    this.right = null;

                this.data = data;
                this.parent = null;
                this.left = null;
                this.right = null;
            }

            return Node;
        }());

        jsweet.Node = Node;
        Node["__class"] = "org.jsweet.Node";

        var BST = (function () {

            function BST() {
                if (this.root === undefined)
                    this.root = null;
                this.root = null;
            }

            BST.prototype.createSampleTree1 = function () {
                var node50 = new org.jsweet.Node(50);
                var node30 = new org.jsweet.Node(30);
                var node70 = new org.jsweet.Node(70);

                node30.parent = node50;
                node70.parent = node50;
                node50.left = node30;
                node50.right = node70;

                var node23 = new org.jsweet.Node(23);
                var node35 = new org.jsweet.Node(35);
                node23.parent = node30;
                node35.parent = node30;
                node30.left = node23;
                node30.right = node35;

                var node11 = new org.jsweet.Node(11);
                var node25 = new org.jsweet.Node(25);
                node11.parent = node23;
                node25.parent = node23;
                node23.left = node11;
                node23.right = node25;

                var node31 = new org.jsweet.Node(31);
                var node42 = new org.jsweet.Node(42);
                node31.parent = node35;
                node42.parent = node35;
                node35.left = node31;
                node35.right = node42;

                var node80 = new org.jsweet.Node(80);
                node80.parent = node70;
                node70.right = node80;

                var node73 = new org.jsweet.Node(73);
                var node85 = new org.jsweet.Node(85);
                node73.parent = node80;
                node85.parent = node80;
                node80.left = node73;
                node80.right = node85;
                this.root = node50;
            };

            BST.prototype.printHelper = function (currPtr, indent, last) {
                if (currPtr != null) {
                    console.info(indent);
                    if (last) {
                        console.info("R----");
                        indent += "     ";
                    } else {
                        console.info("L----");
                        indent += "|    ";
                    }
                    console.info(currPtr.data);
                    this.printHelper(currPtr.left, indent, false);
                    this.printHelper(currPtr.right, indent, true);
                }
            };

            BST.prototype.searchTreeHelper = function (node, key) {
                if (node == null || key === node.data) {
                    return node;
                }
                if (key < node.data) {
                    return this.searchTreeHelper(node.left, key);
                }
                return this.searchTreeHelper(node.right, key);
            };

            BST.prototype.deleteNodeHelper = function (node, key) {
                if (node == null)
                    return node;
                else if (key < node.data)
                    node.left = this.deleteNodeHelper(node.left, key);
                else if (key > node.data)
                    node.right = this.deleteNodeHelper(node.right, key);
                else {
                    if (node.left == null && node.right == null) {
                        node = null;
                    } else if (node.left == null) {
                        var temp = node;
                        node = node.right;
                    } else if (node.right == null) {
                        var temp = node;
                        node = node.left;
                    } else {
                        var temp = this.minimum(node.right);
                        node.data = temp.data;
                        node.right = this.deleteNodeHelper(node.right, temp.data);
                    }
                }
                return node;
            };

            BST.prototype.preOrderHelper = function (node) {
                if (node != null) {
                    console.info(node.data + " ");
                    this.preOrderHelper(node.left);
                    this.preOrderHelper(node.right);
                }
            };

            BST.prototype.inOrderHelper = function (node) {
                if (node != null) {
                    this.inOrderHelper(node.left);
                    console.info(node.data + " ");
                    this.inOrderHelper(node.right);
                }
            };

            BST.prototype.postOrderHelper = function (node) {
                if (node != null) {
                    this.postOrderHelper(node.left);
                    this.postOrderHelper(node.right);
                    console.info(node.data + " ");
                }
            };

            BST.prototype.preorder = function () {
                this.preOrderHelper(this.root);
            };

            BST.prototype.inorder = function () {
                this.inOrderHelper(this.root);
            };

            BST.prototype.postorder = function () {
                this.postOrderHelper(this.root);
            };

            BST.prototype.searchTree = function (k) {
                return this.searchTreeHelper(this.root, k);
            };

            BST.prototype.minimum = function (node) {
                while ((node.left != null)) {
                    {
                        node = node.left;
                    }
                }
                return node;
            };

            BST.prototype.maximum = function (node) {
                while ((node.right != null)) {
                    {
                        node = node.right;
                    }
                }
                return node;
            };

            BST.prototype.successor = function (x) {
                if (x.right != null) {
                    return this.minimum(x.right);
                }
                var y = x.parent;
                while ((y != null && x === y.right)) {
                    {
                        x = y;
                        y = y.parent;
                    }
                }
                return y;
            };

            BST.prototype.predecessor = function (x) {
                if (x.left != null) {
                    return this.maximum(x.left);
                }
                var y = x.parent;
                while ((y != null && x === y.left)) {
                    {
                        x = y;
                        y = y.parent;
                    }
                }
                return y;
            };

            BST.prototype.insert = function (key) {
                var node = new org.jsweet.Node(key);
                var y = null;
                var x = this.root;
                while ((x != null)) {
                    {
                        y = x;
                        if (node.data < x.data) {
                            x = x.left;
                        } else {
                            x = x.right;
                        }
                    }
                }
                node.parent = y;
                if (y == null) {
                    this.root = node;
                } else if (node.data < y.data) {
                    y.left = node;
                } else {
                    y.right = node;
                }
            };

            BST.prototype.deleteNode = function (data) {
                return this.deleteNodeHelper(this.root, data);
            };

            BST.prototype.prettyPrint = function () {
                this.printHelper(this.root, "", true);
            };

            BST.main = function (args) {
                var tree = new BST();
                tree.createSampleTree1();
                var n = tree.deleteNode(35);
                tree.prettyPrint();
            };
            return BST;
        }());
        jsweet.BST = BST;
        BST["__class"] = "org.jsweet.BST";
    })(jsweet = org.jsweet || (org.jsweet = {}));
})(org || (org = {}));
org.jsweet.BST.main(null);

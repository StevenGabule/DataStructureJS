function Stack() {
    this.dataStore = [];
    this.top = 0;
    this.push = push;
    this.pop = pop;
    this.peek = peek;
    this.clear = clear;
    this.length = length;
}

function push(element) {
    this.dataStore[this.top++] = element;
}

function pop() {
    return this.dataStore[--this.top];
}

function peek() {
    return this.dataStore[this.top - 1];
}

function length() {
    return this.top;
}

function clear() {
    this.top = 0;
}

/*
let s = new Stack();
s.push("David");
s.push("Raymond");
s.push("Bryan");
console.log(`length: ${s.length()}`);
console.log(s.peek());
let popped = s.pop();
console.log("The popped element is: " + popped);
console.log(s.peek());
s.push("Cynthia");
console.log(s.peek());
s.clear();
console.log("length: " + s.length());
console.log(s.peek());
s.push("Clayton");
console.log(s.peek());
*/

function mulBase(num, base) {
    let s = new Stack();
    do {
        s.push(num % base);
        num = Math.floor(num /= base);
    } while (num > 0);
    let converted = "";
    while (s.length() > 0) {
        converted += s.pop();
    }
    return converted;
}

/*
let num = 32, base = 2;
let newNum = mulBase(num, base);
console.log(num + " converted to base " + base + " is " + newNum);
num = 125;
base = 8;
let newNum1 = mulBase(num, base);
console.log(num + " converted to base " + base + " is " + newNum1);
*/

/* Determining if a string is a palindrome */
function isPalindrome(word) {
    let s = new Stack();
    let _ = word.length;
    for (let i = 0; i < _; ++i) {
        s.push(word[i]);
    }
    let rword = "";
    while (s.length() > 0) {
        rword += s.pop();
    }
    return word === rword;
}

let word = 'hello';
if (isPalindrome(word)) {
    console.log(word +  ' is a palindrome');
} else {
    console.log(word +  ' is not palindrome');
}

// word = 'racecar';
word = '1001';
if (isPalindrome(word)) {
    console.log(word +  ' is a palindrome');
} else {
    console.log(word +  ' is not palindrome');
}




















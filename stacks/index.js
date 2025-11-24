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

// function mulBase(num, base) {
//     let s = new Stack();
//     do {
//         s.push(num % base);
//         num = Math.floor(num /= base);
//     } while (num > 0);
//     let converted = "";
//     while (s.length() > 0) {
//         converted += s.pop();
//     }
//     return converted;
// }

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
// function isPalindrome(word) {
//     let s = new Stack();
//     let _ = word.length;
//     for (let i = 0; i < _; ++i) {
//         s.push(word[i]);
//     }
//     let rword = "";
//     while (s.length() > 0) {
//         rword += s.pop();
//     }
//     return word === rword;
// }

// let word = 'hello';
// if (isPalindrome(word)) {
//     console.log(word + ' is a palindrome');
// } else {
//     console.log(word + ' is not palindrome');
// }

// // word = 'racecar';
// word = '1001';
// if (isPalindrome(word)) {
//     console.log(word + ' is a palindrome');
// } else {
//     console.log(word + ' is not palindrome');
// }


// function checkPalindrome(text) {
// Issues with Current Code
// Extra memory allocation – split(''), reverse(), and join('') each create new arrays/strings
// Loose equality – using == instead of ===
// More complex than needed – slicing and reversing half the string is indirect
//     const textLength = text.length;
//     const halfLength = textLength / 2;
//     const halfString = text.slice(0, Math.floor(halfLength));
//     const secondHalfString =
//         text
//             .slice(Math.round(halfLength), textLength)
//             .split('')
//             .reverse()
//             .join('');
//     return halfString == secondHalfString;
// }

// Simple two-pointer approach (most efficient):
// This is O(n) time and O(1) space – no extra strings or arrays created, 
// and it exits early on the first mismatch.
function checkPalindrome(text) {
    const cleanString = text.toLowerCase().replace(/^[a-z0-9]/g, ''); // ignoring case and non-alphanumeric characters
    let pointLeft = 0;
    let pointRight = cleanString.length - 1;

    while (pointLeft < pointRight) {
        if (text[pointLeft] !== text[pointRight]) {
            return false;
        }
        pointLeft++;
        pointRight--;
    }

    return true;
}

// Concise one-liner (if brevity matters more than performance):
// function checkPalindrome(text) {
//     return text === [...text].reverse().join('')
// }

console.log(checkPalindrome('1000001')); // t
console.log(checkPalindrome('racecar')); // t
console.log(checkPalindrome('raceecar'));// t
console.log(checkPalindrome('111111')); // t
console.log(checkPalindrome('121131')); // f


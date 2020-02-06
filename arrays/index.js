let fruits = ['apple', 'banana'];
let newFruits = [...fruits, 'Cherry']; // fruits.slice(0) // [].concat(fruits)
// newFruits.push();
console.log(newFruits);

// get a random element from an array
let ages = [12, 32, 98, 45, 38, 76];
console.log(ages[Math.round(Math.random() * ages.length)]);

let ints_ = [1, 2, 3, 4, 5, 6];
let results = ints_.filter(el => el > 5).map(el => {
    ints_.splice(ints_.indexOf(el, 1));
    return el;
});

console.log(results);
console.log(ints_);

function remoteItems(arr, fn) {
    return arr.filter(fn).map(el => {
        arr.splice(arr.indexOf(el, 1));
        return el;
    })
}

let Result = remoteItems(ints_, num => num > 5);
console.log(Result);
console.log(ints_);

// fill array with values
let phoneNumber = '555-525-5252';
let newNumber = phoneNumber.split('').filter(num => num !== '-');
console.log(newNumber.fill('*', 0, 3).join(''));

// find certain element / index of array
let people = ['John', 'Mary', 'Joe', 'John'];
let result = people.findIndex(person => person === 'John');
console.log(result);

function findIndexAll(arr, value) {
    let indices = [];
    arr.forEach((el, i) => (el === value) && indices.push(i));
    return indices;
}

let Res = findIndexAll(people, 'John');
console.log(Res);

// make a range of numbers as an array
let range = Array.from({length: 10}, (value, index) => index + 1);
console.log(range);

// get only unique values in array
let usernames = ['Jeff', 'Doug', 'John', 'John'];
let newUsernames = usernames.filter((name, index, array) => array.indexOf(name) === index ? name : '');
console.log(newUsernames);

// use set to filter duplicate
let set = [...new Set(usernames)];
console.log(set);

// find the difference (non-shared items) between two arrays
let _arr1 = ['fred', 'doug', 'amy', 'amy'];
let _arr2 = ['fred', 'doug', 'joe'];
let _result = [...new Set(_arr1)].filter(el => !_arr2.includes(el));
console.log(_result);


// remove items from left right side of arrays
let nums = [23, 987, 45, 89];
let removeFromLeft = nums.slice(0, 3);
console.log(removeFromLeft);

let removeFromRight = nums.slice(1);
console.log(removeFromRight);
console.log(nums);

let getNthItem = (arr, num) => arr.slice(num - 1, num)[0];
console.log(getNthItem(nums, 3));

function offsetArray(arr, offset) {
    return [...arr.slice(offset), ...arr.slice(0, offset)]
}

console.log(offsetArray([1, 2, 3, 4], 2));

// find shared values between two arrays
let men = ['Jim', 'Doug', 'Fred', 'Dave'];
let over50 = ['Angie', 'Dave', 'Jessica', 'Jim'];
console.log(over50.filter(person => men.includes(person)));

// get last item in array, get everything before last item in array
let Name = ['Bill', 'Fried', 'doug', 'Jessica', 'Abe', 'John', 'Doe'];
console.log(Name[Name.length - 1]);
console.log(Name.slice(0, -1));

// return last item of array
let arr1 = [5, 6, 7, 8];
// arr1.pop();
// console.log(arr1);

const findLast = (arr, fn) =>  arr.filter(fn).pop();

console.log(findLast(arr1, el => el > 5));

let findLast_ = (arr, fn) => arr.filter(fn).pop();
console.log(findLast_(arr1, el => el > 4));
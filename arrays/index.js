var fruits = ['apple', 'banana'];
var newFruits = [...fruits, 'Cherry']; // fruits.slice(0) // [].concat(fruits)
// newFruits.push();
console.log(newFruits)

// get a random element from an array
var ages = [12,32,98,45,38,76];
ages[Math.round(Math.random() * ages.length)]

var ints = [1,2,3, 4,5,6];
// var result = ints.filter(el => el > 5).map(el => {
//     ints.splice(ints.indexOf(el, 1));
//     return el;
// });
// console.log(result)
// console.log(ints)

// function remoteItems(arr, fn) {
//     return arr.filter(fn).map(el => {
//         arr.splice(arr.indexOf(el, 1))
//         return el;
//     })
// }

// var result = remoteItems(ints, num => num > 5)
// console.log(result)
// console.log(ints)

// fill array with values
var phoneNumber = '555-525-5252';
var newNumber = phoneNumber.split('').filter(num => num !== '-');
console.log(newNumber.fill('*', 0,3).join(''))

// find certain element / index of array
var people = ['John', 'Mary', 'Joe', 'John'];
var result = people.findIndex(person => person === 'John');
console.log(result)

function findIndexAll(arr, value) {
    let indices = [];
    arr.forEach((el, i) => (el === value) && indices.push(i))
    return indices;
}

var res = findIndexAll(people, 'John')
console.log(res)

// make a range of numebrs as an array
// [1,2,3,4,5]
var range = Array.from({length: 10}, (value, index) => index + 1)
console.log(range)

// get only unique values in array
var usernames = ['Jeff', 'Doug', 'John', 'John'];
var newUsernames = usernames.filter((name, index, array) => array.indexOf(name) === index ? name : '');
console.log(newUsernames)

// use set to filter duplicate
var set = [...new Set(usernames)]
console.log(set)

// find the difference (non-shared items) between two arrays
var _arr1 = ['fred', 'doug', 'amy', 'amy'];
var _arr2 = ['fred', 'doug', 'joe']
var _result = [...new Set(_arr1)].filter(el => !_arr2.includes(el))
console.log(_result);


// remove items from left right side of arrays
var nums = [23, 987, 45, 89]
var removeFromLeft = nums.slice(0,3)
console.log(removeFromLeft)

var removeFromRight = nums.slice(1);
console.log(removeFromRight)

console.log(nums)

var getNthItem = (arr, num) => arr.slice(num-1, num)[0];
var res = getNthItem(nums, 3)
console.log(res)

function offsetArray(arr, offset) {
    return [...arr.slice(offset), ...arr.slice(0, offset)]
}

var result_ = offsetArray([1,2,3,4], 2);
console.log(result_)

// find shared values between two arrays
var men = ['Jim', 'Doug', 'Fred', 'Dave'];
var over50 = ['Angie', 'Dave', 'Jessica', 'Jim'];
var shared_ = over50.filter(person => men.includes(person));
console.log(shared_)

// get last item in array, get everything before last item in array
var names__ = ['Bill', 'Fried', 'doug', 'Jessica', 'Abe', 'John', 'Doe'];
var lastname = names__[names__.length - 1];
console.log(lastname)

var beforeLastName = names__.slice(0, -1);
console.log(beforeLastName)

// return last item of array
var arr1 = [5,6,7,8];
arr1.pop();
console.log(arr1)

function findLast(arr, fn) {
    return arr.filter(fn).pop();
}
console.log(findLast(arr1, el => el > 5))

var findLast_ = (arr, fn) => arr.filter(fn).pop();
console.log(findLast_(arr1, el => el > 4))
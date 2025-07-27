// Matrix - create a grid line
function gridLineMatrix(rows, cols, initialValue) {
  const gridLines = [];
  for (let i = 0; i < rows; i++) {
    const gridCols = [];
    for (let j = 0; j < cols; j++) {
      gridCols.push(initialValue)      
    }
    gridLines[i] = gridCols;
  }
  return gridLines;
}

// Searching for a value
let names = ['john', 'doe', 'janes', 'blue'];
let nameFind = 'blue';
let positionIn = names.indexOf(nameFind);
console.log(positionIn); // 3
console.log(positionIn !== -1); // true 

let nums = [2, 3, 4, 5];
let newNum = 1;
let N = nums.length; // 4

for (let i = N; i >= 0; --i) {
  nums[i] = nums[i - 1];
  console.log(nums[i])
}

nums[0] = newNum;
console.log(nums); // 1,2,3,4,5

function compare(num1, num2) {
  return num1 - num2;
}

let numArr = [3, 2, 100, 4, 200, 1];
console.log(numArr.sort(compare)); // [1, 2, 3, 4, 100, 200]

function squared(num) {
  console.log(num * num * num);
}

let numb = [1, 2, 3, 4, 5, 6, 7, 8];
numb.forEach(squared); // 1, 8, 27, 64, 125, 216, 343, 512

function isEven(num) {
  return num % 2 === 0
}

let nom = [2, 4, 6, 8, 10, 12, 11];
let even = nom.every(isEven);
if (even) {
  console.log('even numbers');
} else {
  console.log('not all numbers even');
}

nom = [1, 3, 5, 7, 9, 10];
let evenSome = nom.some(isEven);
if (evenSome) {
  console.log('some numbers are even')
} else {
  console.log('no numbers even')
}

function add(runningTotal, currentValue) {
  return runningTotal + currentValue;
}

console.log(nom.reduce(add));

function isOdd(num) {
  return num % 2 !== 0;
}

let nos = [];
for (let i = 0; i < 20; ++i) {
  nos[i] = i + 1;
}
let evens = nos.filter(isEven);
console.log("Even numbers:");
console.log(evens);

let odds = nos.filter(isOdd);
console.log("Odd numbers:");
console.log(odds);

function passing(num) {
  return num >= 60;
}

let grades = [];
for (let i = 0; i < 20; ++i) {
  grades[i] = Math.floor(Math.random() * 101);
}
let passGrades = grades.filter(passing);
console.log(grades); // [94, 41, 60, 9, 12, 22, 82, 22, 32, 2, 54, 97, 52, 65, 63, 27, 96, 36, 26, 72]
console.log(passGrades); // [94, 60, 82, 97, 65, 63, 96, 72]

Array.matrix = (numRows, numCols, initial) => {
  let arr = [];
  for (let i = 0; i < numRows; ++i) {
    let columns = [];
    for (let j = 0; j < numCols; ++j) {
      columns[j] = initial;
    }
    arr[i] = columns;
  }
  return arr;
};

let table = Array.matrix(5, 5, 0);
console.log(table[1], [1]);
let namesS = Array.matrix(3, 3, "");
namesS[1][2] = "Joe";
console.log(namesS[1][2]);

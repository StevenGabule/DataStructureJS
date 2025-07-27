/**
 * Create a grades object that stores a set of student grades in an object. Provide a
 * function for adding a grade and a function for displaying the student’s grade average.
 * Processing Two-Dimensional Array Elements
 */ 
// let grades = [
//   [89, 77, 78],
//   [76, 82, 81],
//   [91, 94, 89],
// ];

// for (let row = 0; row < grades.length; row++) {
//   let total = 0;
//   let average = 0.0;
//   for (let col = 0; col < grades[row].length; col++) {
//     total += grades[row][col];
//   }
//   average = total / grades[row].length;
//   console.log(`Student: ${parseInt(row + 1)} average: ${average.toFixed(2)}`);
//   // Student: 1 average: 81.33
//   // Student: 2 average: 79.67
//   // Student: 3 average: 91.33
// }

// A jagged array is an array where the rows in the array may have a different number of elements.
// let grades = [[89, 77], [76, 82, 81], [91, 94, 89, 99]];
// let totals = 0;
// let averages = 0.0;
// for (let row = 0; row < grades.length; ++row) {
//     for (let col = 0; col < grades[row].length; ++col) {
//         totals += grades[row][col]
//     }
//     averages = totals / grades[row].length;
//     console.log(`Student ${parseInt(row + 1)} average ${averages.toFixed(2)}`);
//     totals = 0;
//     averages = 0.0;
// }
/*Expected Output:
Student 1 average 83.00
Student 2 average 79.67
Student 3 average 93.25*/

// Arrays of Objects
function Point(x, y) {
  this.x = x;
  this.y = y;
}

function displayPoints(arr) {
  for (let i = 0; i < arr.length; ++i) {
    console.log(arr[i].x + ", " + arr[i].y);
  }
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 5);
const p3 = new Point(2, 8);
const p4 = new Point(4, 4);
const points = [p1, p2, p3, p4];
for (let i = 0; i < points.length; ++i) {
  console.log(`Point ${parseInt(i + 1)} : ${points[i].x}, ${points[i].y}`);
  // Point 1 : 1, 2
  // Point 2 : 3, 5
  // Point 3 : 2, 8
  // Point 4 : 4, 4
}
const p5 = new Point(12, -3);
points.push(p5);

console.log("After push: ");
displayPoints(points);

points.shift();
console.log("After shift: ");
displayPoints(points);
// EXPECTED OUTPUT:
// Point 1 : 1, 2
// Point 2 : 3, 5
// Point 3 : 2, 8
// Point 4 : 4, 4
// After push: 
// 1, 2
// 3, 5
// 2, 8
// 4, 4
// 12, -3
// After shift: 
// 3, 5
// 2, 8
// 4, 4
// 12, -3

// Arrays of Objects
class WeekTemps {
  dataStore;

  constructor() {
    this.dataStore = [];
  }

  add(temp) {
    this.dataStore.push(temp);
  }

  average() {
    let total = 0;
    for (let i = 0; i < this.dataStore.length; ++i) {
      total += this.dataStore[i];
    }
    return total / this.dataStore.length;
  }
}

const thisWeek = new WeekTemps();
thisWeek.add(52);
thisWeek.add(55);
thisWeek.add(61);
thisWeek.add(65);
thisWeek.add(55);
thisWeek.add(50);
thisWeek.add(52);
thisWeek.add(49);
console.log(thisWeek.average()); // displays 54.875
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Test_your_skills:_Object-oriented_JavaScript
// OOJS 1
class Shape {
  name;
  sides;
  sideLength;

  constructor(name, sides, sideLength) {
    this.name = name;
    this.sides = sides;
    this.sideLength = sideLength;
  }

  calcPerimeter() {
    console.log(`Square Perimeter: ${this.sideLength * this.sides}`);
  }
}

const square = new Shape('square', 4, 5);
square.calcPerimeter();

const triangle = new Shape('triangle', 3, 3);
triangle.calcPerimeter();


// OOJS 2
class Square extends Shape {
	sideLength;
	constructor(name, sides, sideLength) {
		super(name, sides)
		this.sideLength = sideLength;
	}
	calcArea() {
		console.log(this.sides * this.sideLength)
	}
}

const sq = new Square('Square', 4, 4)
sq.calcArea();
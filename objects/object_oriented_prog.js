class Person {
	name;

	constructor(name) {
		this.name = name;
	}

	introduceSelf() {
		console.log(`Hello, my name is ${this.name}`);
	}
}

class Professor extends Person {
	teach;
	constructor(name, teach) {
		super(name)
		this.teach = teach;
	}
	
	introduceSelf() {
		console.log(`My name is ${this.name} and I will be your ${this.teach}.`)
	}

	grade(paper) {
		console.log(Math.floor(Math.random() * (5 - 1) + 1))
	}
}

class Student extends Person {
	#year;

	constructor(name, year) {
		super(name);
		this.#year = year;
	}
	introduceSelf() {
		console.log(`My name is ${this.name} and I'm in the ${this.#year}.`)
	}
	canStudyArchery() { return this.#year > 1 }

	#somePrivateMethod() {
    console.log("You called me?");
  }
}


pratt = new Person("Pratt");
pratt.introduceSelf(); // 'My name is Pratt.'

walsh = new Professor("Walsh", "Psychology");
walsh.introduceSelf(); // 'My name is Professor Walsh and I will be your Psychology professor.'
walsh.grade('Dark Matter')

summers = new Student("Summers", 2);
summers.introduceSelf(); // 'My name is Summers and I'm in the first year.'
console.log(summers.canStudyArchery()); // true
// summers.#year; // SyntaxError
// summers.#somePrivateMethod()
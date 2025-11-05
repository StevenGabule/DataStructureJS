class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	greet() {
		return `Hello, my name is ${this.name}`;
	}
}

const alice = new Person('alice', 30);
// console.log(alice.greet()); // Hello, my name is alice
// console.log(Person.prototype.greet());
for (const key in alice) {
	console.log(key)
}

class Vehicle {
	constructor(brand) {
		this.brand = brand;
	}

	honk() {
		return "Beep!"
	}
}

class Car extends Vehicle {
	constructor(branch, model) {
		super(brand);
		this.model = model;
	}

	getDetails() {
		return `${this.brand} ${this.model}`
	}
}

const myCar = new Car("Toyota", "Corolla");
console.log(myCar.honk()); // "Beep!" 
console.log(myCar.getDetails()); // "Toyota Corolla"
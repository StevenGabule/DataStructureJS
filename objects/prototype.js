// Setting a prototype using Object.create
// Object.create()
//  method creates a new object and allows you to specify an
//  object that will be used as the new object's prototype.
const personPrototype = {
  greet() {
    console.log('hello!');
  },
};

// const carl = Object.create(personPrototype);
// carl.greet(); // hello!

const personPrototype1 = {
  greet() {
    console.log(`'hello, my name is ${this.name}'`);
  },
};

function Person(name) {
	this.name = name;
}

Object.assign(Person.prototype, personPrototype1);
const ben = new Person('Ben')
ben.greet();


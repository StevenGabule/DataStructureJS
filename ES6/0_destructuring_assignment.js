const user = { name: 'John', age: 30, email: 'email@some.com' };

// basic destructuring, renaming variables and default value 
const { name: personName, age: agePerson, email: someEmail, country = 'USA' } = user;

// Nested destructuring
const userProfile = {
	personal: { name: 'John', age: 30 },
	preferences: { theme: 'dark' }
}

const { personal: { name }, preferences: { theme } } = userProfile;

// array destructuring
const colors = ['red', 'green', 'blue']
const [primary, secondary, tertiary] = colors;
const [first, , third] = colors;

// React props destructuring (preview)
function Welcome({ name, age, isActive = false }) {
	return <h1>Hello ${name}, you are {age} years old</h1>;
}
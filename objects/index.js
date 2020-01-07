// var arr = [1,2,3];
// var obj = {a: 1, b:2, c:3, d:4}
// var _length = Object.keys(obj).length
// console.log(_length)


// iterating over an object
var username = {
    first: 'John', 
    last: 'Doe'
};

// for (let u in username) {
//     if (username.hasOwnProperty(u)) {
//         console.log(u, username[u])
//     }    
// }

// for(let u of Object.keys(username))
//     console.log(u, username[u])

// using Object.entries
// Object.entries(username);
// Object.entries(username).forEach(([key, value]) => console.log(key, value));

var person = { name: 'amy', age: 40};
var arr = [];
Object.keys(person).forEach(key => arr.push([key, person[key]]));
console.log(arr)

var _result = Object.keys(person).map(key => [key, person[key]]);
console.log(_result)
console.log(Object.entries(person))

// check if the property is in object
var user = {
    name: 'John',
    address: {
        street: 'Main',
        city: 'New York'
    }
};

var property = user.address.hasOwnProperty('street');
console.log(property)

var _user = {
    name: 'john',
    email: 'john@gmail.com'
};

// Object.getOwnPropertyDescriptors(user);

// merge multiple objects in one object
var defaultUser = {
    name: 'adasd',
    email: 'asdasd',
    subscribed: true
}

var actualUser = {
    name: 'Don',
    email: 'don@gmail.com'
}

// var userData = Object.assign(defaultUser, actualUser)
var userData = {...defaultUser, ...actualUser}
console.log(userData)


// compute a object
var state = {}
var onKeyUp = event => {
    var value = event.target.value;
    var name = event.target.name;
    state[name] = value;
}

// delete or filter property of object
var __name = {first: 'John', middle: 'Lim',last: 'Doe'};
function filterObj(obj, prop) {
    var filteredObj = {}
     Object.keys(obj).filter(k => k !== prop).map(key => filteredObj[key] = obj[key]);
    return filteredObj;
}

console.log(filterObj(__name, 'first'))

// get all values in Object
var userProp = {
    first: 'John',
    last: 'Doe',
    age: 23,
    phone: 2001293123
}
var values = Object.keys(userProp).map(key => userProp[key]);
console.log(values)
console.log(Object.values(values))

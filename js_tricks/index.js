// use IIFEs or block scope (w/ let / const) to hide / expose data
var getUserData = (() => {
    let name = "john doe"
    let email = "johndoe@gmail.com"
    let password = "asdasdasd"
    return { name, email}
})()

console.log(getUserData.email)

{
    let name = "john doe"
    let email = "johndoe@gmail.com"
    let password = "asdasdasd"
    let sayHi = () => `Hi ${name}`
    var result = {
        name, email, sayHi
    }
}

console.log(result.sayHi())


// array destructing to swap variables
const nums = [1,2,3,4.5];

const [one, two, three, decimal] = nums;

console.log(one)
console.log(two)

// using destructing to swap variables
var name = 'doug@gmail.com'
var email = 'john doug'
// first construct an array from which to destructure
// then rename the values
var [email, name] = [name, email] 
console.log(email)
console.log(name)
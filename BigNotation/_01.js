/*
O(1) does not change with respect to input space. Hence, O(1) is referred to as being
constant time. An example of an O(1) algorithm is accessing an item in the array by its
index. O(n) is linear time and applies to algorithms that must do n operations in the
worst-case scenario.
An example of an O(n) algorithm is printing numbers from 0 to n-1, as shown here:
* */

function exampleLinear(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += i;
    }
    return result;
}

/*
  Similarly, O(n2) is quadratic time, and O(n3) is cubic time.
  Examples of these complexities are shown here:
*/
function exampleQuadratic(n) {
    for (let i = 0; i < n; i++) {
        console.log(i);
        for (let j = 0; j < n; j++) {
            console.log(j);
        }
    }
}

function exampleCubic(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        console.log(i);
        for (let j = i; j < n; j++) {
            console.log(j);
            for (let k = j; j < n; j++) {
                console.log(k)
            }
        }
    }
}

function exampleLogarithm(n) {
    let result = 0;
    for (let i = 2; i <= n; i = i * 2) {
        result += i;
    }
    return result;
}

console.log(exampleLinear(10));
console.log(exampleLogarithm(1000000));
exampleCubic(10);

/*
* Implement the function unique_in_order which takes as argument a sequence and returns a list of items
* without any elements with the same value next to each other and preserving the original order of elements
*
* For example:
* uniqueInOrder('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']
* uniqueInOrder('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']
* uniqueInOrder([1,2,2,3,3])       == [1,2,3]
* */

function uniqueInOrder(iterable) {
    let _array = [];
    let temp;
    let _split = Array.isArray(iterable) ? iterable : iterable.split('');
    for (let i = 0; i < _split.length; i++) 
        temp = _split[i];
        if (temp !== _split[i+1]) _array.push(temp);
    return _array;
}

function uniqueInOrderSolution1(iterable) {
    return [...iterable].filter((v, i) => v !== iterable[i-1])
}

function uniqueInOrderSolution2(iterable) {
    return [].filter.call(iterable, (function (a, i) { return iterable[i - 1] !== a }));
}

var uniqueInOrderSolution3=function(iterable){
    var res = [];
    for (var i = 0; i < iterable.length; i++) {
        if (iterable[i] != iterable[i+1]) res.push(iterable[i]);
    }
    return res;
}

const uniqueInOrderSolution4 = d => [...d].filter((x, i, a) => x != a[i + 1])

console.log(uniqueInOrder('AAAABBBCCDAABBB'));
console.log(uniqueInOrder('ABBCcAD'));
console.log(uniqueInOrder([1,2,2,3,3]));

console.log(uniqueInOrderSolution1('AAAABBBCCDAABBB'));
console.log(uniqueInOrderSolution1('ABBCcAD'));
console.log(uniqueInOrderSolution1([1,2,2,3,3]));



function sequenceSum(begin, end, step) {
    if (begin > end) 
        return 0
    
    let sum = 0;
    // 1 5 1
   // sum = 2 i=4
   // sum = 6 i = 4 
    for (let i = begin; i <= end; i+= step) // i = 5
        sum +=i; // 15

    return sum;
}


/*function sequenceSum(begin, end, step) {
    if (begin > end) return 0;
    const count = Math.floor((end - begin) / step) + 1;
    console.log(count);
    return count * (begin + step * (count - 1) / 2);
}*/

console.log(sequenceSum(2, 6, 2), 12);
console.log(sequenceSum(1, 5, 1), 15);
console.log(sequenceSum(1, 5, 3), 5);
console.log(sequenceSum(5, 1, 3), 0);


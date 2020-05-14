let alphabets =  'abcdefghijklmnopqrstuvwxyz'.split("");
const isPangram  = (string) => alphabets.every(x => string.toLowerCase().includes(x));


function isPangram2(string) {
    return 'abcdefghijklmnopqrstuvwxyz'.split('').every((x) => string.indexOf(x) !== -1)
}

function isPangram3(string){
    return (string.match(/([a-z])(?!.*\1)/ig) || []).length === 26;
}


console.log(isPangram("the quick brown fox jumps over the lazy dog."));
console.log(isPangram("this is not a pangram."));

console.log(isPangram2("the quick brown fox jumps over the lazy dog."));
console.log(isPangram2("this is not a pangram."));


console.log(isPangram3("The quick brown fox jumps over the lazy dog."));
console.log(isPangram3("This is not a pangram."));

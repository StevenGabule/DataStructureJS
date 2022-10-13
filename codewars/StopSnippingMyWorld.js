/*
* Write a function that takes in a string of one or more words, and returns the same string, 
* but with all five or more
* letter words reversed (Just like the name of this Kata). 
* Strings passed in will consist of only
* letters and spaces. Spaces will be included only when more than one word is present.

Examples:
* spinWords( "Hey fellow warriors" ) => returns "Hey wollef sroirraw"
* spinWords( "This is a test") => returns "This is a test"
* spinWords( "This is another test" )=> returns "This is rehtona test"
* */

function spinWords(str) {
    let words = str.split(' ');
    let array_words = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].length >= 5) {
            let rev = words[i].split('').reverse();
            array_words.push(rev.join(''))
        } else {
            array_words.push(words[i])
        }
    }
    return array_words.join(' ')
}

//  return [...iterable].filter((v, i) => v !== iterable[i-1])
function spinWords1(str) {
    return [...str.split(' ')].map((v, i) => v.length >= 5 ?  v.split("").reverse().join('') : v).join(' ');
}

function spinWords2(string){
    return string.replace(/\w{5,}/g, w =>  w.split('').reverse().join(''))
}

console.log(spinWords1("Welcome world"));
console.log(spinWords2("Welcome world"));
console.log(spinWords2("Hey fellow warriors"));
console.log(spinWords1("This is a test"));
console.log(spinWords1("This is another test"));
console.log(spinWords1("You are almost to the last test"));
console.log(spinWords1("Just kidding there is still one more"));
console.log(spinWords1("Seriously this is the last one"));
/*console.log(spinWords("Welcome world"));
console.log(spinWords("Hey fellow warriors"));
console.log(spinWords("This is a test"));
console.log(spinWords("This is another test"));
console.log(spinWords("You are almost to the last test"));
console.log(spinWords("Just kidding there is still one more"));
console.log(spinWords("Seriously this is the last one"));*/

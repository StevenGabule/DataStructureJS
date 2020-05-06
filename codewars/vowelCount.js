/*
* Return the number (count) of vowels in the given string.
* We will consider a, e, i, o, and u as vowels for this Kata.
* The input string will only consist of lower case letters and/or spaces.
* */
function getCount(str) {
    let vowelsCount = 0;
    for (let i = 0; i < str.length; i++) {
        if ((/^[aeiou]/i).test(str[i])) {
            vowelsCount++;
        }
    }
    return vowelsCount;
}

function getCountVowel(str) {
    let vowelsCount = 0;
    str.split('').map((v, i) => (/^[aeiou]/i).test(str[i]) ? vowelsCount++ : '');
    return vowelsCount;
}

function getCountVowelSol1(str) {
    return (str.match(/[aeiou]/ig)||[]).length;
}

console.log(getCount("abracadabra"));
console.log(getCountVowel("abracadabra"));
console.log(getCountVowelSol1("abracadabra"));

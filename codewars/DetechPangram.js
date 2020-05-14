/*
    A pangram is a sentence that contains every single letter of the alphabet at least once.
    For example, the sentence "The quick brown fox jumps over the lazy dog" is a pangram,
    because it uses the letters A-Z at least once (case is irrelevant).

    Given a string, detect whether or not it is a pangram.
    Return True if it is, False
    if not. Ignore numbers and punctuation.

    TEST CASES:
    var string = "The quick brown fox jumps over the lazy dog."
    Test.assertEquals(isPangram(string), true)
    var string = "This is not a pangram."
    Test.assertEquals(isPangram(string), false)
* */

// Create a hash table to mark the
// characters present in the string
// By default all the elements of
// mark would be false.
/* let nums = {};
    for (let i = 0; i < arr.length; i++) {
        let potential = targetSum - arr[i];
        console.log(`${targetSum+ " - "+arr[i]}`);
        if (potential in nums) {
            return [potential, arr[i]]
        }
        nums[arr[i]] = true;
        console.log(nums[arr[i]]);
    }
    return []*/
function isPangram(string) {
    let mark = {};
    let index = 0;
    let des = true;

    let letters = string.split('')
        .filter(v => v !== ' ')
        .filter(d => String(d) !== '.');
    let alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for (let i = 0; i < letters.length; i++) {
        console.log(alpha.indexOf(letters[i].toLowerCase()) !== -1);
        des = alpha.indexOf(letters[i].toLowerCase()) !== -1;
        mark[letters[i]] = des;
    }

    for (let i = 0; i <= index; i++) {
        if (mark[letters[i]] === false) {
            return false;
        }
    }

    return true;
}

console.log(isPangram("the quick brown fox jumps over the lazy dog."));
console.log(isPangram("this is not a pangram."));

const string = "this is not a pangram.";
let letters = string.split('')
    .filter(v => v !== ' ')
    .filter(d => String(d) !== '.');
console.log("letter", letters.indexOf('k') !== -1);

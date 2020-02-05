console.log(/abc/.test('abcde'));
console.log(/[0123456789]/.test("in 2020"));
console.log(/[0-9]/.test("in 1992"));

let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("30-01-2003 15:20"));
console.log(dateTime.test("30-jan-2003 15:20"));

let notBinary = /[^01]/;
console.log(notBinary.test("1100100010100110"));
console.log(notBinary.test("1100100010200110"));

console.log(/'\d+'/.test("'123'"));
console.log(/'\d+'/.test("''"));
console.log(/'\d*'/.test("'123'"));
console.log(/'\d*'/.test("''"));

let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
console.log(neighbor.test("neighbor"));


let dateTime1 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime1.test("30-1-2003 8:45"));

let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));

let match = /\d+/.exec("one two 100");
console.log(match);
console.log(match.index);
console.log("one two 100".match(/\d+/));

let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
console.log(/bad(ly)?/.exec("bad"));
console.log(/(\d)+/.exec("123"));

function findDate(string) {
    let datetime = /(\d{1,2})-(\d{1,2})-(\d{4})/;
    let match = datetime.exec(string);
    return new Date(Number(match[3]), Number(match[2]), Number(match[1]));
}
console.log(findDate("30-1-2003"));

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
console.log(animalCount.test("15 pigchickens"));


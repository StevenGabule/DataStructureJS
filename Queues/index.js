function Queue() {
    this.dataStore = [];
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.front = front;
    this.back = back;
    this.toString = toString;
    this.empty = empty;
}

function enqueue(element) {
    return this.dataStore.push(element);
}

function dequeue() {
    return this.dataStore.shift();
}

function front() {
    return this.dataStore[0];
}

function back() {
    return this.dataStore[this.dataStore.length - 1];
}

function toString() {
    let retStr = "";
    for (let i = 0; i < this.dataStore.length; ++i) {
        retStr += this.dataStore[i] + "\n";
    }
    return retStr;
}

function empty() {
    return this.dataStore.length === 0;
}

function count() {
    return this.dataStore.length;
}

/*let q = new Queue();
q.enqueue("Meredith");
q.enqueue("Cynthia");
q.enqueue("Jennifer");
console.log(q.toString());
q.dequeue();
console.log(q.toString());
console.log("Front of queue: " + q.front());
console.log("Back of queue: " + q.back());*/

// Using the Queue Class: Assigning Partners at a Square Dance
function Dancer(name, sex) {
    this.name = name;
    this.sex = sex;
}

function getDancers(males, females) {
    let names = read("dancers.txt").split("\n");
    for (let i = 0; i < names.length; ++i) {
        names[i] = names[i].trim();
    }
    for (let i = 0; i < names.length; ++i) {
        let dancer = names[i].split(" ");
        let sex = dancer[0];
        let name = dancer[1];
        if (sex === "F") {
            females.enqueue(new Dancer(name, sex));
        } else {
            male.enqueue(new Dancer(name, sex));
        }
    }
}

function dance(males, females) {
    console.log("The dance partners are: \n");
    while (!females.empty() && !males.empty()) {
        person = females.dequeue();
        putstr("Female dancer is: " + person.name);
        person = males.dequeue();
        console.log(" and the male dancer is: " + person.name);
    }
    console.log();
}


let maleDancers = new Queue();
let femaleDancers = new Queue();
getDancers(maleDancers, femaleDancers);
dance(maleDancers, femaleDancers);
if (!femaleDancers.empty()) {
    console.log(femaleDancers.front().name + " is waiting to dance.");
}
if (!maleDancers.empty()) {
    console.log(maleDancers.front().name + " is waiting to dance.");
}
































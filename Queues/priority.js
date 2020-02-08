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
    let priority = this.dataStore[0].code;
    for (let i = 1; i < this.dataStore.length; ++i) {
        if (this.dataStore[i].code < priority) {
            priority = i;
        }
    }
    return this.dataStore.splice(priority, 1);
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
        retStr += this.dataStore[i].name + " code: " + this.dataStore[i].code + "\n";
    }
    return retStr;
}

function empty() {
    return this.dataStore.length === 0;
}

function count() {
    return this.dataStore.length;
}

function Patient(name, code) {
    this.name = name;
    this.code = code;
}

let p = new Patient("Smith", 5);
let ed = new Queue();
ed.enqueue(p);
p = new Patient("Jones", 4);
ed.enqueue(p);
p = new Patient("Fehrenbach", 6);
ed.enqueue(p);
p = new Patient("Brown", 1);
ed.enqueue(p);
p = new Patient("Ingram", 1);
ed.enqueue(p);

console.log(ed.toString());
let seen = ed.dequeue();
console.log("Patient being treated: " + seen[0].name);
console.log("Patients waiting to be seen: ");
console.log(ed.toString());

let seen1 = ed.dequeue();
console.log("Patient being treated: " + seen1[0].name);
console.log("Patients waiting to be seen1: ");
console.log(ed.toString());

let seen2 = ed.dequeue();
console.log("Patient being treated: " + seen2[0].name);
console.log("Patients waiting to be seen: ");
console.log(ed.toString());
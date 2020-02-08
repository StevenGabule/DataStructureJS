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

function distribute(nums, queues, n, digit) {
    // digit represents either the 1s
    // or 10s place
    for (let i = 0; i < n; ++i) {
        if (digit === 1) {
            queues[nums[i] % 10].enqueue(nums[i]);
        } else {
            queues[Math.floor(nums[i] / 10)].enqueue(nums[i]);
        }
    }
}

function collect(queues, nums) {
    let i = 0;
    for (let digit = 0; digit < 10; ++digit) {
        while (!queues[digit].empty()) {
            nums[i++] = queues[digit].dequeue();
        }
    }
}

function dispArray(arr) {
    let num = "";
    for (let i = 0; i < arr.length; ++i) {
        num += arr[i] + " ";
    }
    console.log(num);
}

let queues = [];
for (let i = 0; i < 10; ++i) {
    queues[i] = new Queue();
}
let nums = [];
for (let i = 0; i < 10; ++i) {
    nums[i] = Math.floor(Math.floor(Math.random() * 101));
}
console.log("Before radix sort: ");

dispArray(nums);
distribute(nums, queues, 10, 1);

collect(queues, nums);
distribute(nums, queues, 10, 10);
collect(queues, nums);

console.log("\n\nAfter radix sort: ");
dispArray(nums);

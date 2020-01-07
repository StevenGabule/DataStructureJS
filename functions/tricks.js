// Debounce function
// a function that, when called, can only be called after a certain amount of time has passed
var debounce = (fn, ms) => {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(), ms)
    }
};

var onResize = () => {
    console.log(window.innerHeight, window.innerWidth);
};

// window.addEventListener('resize', debounce(onResize, 500));


// function that can be called only once
var once = (fn, ...args) => {
    let called = false;
    return function() {
        if (!called) {
            called = true;
            return fn(...args)
        }
    }
};
var onClick = (text, time) => console.log(`${text} at ${time}`);
var button = document.querySelector('button');
button.addEventListener('click', once(onClick, 'form Submitted?!', new Date(Date.now())));


// measure time it takes function to run
var getUserData = async (user) => await fetch(`https://api.github.com/users/${user}`);
var time = (fn, ...args) => {
    console.time('time');
    let result = fn(...args);
    console.timeEnd('time');
    return result;
};
time(() => getUserData('wesbos'));

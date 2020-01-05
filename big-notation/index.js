function linear(n) {
    for(var i = 0; i < n; i++) {
        console.log(i);
    }
}

function Quadratic(n) {
    for(var i = 0; i < n; i++) {
        console.log(i);
        for(var j = i; j < n; j++) {
            console.log(j);
        }
    }
}

function Cubic(n) {
    for(var i = 0; i < n; i++) {
        console.log(i)
        for(var j = i; j < n; j++) {
            console.log(j);
            for(var k = j; j < n; j++) {
                console.log(k);
            }
        }
    }
}

function Logarithmetic(n) {
    for(var i = 2; i <= n;i=i*2) {
        console.log(i);
    }
}

Logarithmetic(1000000);





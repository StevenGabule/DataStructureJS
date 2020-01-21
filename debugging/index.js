function canYouSpotTheProblem() {
    "use strict";
    for(var counter = 0; counter < 10; counter++){
        console.log(counter)
    }
}

// canYouSpotTheProblem()

function numberToString(n, base) { 
    var result = "", sign = ""; 
    if (n < 0) { 
        sign = "-"; 
        n = -n; 
    } 
    do { 
        result = String(n % base) + result; 
        n /= base; 
    } while (n > 0); 
    return sign + result; 
} 
console.log(numberToString(13, 10)); 

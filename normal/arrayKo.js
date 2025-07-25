function ArrayChallenge(arr) {
    let maxElement = Math.max(...arr);
    let startIndex = arr.indexOf(maxElement);
    let n = arr.length;
    
    let queue = [[startIndex, 0]]; 
    let visited = new Set([startIndex]);
    
    while (queue.length > 0) {
        let [currentIndex, jumps] = queue.shift();
        
        if (jumps > 0 && currentIndex === startIndex) {
            return jumps;
        }
        
        let jumpValue = arr[currentIndex];
        let rightIndex = (currentIndex + jumpValue) % n;
        let leftIndex = (currentIndex - jumpValue + n) % n;

        if (!visited.has(rightIndex) || rightIndex === startIndex) {
            visited.add(rightIndex);
            queue.push([rightIndex, jumps + 1]);
        }
        
        if (!visited.has(leftIndex) || leftIndex === startIndex) {
            visited.add(leftIndex);
            queue.push([leftIndex, jumps + 1]);
        }
    }
    
    return -1;
}

   
// keep this function call here 
console.log(ArrayChallenge([1,2,3,4,2])); // instead of 3 it got 4 which wrong result
/*
PYTHON 3 EXAMPLE CODE
* # O(n^2) time | O(1) space
def twoNumberSum(array, targetSum) :
    for i in range(len(array) - 1):
        firstNum = array[i]
        for j in range(i+1, len(array)) :
            secondNum = array[j]
            if firstNum + secondNum == targetSum:
                return [firstNum, secondNum]
    return []



# O(nLog(n) | O(1) space
def twoNumberSumLastSolution(array, targetSum) :
     array.sort()
    left = 0
    right = len(array) - 1
    while left < right:
        currentSum = array[left] + array[right]
        if currentSum == targetSum:
            return [array[left], array[right]]
        elif currentSum < targetSum:
            left +=1
        elif currentSum > targetSum:
            right -=1
    return []
    print(twoNumberSumHash([3,5,-4,8,11,1,-1,6], 10))

# O(n) time | O(n) space
def twoNumberSumHash(array, targetSum) :
    nums = {}
    for num in array:
        potentialMatch = targetSum - num
        if potentialMatch in nums:
            return [potentialMatch, num]
        nums[num] = True
    return []
**/

function twoNumberSum(arr, targetSum) {
    let nums = {};
    for (let i = 0; i < arr.length; i++) {
        let potential = targetSum - arr[i];
        console.log(`${targetSum+ " - "+arr[i]}`);
        if (potential in nums) {
            return [potential, arr[i]]
        }
        nums[arr[i]] = true;
        console.log(nums[arr[i]]);
    }
    return []
}

console.log(twoNumberSum([3,5,-4,8,11,1,-1,6], 10));
console.log(twoNumberSum([3,5,-4,8,11,1,-1,6], 13));
console.log(twoNumberSum([3,5,-4,8,11,1,-1,6], -1));

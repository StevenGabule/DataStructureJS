/**
 * Helper function swaps two elements in an array
 * Takes the array and two indices as parameters
 * Stores the first element in a temporary variable
 * Replaces the first element with the second
 * Replaces the second element with the temporary (original first) value
 */
function swap(arr, first, second) {
    const temp = arr[first];
    arr[first] = arr[second];
    arr[second] = temp;
}

/**
    - Uses the last element (`arr[high]`) as the pivot
    - Maintains index `i` as the boundary between elements smaller than pivot and those greater/equal
    - Iterates through the array from `low` to `high-1`
    - When it finds an element smaller than pivot:
        - Increments `i` 
        - Swaps that element to the "smaller" section
    - After the loop, swaps the pivot to its correct position (index `i+1`)
    - Returns the final pivot position
 */
function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            ++i;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

function quickSort(arr, low, high) {
    if (low < high) {
        let p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}

let a = [10, 4, 5, 7, 12, 8, 13, 20, 4, 1, 4, 2, 3];
quickSort(a, 0, a.length - 1);
console.log(a.join(' ')); // 1 2 3 4 4 4 5 7 8 10 12 13 20
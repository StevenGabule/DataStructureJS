let pivot = arr[high]; // Choose the last element as pivot
let i = low - 1; // Index of smaller element

```

The partition process:
- Uses the last element (`arr[high]`) as the pivot
- Maintains index `i` as the boundary between elements smaller than pivot and those greater/equal
- Iterates through the array from `low` to `high-1`
- When it finds an element smaller than pivot:
  - Increments `i`
  - Swaps that element to the "smaller" section
- After the loop, swaps the pivot to its correct position (index `i+1`)
- Returns the final pivot position

**Example walkthrough** with `[10, 4, 5, 7, 12, 8, 13, 20, 4, 1, 4, 2, 3]`:
- Pivot = 3 (last element)
- Elements < 3: get moved to the left
- Final: `[1, 2, 3, ...]` with 3 at index 2

### 3. `quickSort(arr, low, high)`
The main recursive function:
- **Base case**: If `low >= high`, the subarray has 0 or 1 element (already sorted)
- **Recursive case**:
  1. Partition the array and get pivot's final position
  2. Recursively sort left subarray (elements before pivot)
  3. Recursively sort right subarray (elements after pivot)

## How QuickSort Works

The algorithm follows a divide-and-conquer strategy:

1. **Choose a pivot** - This implementation uses the last element
2. **Partition** - Rearrange so elements smaller than pivot are on left, larger on right
3. **Recursively sort** - Apply same process to left and right subarrays

## Time Complexity
- **Best/Average case**: O(n log n) - when pivot divides array roughly in half
- **Worst case**: O(n²) - when pivot is always the smallest or largest element (creating unbalanced partitions)
- **Space complexity**: O(log n) for recursive call stack

## Running the Code

The example sorts `[10, 4, 5, 7, 12, 8, 13, 20, 4, 1, 4, 2, 3]` and outputs:
```

[1, 2, 3, 4, 4, 4, 5, 7, 8, 10, 12, 13, 20]

```

## Visual Trace (First Few Steps)
```

Initial: [10, 4, 5, 7, 12, 8, 13, 20, 4, 1, 4, 2, 3]

Step 1: Partition with pivot=3
[1, 2, 3, | 7, 12, 8, 13, 20, 4, 10, 4, 4, 5]
^pivot position

Step 2: Recursively sort [1, 2] and [7, 12, 8, 13, 20, 4, 10, 4, 4, 5]
...continues recursively

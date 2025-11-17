// Part 1: Foundational Concepts
// 1.1 Pure Functions
// Pure functions are the building blocks of FP. They always return the same output for the same input 
// and have no side effects.

// impure function - modifies external state
let globalCounter = 0;
function impureIncrement(value) {
	globalCounter++;
	return value + globalCounter;
}

// Pure function - no side effects
function pureIncrement(value, counter) {
	return value + counter; // only depends on parameters
}

// Why this design matters:
// 1. Predictability: pureIncrement(5, 3) will ALWAYS return 8
// 2. Testability: No need to set up external state for testing
// 3. Parallelization: Can be safely executed in parallel
// 4. Memoization: Results can be cached since same input = same output
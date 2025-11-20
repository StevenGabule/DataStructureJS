// ============================================
// CONTINUATION MONAD - Advanced Control Flow
// ============================================

class Cont {
	constructor(computation) {
		this.computation = computation;
	}

	static of(value) {
		return new Cont(cont => cont(value));
	}

	map(fn) {
		return new Cont(cont =>
			this.computation(value => cont(fn(value)))
		);
	}

	flatMap(fn) {
		return new Cont(cont =>
			this.computation(value =>
				fn(value).computation(cont)
			)
		);
	}

	run(cont = x => x) {
		return this.computation(cont);
	}

	// Call with current continuation
	static callCC(fn) {
		return new Cont(cont => {
			const escape = value => new Cont(() => cont(value));
			return fn(escape).computation(cont);
		});
	}
}

// ============================================
// REAL-WORLD: ASYNC FLOW CONTROL
// ============================================

// Convert promises to continuations
const fromPromise = (promise) => new Cont(cont => {
	promise.then(cont).catch(err => cont({ error: err }));
});

// Early exit pattern
const validateAndProcess = (data) => {
	return Cont.callCC(exit => {
		// Validation
		if (!data.id) {
			return exit({ error: 'Missing ID' });
		}

		if (data.amount < 0) {
			return exit({ error: 'Invalid amount' });
		}

		// Processing
		return Cont.of(data)
			.map(d => ({ ...d, validated: true }))
			.map(d => ({ ...d, processed: Date.now() }));
	});
};

// Backtracking search
const findPath = (maze, start, end) => {
	const search = (current, visited) => {
		if (current.x === end.x && current.y === end.y) {
			return Cont.of([current]);
		}

		const neighbors = getNeighbors(maze, current);
		const unvisited = neighbors.filter(n =>
			!visited.some(v => v.x === n.x && v.y === n.y)
		);

		if (unvisited.length === 0) {
			return Cont.of(null); // Dead end
		}

		return Cont.callCC(exit => {
			for (const neighbor of unvisited) {
				const path = search(neighbor, [...visited, current]).run();
				if (path) {
					return exit([current, ...path]);
				}
			}
			return Cont.of(null);
		});
	};

	return search(start, []);
};

// ============================================
// COROUTINES WITH CONTINUATIONS
// ============================================

class Coroutine {
	constructor(generator) {
		this.generator = generator;
	}

	static create(generatorFn) {
		return new Coroutine(generatorFn());
	}

	resume(value) {
		return new Cont(cont => {
			const { value: yieldedValue, done } = this.generator.next(value);

			if (done) {
				return cont({ done: true, value: yieldedValue });
			}

			return cont({
				done: false,
				value: yieldedValue,
				resume: (input) => this.resume(input)
			});
		});
	}

	static async(generatorFn) {
		return (...args) => new Cont(async (cont) => {
			const generator = generatorFn(...args);
			let result = generator.next();

			while (!result.done) {
				try {
					const value = await Promise.resolve(result.value);
					result = generator.next(value);
				} catch (error) {
					result = generator.throw(error);
				}
			}

			return cont(result.value);
		});
	}
}

// Example: Cooperative multitasking
function* task1() {
	console.log('Task 1: Starting');
	yield 'Task 1: Step 1';
	yield 'Task 1: Step 2';
	console.log('Task 1: Completed');
	return 'Task 1 Result';
}

function* task2() {
	console.log('Task 2: Starting');
	yield 'Task 2: Step 1';
	yield 'Task 2: Step 2';
	yield 'Task 2: Step 3';
	console.log('Task 2: Completed');
	return 'Task 2 Result';
}

// Scheduler using continuations
class Scheduler {
	constructor() {
		this.tasks = [];
	}

	addTask(coroutine) {
		this.tasks.push(coroutine);
		return this;
	}

	run() {
		return new Cont(cont => {
			const results = [];
			let currentIndex = 0;

			const step = () => {
				if (this.tasks.length === 0) {
					return cont(results);
				}

				const task = this.tasks[currentIndex];
				const result = task.resume().run();

				if (result.done) {
					results.push(result.value);
					this.tasks.splice(currentIndex, 1);
					if (currentIndex >= this.tasks.length) {
						currentIndex = 0;
					}
				} else {
					console.log(`Yielded: ${result.value}`);
					this.tasks[currentIndex] = { resume: result.resume };
					currentIndex = (currentIndex + 1) % this.tasks.length;
				}

				if (this.tasks.length > 0) {
					setImmediate(step);
				} else {
					cont(results);
				}
			};

			step();
		});
	}
}
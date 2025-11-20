// ============================================
// FUNCTIONAL REACTIVE PROGRAMMING
// ============================================

class Observable {
	constructor(subscribe) {
		this._subscribe = subscribe;
	}

	subscribe(observer) {
		const subscription = this._subscribe(observer);
		return subscription || (() => { });
	}

	// Functor map
	map(fn) {
		return new Observable(observer => {
			return this.subscribe({
				next: value => observer.next(fn(value)),
				error: err => observer.error(err),
				complete: () => observer.complete()
			});
		});
	}

	// Monadic flatMap
	flatMap(fn) {
		return new Observable(observer => {
			const subscriptions = [];
			let completed = false;
			let activeCount = 0;

			const checkComplete = () => {
				if (completed && activeCount === 0) {
					observer.complete();
				}
			};

			const mainSub = this.subscribe({
				next: value => {
					activeCount++;
					const innerObs = fn(value);
					const innerSub = innerObs.subscribe({
						next: innerValue => observer.next(innerValue),
						error: err => observer.error(err),
						complete: () => {
							activeCount--;
							checkComplete();
						}
					});
					subscriptions.push(innerSub);
				},
				error: err => observer.error(err),
				complete: () => {
					completed = true;
					checkComplete();
				}
			});

			return () => {
				mainSub();
				subscriptions.forEach(sub => sub());
			};
		});
	}

	// Filter
	filter(predicate) {
		return new Observable(observer => {
			return this.subscribe({
				next: value => {
					if (predicate(value)) {
						observer.next(value);
					}
				},
				error: err => observer.error(err),
				complete: () => observer.complete()
			});
		});
	}

	// Scan (like reduce but emits intermediate values)
	scan(fn, initial) {
		return new Observable(observer => {
			let acc = initial;
			return this.subscribe({
				next: value => {
					acc = fn(acc, value);
					observer.next(acc);
				},
				error: err => observer.error(err),
				complete: () => observer.complete()
			});
		});
	}

	// Combine latest values from multiple observables
	static combineLatest(...observables) {
		return new Observable(observer => {
			const values = new Array(observables.length);
			const hasValue = new Array(observables.length).fill(false);
			let completed = 0;

			const subscriptions = observables.map((obs, i) =>
				obs.subscribe({
					next: value => {
						values[i] = value;
						hasValue[i] = true;

						if (hasValue.every(Boolean)) {
							observer.next([...values]);
						}
					},
					error: err => observer.error(err),
					complete: () => {
						completed++;
						if (completed === observables.length) {
							observer.complete();
						}
					}
				})
			);

			return () => subscriptions.forEach(sub => sub());
		});
	}

	// Merge multiple observables
	static merge(...observables) {
		return new Observable(observer => {
			let completed = 0;

			const subscriptions = observables.map(obs =>
				obs.subscribe({
					next: value => observer.next(value),
					error: err => observer.error(err),
					complete: () => {
						completed++;
						if (completed === observables.length) {
							observer.complete();
						}
					}
				})
			);

			return () => subscriptions.forEach(sub => sub());
		});
	}

	// Debounce
	debounce(delay) {
		return new Observable(observer => {
			let timeoutId;

			const subscription = this.subscribe({
				next: value => {
					clearTimeout(timeoutId);
					timeoutId = setTimeout(() => {
						observer.next(value);
					}, delay);
				},
				error: err => observer.error(err),
				complete: () => {
					clearTimeout(timeoutId);
					observer.complete();
				}
			});

			return () => {
				clearTimeout(timeoutId);
				subscription();
			};
		});
	}

	// Throttle
	throttle(delay) {
		return new Observable(observer => {
			let lastEmit = 0;

			return this.subscribe({
				next: value => {
					const now = Date.now();
					if (now - lastEmit >= delay) {
						lastEmit = now;
						observer.next(value);
					}
				},
				error: err => observer.error(err),
				complete: () => observer.complete()
			});
		});
	}
}

// ============================================
// EVENT STREAM ABSTRACTION
// ============================================

class EventStream {
	static fromEvent(element, eventName) {
		return new Observable(observer => {
			const handler = event => observer.next(event);
			element.addEventListener(eventName, handler);

			return () => {
				element.removeEventListener(eventName, handler);
			};
		});
	}

	static fromPromise(promise) {
		return new Observable(observer => {
			promise
				.then(value => {
					observer.next(value);
					observer.complete();
				})
				.catch(err => observer.error(err));

			return () => { }; // Promises can't be cancelled
		});
	}

	static interval(ms) {
		return new Observable(observer => {
			let count = 0;
			const intervalId = setInterval(() => {
				observer.next(count++);
			}, ms);

			return () => clearInterval(intervalId);
		});
	}

	static fromArray(array) {
		return new Observable(observer => {
			array.forEach(value => observer.next(value));
			observer.complete();
			return () => { };
		});
	}
}

// ============================================
// REAL-WORLD: AUTOCOMPLETE WITH FRP
// ============================================

class Autocomplete {
	constructor(inputElement, searchFn) {
		this.inputElement = inputElement;
		this.searchFn = searchFn;
		this.setupStream();
	}

	setupStream() {
		// Create event stream from input
		const inputStream = EventStream.fromEvent(this.inputElement, 'input')
			.map(event => event.target.value)
			.filter(value => value.length >= 2)  // Min 2 characters
			.debounce(300)  // Wait 300ms after typing stops
			.distinctUntilChanged();  // Only if value changed

		// Search stream
		const searchStream = inputStream
			.flatMap(query => {
				// Return observable from search
				return EventStream.fromPromise(
					this.searchFn(query)
						.then(results => ({ query, results, loading: false }))
						.catch(error => ({ query, error, loading: false }))
				);
			})
			.startWith({ results: [], loading: false });

		// Loading indicator stream
		const loadingStream = Observable.merge(
			inputStream.map(() => ({ loading: true })),
			searchStream
		);

		// Subscribe to render results
		loadingStream.subscribe({
			next: state => this.render(state),
			error: err => console.error('Autocomplete error:', err)
		});
	}

	render(state) {
		if (state.loading) {
			this.showLoading();
		} else if (state.error) {
			this.showError(state.error);
		} else if (state.results) {
			this.showResults(state.results);
		}
	}

	showLoading() {
		console.log('Loading...');
	}

	showError(error) {
		console.error('Search error:', error);
	}

	showResults(results) {
		console.log('Results:', results);
	}
}

// Custom operators
Observable.prototype.distinctUntilChanged = function () {
	return new Observable(observer => {
		let lastValue;
		let hasValue = false;

		return this.subscribe({
			next: value => {
				if (!hasValue || value !== lastValue) {
					hasValue = true;
					lastValue = value;
					observer.next(value);
				}
			},
			error: err => observer.error(err),
			complete: () => observer.complete()
		});
	});
};

Observable.prototype.startWith = function (initial) {
	return new Observable(observer => {
		observer.next(initial);
		return this.subscribe(observer);
	});
};

// ============================================
// BEHAVIOR AND SIGNAL ABSTRACTION
// ============================================

class Behavior {
	constructor(initial, stream) {
		this.value = initial;
		this.stream = stream;
		this.subscription = null;

		// Auto-update value
		this.subscription = stream.subscribe({
			next: value => this.value = value
		});
	}

	get() {
		return this.value;
	}

	map(fn) {
		return new Behavior(
			fn(this.value),
			this.stream.map(fn)
		);
	}

	sample() {
		return this.value;
	}

	dispose() {
		if (this.subscription) {
			this.subscription();
		}
	}
}

class Signal {
	constructor(valueFn) {
		this.valueFn = valueFn;
		this.observers = new Set();
	}

	get() {
		return this.valueFn();
	}

	map(fn) {
		return new Signal(() => fn(this.get()));
	}

	subscribe(observer) {
		this.observers.add(observer);
		return () => this.observers.delete(observer);
	}

	notify() {
		const value = this.get();
		this.observers.forEach(observer => observer(value));
	}
}

// ============================================
// FRP GAME LOOP
// ============================================

class GameLoop {
	constructor() {
		this.frameStream = this.createFrameStream();
		this.inputStream = this.createInputStream();
		this.gameState = this.createGameState();
	}

	createFrameStream() {
		return new Observable(observer => {
			let animationId;
			let lastTime = 0;

			const frame = (timestamp) => {
				const deltaTime = timestamp - lastTime;
				lastTime = timestamp;

				observer.next({ timestamp, deltaTime });
				animationId = requestAnimationFrame(frame);
			};

			animationId = requestAnimationFrame(frame);

			return () => cancelAnimationFrame(animationId);
		});
	}

	createInputStream() {
		const keydown = EventStream.fromEvent(document, 'keydown');
		const keyup = EventStream.fromEvent(document, 'keyup');
		const mouseMove = EventStream.fromEvent(document, 'mousemove');

		return Observable.merge(
			keydown.map(e => ({ type: 'keydown', key: e.key })),
			keyup.map(e => ({ type: 'keyup', key: e.key })),
			mouseMove.map(e => ({ type: 'mousemove', x: e.clientX, y: e.clientY }))
		);
	}

	createGameState() {
		// Combine frame and input streams
		return Observable.combineLatest(
			this.frameStream,
			this.inputStream.startWith({ type: 'none' })
		).scan((state, [frame, input]) => {
			// Update game state based on frame and input
			return {
				...state,
				time: frame.timestamp,
				deltaTime: frame.deltaTime,
				lastInput: input,
				// Update game logic here
			};
		}, {
			time: 0,
			deltaTime: 0,
			lastInput: null,
			// Initial game state
		});
	}

	start(renderFn) {
		return this.gameState.subscribe({
			next: state => renderFn(state),
			error: err => console.error('Game loop error:', err)
		});
	}
}
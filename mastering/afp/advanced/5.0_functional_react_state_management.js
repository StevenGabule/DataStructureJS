// Part 5: Real-World Application
// Complete Example: Functional React State Management
// Here's a comprehensive example combining all concepts into a
// real-world state management solution:

// Functional state management system inspired by redux but purely functional
class FunctionalStore {
	constructor(initialState, reducer) {
		this._state = initialState;
		this._reducer = reducer;
		this._subscribers = new Set();
		this._middleware = [];
		this._history = [initialState];
		this._historyIndex = 0;
	}

	// Pure function to compute next state
	dispatch(action) {
		// Apply middleware pipeline
		const processedAction = this._middleware.reduce(
			(acc, middleware) => middleware(this._state)(acc),
			action
		);

		// Compute new state
		const newState = this._reducer(this._state, processedAction);

		// Update if changed (referential equality check)
		if (newState !== this._state) {
			this._state = newState;

			// Maintain history for time-travel
			this._history = [
				...this._history.slice(0, this._historyIndex + 1),
				newState
			];
			this._historyIndex++;

			// Notify subscribers
			this._subscribers.forEach(subscriber => subscriber(newState));
		}

		return newState;
	}

	subscribe(fn) {
		this._subscribers.add(fn);
		return () => this._subscribers.delete(fn); // unsubscribe function
	}

	addMiddleware(middleware) {
		this._middleware = middleware;
		return this;
	}

	timeTravel(steps) {
		const newIndex = Math.max(
			0,
			Math.min(this._history.length - 1, this._historyIndex + steps)
		);

		if (newIndex !== this._historyIndex) {
			this._historyIndex = newIndex;
			this._state = this._history[newIndex];
			this._subscribers.forEach(subscriber => subscriber(this._state));
		}
	}

	getState() {
		return this._state;
	}
}

// Action creators using discriminated unions pattern
const ActionTypes = {
	ADD_TODO: 'ADD_TODO',
	TOGGLE_TODO: 'TOGGLE_TODO',
	SET_FILTER: 'SET_FILTER',
}

const createAction = type => payload => ({ type, payload });

const addTodo = createAction(ActionTypes.ADD_TODO);
const toggleTodo = createAction(ActionTypes.TOGGLE_TODO);
const setFilter = createAction(ActionTypes.SET_FILTER);

// Pure reducer with deep immutability
const todoReducer = (state, action) => {
	// Use pattern matching-like structure
	const reducers = {
		[ActionTypes.ADD_TODO]: (state, payload) => ({
			...state,
			todos: [
				...state.todos,
				{
					id: crypto.randomUUID(),
					text: payload.text,
					completed: false,
					createdAt: new Date().toISOString()
				}
			]
		}),
		[ActionTypes.TOGGLE_TODO]: (state, payload) => ({
			...state,
			todos: state.todos.map(
				todo => todo.id === payload.id
					? { ...todo, completed: !todo.completed }
					: todo
			)
		}),
		[ActionTypes.SET_FILTER]: (state, payload) => ({
			...state,
			filter: payload.filter
		})
	};

	const reducer = reducers[action.type];
	return reducer ? reducer(state, action.payload) : state;
}

// Middleware for logging (pure function returning pure function)
const loggingMiddleware = (state) => action => {
	console.log('Previous State:', state);
	console.log('Action:', action);
	return action;
}

// Middleware for validation
const validationMiddleware = state => action => {
	if (action.type === ActionTypes.ADD_TODO && !action.payload?.text) {
		console.error('Invalid todo: missing text');
		return { type: 'NOOP' };
	}

	return action;
}

// Selectors using memoization
const memoize = (fn) => {
	let lastArgs;
	let lastResult;

	return (...args) => {
		if (!lastArgs || !args.every((arg, i) => arg === lastArgs[i])) {
			lastArgs = args;
			lastResult = fn(...args);
		}
		return lastResult;
	};
};

const getVisibleTodos = memoize((todos, filter) => {
	switch (filter) {
		case 'COMPLETED':
			return todos.filter(todo => todo.completed)
		case 'ACTIVE':
			return todos.filter(todo => !todo.completed)
		default:
			return todos;
	}
})

// Initialize store
const initialState = {
	todos: [],
	filter: 'ALL'
}

const store =
	new FunctionalStore(initialState, todoReducer)
		.addMiddleware(loggingMiddleware)
		.addMiddleware(validationMiddleware);

// usage
store.subscribe(state => {
	console.log('State updated:', state);
	const visibleTodos = getVisibleTodos(state.todos, state.filter);
	console.log('Visible todos: ', visibleTodos)
});

store.dispatch(addTodo({ text: 'Learn FP' }));
store.dispatch(addTodo({ text: 'Build awesome apps' }));
store.dispatch(toggleTodo({ id: store.getState().todos[0].id }));
store.dispatch(setFilter({ filter: 'ACTIVE' }));

// Time travel debugging
store.timeTravel(-1); // go back one step
store.timeTravel(1) // go forward one step

// Why this complete design:
// 1. Predictability: State changes only through pure reducer
// 2. Debugging: Time-travel, logging, state inspection
// 3. Testability: Pure functions throughout, easy to test
// 4. Modularity: Middleware, selectors, reducers all composable
// 5. Performance: Memoization, immutability enables optimizations
// 6. Maintainability: Clear separation of concerns, functional patterns




// ============================================
// REDUX-STYLE STATE MANAGEMENT WITH HOFs
// ============================================

// HOF: Create reducer enhancer
const createReducerEnhancer = (enhancerFn) => {
	return (reducer) => {
		return (state, action) => {
			return enhancerFn(reducer, state, action);
		}
	}
}

// Undo/Redo enhancer
const undoable = (reducer) => {
	return (state = { past: [], present: reducer(undefined, {}), future: [] }, action) => {
		const { past, present, future } = state;
		switch (action.type) {
			case 'UNDO':
				if (past.length === 0) return state;
				const previous = past[past.length - 1];
				const newPast = past.slice(0, past.length - 1);
				return {
					past: newPast,
					present: previous,
					future: [present, ...future]
				}
			case 'REDO':
				if (future.length === 0) return state;
				const next = future[0];
				const newFuture = future.slice(1);
				return {
					past: [...past, present],
					present: next,
					future: newFuture
				}
			case 'RESET':
				return {
					past: [],
					present: reducer(undefined, {}),
					future: []
				}
			default:
				const newPresent = reducer(present, action);
				if (present === newPresent) return state;
				return {
					past: [...past, present],
					present: newPresent,
					future: []
				}
		}
	}
}

// HOF: Create middleware
const createMiddleware = (middlewareFn) => {
	return store => next => action => {
		return middlewareFn(store, next, action)
	}
}

// Logging middleware
const logger = createMiddleware((store, next, action) => {
	console.group(action.type);
	console.log('Previous state: ', store.getState());
	console.log('Action:', action);

	const result = next(action);

	console.log('Next State:', store.getState());
	console.groupEnd();

	return result;
});

const thunk = createMiddleware((store, next, action) => {
	if (typeof action === 'function') {
		return action(store.dispatch, store.getState);
	}

	return next(action);
});

// Validation middleware
const validator = createMiddleware((store, next, action) => {
	if (!action.type) {
		throw new Error('Action must have a type property')
	}

	if (typeof action.type !== 'string') {
		throw new Error('Action type must be a string');
	}

	return next(action);
});

// HOF: Create action creator
const createActionCreator = (type, payloadCreator) => {
	const actionCreator = (...args) => {
		const action = {};

		if (payloadCreator) {
			action.payload = payloadCreator(...args);
		}

		return action;
	}

	actionCreator.type = type;
	actionCreator.toString = () => type;

	return actionCreator;
}

// HOF: Create async action creator
const createAsyncActionCreator = (type, asyncFn) => {
	const pending = createActionCreator(`${type}_PENDING`);
	const fulfilled = createActionCreator(`${type}_FULFILLED`, payload => payload);
	const rejected = createActionCreator(`${type}_REJECTED`, error => error);

	const asyncActionCreator = (...args) => {
		return async (dispatch, getState) => {
			dispatch(pending());

			try {
				const result = await asyncFn(...args, getState);
				dispatch(fulfilled(result));
				return result;
			} catch (error) {
				dispatch(rejected(error))
				throw error;
			}
		}
	};

	asyncActionCreator.pending = pending;
	asyncActionCreator.fulfilled = fulfilled;
	asyncActionCreator.rejected = rejected;

	return asyncActionCreator;
}

// HOF: Create selector with memoization
const createSelector = (...args) => {
	const selectors = args.slice(0, -1);
	const resultFunc = args[args.length - 1];

	let lastInputs;
	let lastResult;

	return (state) => {
		const inputs = selectors.map(selector => selector(state));
		if (!lastInputs || !inputs.every((input, i) => input === lastInputs[i])) {
			lastInputs = inputs;
			lastResult = resultFunc(...inputs);
		}

		return lastResult;
	};
};

// Example usage
const fetchUser = createAsyncActionCreator(
	'FETCH_USER',
	async (userId) => {
		const response = await fetch(`/api/users/${userId}`);
		return response.json();
	}
);

const selectUsers = state => state.users;
const selectFilter = state => state.filter;

const selectFilteredUsers = createSelector(
	selectUsers,
	selectFilter,
	(users, filter) => {
		return users.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))
	}
);

// Store implementation with HOF middleware application
class Store {
	constructor(reducer, initialState = undefined) {
		this.reducer = reducer;
		this.state = reducer(initialState, { type: '@@INIT' });
		this.subscribers = [];
		this.middleware = [];
	}

	applyMiddleware(...middleware) {
		this.middleware = middleware;
		return this;
	}

	dispatch(action) {
		// Create middleware chain
		const chain = this.middleware.map(m => m(this));
		const dispatch = chain.reduceRight((next, middleware) => middleware(next), this.baseDispatch.bind(this));

		return dispatch(action);
	}

	baseDispatch(action) {
		this.state = this.reducer(this.state, action);
		this.subscribers.forEach(subscriber => subscriber(this.state));
		return action;
	}

	getState() {
		return this.state;
	}

	subscribe(fn) {
		this.subscribers.push(fn);
		return () => {
			this.subscribers = this.subscribers.filter(sub => sub !== fn);
		}
	}
}

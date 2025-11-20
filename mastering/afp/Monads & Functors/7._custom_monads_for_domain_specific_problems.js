// ============================================
// RESULT MONAD - Better Error Handling
// ============================================

class Result {
	constructor(value, isOk = true) {
		this._value = value;
		this._isOk = isOk;
	}

	static ok(value) {
		return new Result(value, true);
	}

	static err(error) {
		return new Result(error, false);
	}

	isOk() {
		return this._isOk;
	}

	isErr() {
		return !this._isOk;
	}

	map(fn) {
		return this._isOk ? Result.ok(fn(this._value)) : this;
	}

	mapErr(fn) {
		return this._isOk ? this : Result.err(fn(this._value));
	}

	flatMap(fn) {
		return this._isOk ? fn(this._value) : this;
	}

	recover(fn) {
		return this._isOk ? this : fn(this._value);
	}

	unwrap() {
		if (this._isOk) {
			return this._value;
		}
		throw new Error(`Called unwrap on an Err value: ${this._value}`);
	}

	unwrapOr(defaultValue) {
		return this._isOk ? this._value : defaultValue;
	}

	match(patterns) {
		return this._isOk
			? patterns.ok(this._value)
			: patterns.err(this._value);
	}
}

// ============================================
// ASYNC RESULT MONAD - Async Error Handling
// ============================================

class AsyncResult {
	constructor(promise) {
		this.promise = promise;
	}

	static of(value) {
		return new AsyncResult(Promise.resolve(Result.ok(value)));
	}

	static fromPromise(promise) {
		return new AsyncResult(
			promise
				.then(value => Result.ok(value))
				.catch(error => Result.err(error))
		);
	}

	map(fn) {
		return new AsyncResult(
			this.promise.then(result => result.map(fn))
		);
	}

	flatMap(fn) {
		return new AsyncResult(
			this.promise.then(result => {
				if (result.isOk()) {
					return fn(result.unwrap()).promise;
				}
				return result;
			})
		);
	}

	mapErr(fn) {
		return new AsyncResult(
			this.promise.then(result => result.mapErr(fn))
		);
	}

	recover(fn) {
		return new AsyncResult(
			this.promise.then(result => {
				if (result.isErr()) {
					return fn(result._value).promise;
				}
				return result;
			})
		);
	}

	async run() {
		return this.promise;
	}
}

// Real-world usage: API client with error handling
class APIClient {
	static async fetchUser(id) {
		return AsyncResult.fromPromise(
			fetch(`/api/users/${id}`)
		)
			.flatMap(response => {
				if (!response.ok) {
					return new AsyncResult(
						Promise.resolve(Result.err(`HTTP ${response.status}`))
					);
				}
				return AsyncResult.fromPromise(response.json());
			})
			.map(user => ({
				...user,
				fetchedAt: Date.now()
			}))
			.mapErr(error => ({
				message: 'Failed to fetch user',
				originalError: error,
				timestamp: Date.now()
			}));
	}

	static async updateUser(id, updates) {
		return AsyncResult.fromPromise(
			fetch(`/api/users/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates)
			})
		)
			.flatMap(response =>
				AsyncResult.fromPromise(response.json())
			)
			.recover(error => {
				// Try alternative endpoint
				return AsyncResult.fromPromise(
					fetch(`/api/v2/users/${id}`, {
						method: 'PATCH',
						body: JSON.stringify(updates)
					})
				);
			});
	}
}

// Usage with pattern matching
APIClient.fetchUser(123)
	.run()
	.then(result =>
		result.match({
			ok: user => console.log('User:', user),
			err: error => console.error('Error:', error)
		})
	);

// ============================================
// FREE MONAD - Building DSLs
// ============================================

class Free {
	static pure(value) {
		return new Pure(value);
	}

	static lift(functor) {
		return new Suspend(functor);
	}

	flatMap(fn) {
		return new FlatMap(this, fn);
	}

	map(fn) {
		return this.flatMap(x => Free.pure(fn(x)));
	}
}

class Pure extends Free {
	constructor(value) {
		super();
		this.value = value;
	}
}

class Suspend extends Free {
	constructor(functor) {
		super();
		this.functor = functor;
	}
}

class FlatMap extends Free {
	constructor(free, fn) {
		super();
		this.free = free;
		this.fn = fn;
	}
}

// DSL for database operations
class DatabaseOp {
	static select(table, conditions) {
		return Free.lift({ type: 'SELECT', table, conditions });
	}

	static insert(table, data) {
		return Free.lift({ type: 'INSERT', table, data });
	}

	static update(table, id, data) {
		return Free.lift({ type: 'UPDATE', table, id, data });
	}

	static delete(table, id) {
		return Free.lift({ type: 'DELETE', table, id });
	}

	static transaction(operations) {
		return Free.lift({ type: 'TRANSACTION', operations });
	}
}

// Build complex database operations
const createUserWithProfile = (userData, profileData) => {
	return DatabaseOp.transaction([
		DatabaseOp.insert('users', userData)
			.flatMap(userId =>
				DatabaseOp.insert('profiles', {
					...profileData,
					userId
				})
			),
		DatabaseOp.select('users', { email: userData.email })
	]);
};

// Interpreter for the DSL
const interpretDatabase = (program, connection) => {
	if (program instanceof Pure) {
		return Promise.resolve(program.value);
	}

	if (program instanceof Suspend) {
		const op = program.functor;
		switch (op.type) {
			case 'SELECT':
				return connection.query(
					`SELECT * FROM ${op.table} WHERE ?`,
					op.conditions
				);
			case 'INSERT':
				return connection.query(
					`INSERT INTO ${op.table} SET ?`,
					op.data
				);
			// ... other operations
		}
	}

	if (program instanceof FlatMap) {
		return interpretDatabase(program.free, connection)
			.then(value =>
				interpretDatabase(program.fn(value), connection)
			);
	}
};
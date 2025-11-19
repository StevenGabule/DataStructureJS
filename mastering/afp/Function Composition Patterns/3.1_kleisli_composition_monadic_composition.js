// ============================================
// KLEISLI COMPOSITION FOR MONADIC VALUES
// ============================================
// Generic Kleisli composition
const kleisli = (Monad) => {
	return (...fns) => {
		return (value) => {
			return fns.reduce(
				(acc, fn) => acc.flatMap(fn),
				Modal.of(value)
			);
		};
	};
};

// Task Monad for async composition
class Task {
	constructor(computation) {
		this.computation = computation;
	}

	static of(value) {
		return new Task((resolve) => resolve(value))
	}

	static rejected(error) {
		return new Task((_, reject) => reject(error));
	}

	map(fn) {
		return new Task((resolve, reject) => {
			this.computation(
				value => resolve(fn(value)),
				reject
			);
		});
	}

	flatMap(fn) {
		return new Task((resolve, reject) => {
			this.computation(
				value => fn(value).computation(resolve, reject),
				reject
			)
		})
	}

	fork(onError, onSuccess) {
		return this.computation(onSuccess, onError);
	}
}


// Create Kleisli composition for tasks
const composeK = kleisli(Task);

// Real-world example: User authentication flow
const validateCredentials = (credentials) => {
	return new Task((resolve, reject) => {
		if (credentials.username && credentials.password) {
			resolve(credentials);
		} else {
			reject(new Error('Invalid credentials'));
		}
	});
};

const authenticateUser = (credentials) => {
	return new Task((resolve, reject) => {
		// Simulate API call
		setTimeout(() => {
			if (credentials.username === 'admin') {
				resolve({ userId: '123', token: 'abc-token' });
			} else {
				reject(new Error('Authentication failed.'));
			}
		}, 1000);
	});
};

const fetchUserProfile = (authData) => {
	return new Task((resolve, reject) => {
		// Simulate API call
		setTimeout(() => {
			resolve({
				...authData,
				profile: {
					name: 'John Doe',
					email: 'john@example.com'
				}
			});
		}, 500);
	});
}

const loadUserPreferences = (userData) => {
	return new Task((resolve, reject) => {
		// Simulate API call
		setTimeout(() => {
			resolve({
				...userData,
				preferences: {
					theme: 'dark',
					language: 'en'
				}
			})
		}, 300)
	});
};

const loginUser = composeK(
	validateCredentials,
	authenticateUser,
	fetchUserProfile,
	loadUserPreferences
);

// Usage
loginUser({ username: 'admin', password: 'secret' }).fork(
	error => console.error(`Login failed: ${error}`),
	result => console.log(`Login successful: ${result}`),
);
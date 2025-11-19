// ============================================
// COMPOSABLE API REQUEST SYSTEM
// ============================================

class APIRequestBuilder {
	// HOF: Create request interceptor
	static createInterceptor(type, fn) {
		return { type, execute: fn }
	}

	// HOF: Create request transformer
	static withTransform(transformFn) {
		return (requestFn) => {
			return async (...args) => {
				const response = await requestFn(...args);
				return transformFn(response);
			}
		}
	}

	// HOF: add caching
	static withCache(ttl = 60000) {
		const cache = new Map();

		return (requestFn) => {
			return async (...args) => {
				const key = JSON.stringify(args);
				const cached = cache.get(key);

				if (cached && Date.now() - cached.timestamp < ttl) {
					console.log('Cache hit:', key);
					return cached.data;
				}

				const data = await requestFn(...args);
				cache.set(key, { data, timestamp: Date.now() })

				// Clean old entries
				for (const [k, v] of cache.entries()) {
					if (Date.now() - v.timestamp > ttl) {
						cache.delete(k);
					}
				}

				return data;
			}
		}
	}

	// HOF: Add rate limiting
	static withRateLimit(maxRequests, windowMs) {
		const requests = [];

		return (requestFn) => {
			return async (...args) => {
				const now = Date.now();

				// Clean old requests
				const cutoff = now - windowMs;

				while (requests.length > 0 && requests[0] < cutoff) {
					requests.shift();
				}

				if (requests.length >= maxRequests) {
					const waitTime = windowMs - (now - requests[0]);
					throw new Error(`Rate limit exceeded. Try again in ${waitTime}ms`)
				}

				requests.push(now);
				return await requestFn(...args);
			}
		}
	}

	// HOF: Add automatic retry with exponential backoff
	static withRetry(maxRetries = 3, baseDelay = 1000) {
		return (requestFn) => {
			return async (...args) => {
				let lastError;

				for (let i = 0; i < maxRetries; i++) {
					try {
						return await requestFn(...args)
					} catch (error) {
						lastError = error;

						if (error.status >= 400 && error.status < 500) {
							throw error;
						}

						const delay = baseDelay * Math.pow(2, i);
						console.log(`Reply ${i + 1}/${maxRetries} after ${delay}ms`);
						await new Promise(resolve => setTimeout(resolve, delay));
					}
				}

				throw lastError;
			}
		}
	}

	// HOF: Add request/response logging
	static withLogging(logger = console.log) {
		return (requestFn) => {
			return async (...args) => {
				const requestId = Math.random().toString(36).substr(2, 9);
				const startTime = performance.now();

				logger({
					type: 'request',
					requestId,
					args,
					timestamp: new Date().toISOString()
				});

				try {
					const response = await requestFn(...args);
					const duration = performance.now() - startTime;

					logger({
						type: 'response',
						requestId,
						duration: `${duration.toFixed(2)}ms`,
						status: 'success'
					});

					return response;
				} catch (error) {
					const duration = performance.now() - startTime;

					logger({
						type: 'response',
						requestId,
						duration: `${duration.toFixed(2)}ms`,
						status: 'error',
						error: error.message
					})

					throw error;
				}
			}
		}
	}
}

// Create composable API client
const createAPIClient = (baseURL) => {
	const request = async (method, endpoint, options = {}) => {
		const response = await fetch(`${baseURL}${endpoint}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
			error.status = response.status;
			error.response = response;
			throw error;
		}

		return response.json();
	};

	// HOF to create HTTP Method functions
	const createMethod = (method) => {
		return (endpoint, data, options) => {
			const requestOptions = { ...options };
			if (data) {
				if (method === 'GET') {
					const params = new URLSearchParams(data);
					endpoint = `${endpoint}?${params}`;
				} else {
					requestOptions.body = JSON.stringify(data);
				}
			}

			return request(method, endpoint, requestOptions)
		};
	};

	return {
		get: createMethod('GET'),
		post: createMethod('POST'),
		put: createMethod('PUT'),
		patch: createMethod('PATCH'),
		delete: createMethod('DELETE'),
	}
}

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Compos API client with features
const api = createAPIClient('https://api.example.com');

// Create specialized endpoints with different compositions
const getUser = pipe(
	APIRequestBuilder.withCache(300009), // 5mins
	APIRequestBuilder.withRetry(3, 1000),
	APIRequestBuilder.withLogging()
)(api.get);

const createOrder = pipe(
	APIRequestBuilder.withRateLimit(10, 60000),
	APIRequestBuilder.withRetry(2, 500),
	APIRequestBuilder.withTransform(response => ({
		...response,
		processedAt: Date.now()
	}))
)(api.post);

// Usage
getUser('/users/123').then(user => console.log(user));
createOrder('/orders', { items: [/*...*/] }).then(order => console.log(order));

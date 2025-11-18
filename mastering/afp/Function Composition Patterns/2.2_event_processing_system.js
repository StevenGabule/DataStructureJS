// =====================================================
// EVENT DRIVEN ARCHITECTURE WITH HOFs
// =====================================================

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

class EventProcessor {
	constructor() {
		this.handlers = new Map();
		this.middleware = [];
		this.filters = [];
	}

	// HOF: Create event handler with automatic retry
	static withRetry(maxRetries, delay) {
		return (handler) => {
			return async (event) => {
				let lastError;

				for (let i = 0; i < maxRetries; i++) {
					try {
						return await handler(event);
					} catch (error) {
						lastError = error;
						console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
						await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
					}
				}

				throw lastError;
			}
		}
	}

	// HOF: Create debounced event handler
	static debounce(delay) {
		const pending = new Map();

		return (handler) => {
			return (event) => {
				const key = event.type + event.target;

				if (pending.has(key)) {
					clearTimeout(pending.get(key))
				}

				const timeoutId = setTimeout(() => {
					pending.delete(key);
					handler(event)
				}, delay);

				pending.set(key, timeoutId);
			}
		}
	}

	// HOF: Create throttled event handler
	static throttle(limit) {
		const lastRun = new Map();

		return (handler) => {
			return (event) => {
				const key = event.type + event.target;
				const now = Date.now();
				const last = lastRun.get(key) || 0;

				if (now - last >= limit) {
					lastRun.set(key, now);
					return handler(event);
				}
			}
		}
	}

	// HOF: Batch events
	static batch(size, timeout) {
		const batches = new Map();

		return (handler) => {
			return (event) => {
				const key = event.type;

				if (!batches.has(key)) {
					batches.set(key, {
						events: [],
						timeoutId: null
					});
				}

				const batch = batches.get(key);
				batch.events.push(event);

				const processBatch = () => {
					const events = [...batch.events];
					batch.events = [];

					if (batch.timeoutId) {
						clearTimeout(batch.timeoutId);
						batch.timeoutId = null;
					}

					handler(events);
				};

				if (batch.events.length >= size) {
					processBatch();
				} else if (!batch.timeoutId) {
					batch.timeoutId = setTimeout(processBatch, timeout);
				}
			}
		}
	}

	// HOF: Transform events
	static transform(transformer) {
		return (handler) => {
			return (event) => handler(transformer(event))
		}
	}

	// HOF: Filter events
	static filter(predicate) {
		return (handler) => {
			return (event) => {
				if (predicate(event)) {
					return handler(event);
				}
			}
		}
	}
}

// Real-world usage: Analytics event processing
const analyticsHandler = pipe(
	EventProcessor.filter(event => event.type !== 'debug'),
	EventProcessor.transform(event => ({
		...event,
		timestamp: Date.now(),
		sessionId: getSessionId(),
		userId: getUserId()
	})),
	EventProcessor.debounce(500),
	EventProcessor.batch(10, 1000),
	EventProcessor.withRetry(3, 1000),
)(async (events) => {
	// Send batch events to analytics service
	await fetch('/api/analytics', {
		method: 'POST',
		body: JSON.stringify(events)
	})
});

// Usage
analyticsHandler({ type: 'click', target: 'button#submit' });
analyticsHandler({ type: 'pageview', url: '/products' });






























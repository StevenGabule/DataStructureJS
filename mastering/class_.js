class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	greet() {
		return `Hello, my name is ${this.name}`;
	}
}

const alice = new Person('alice', 30);
// console.log(alice.greet()); // Hello, my name is alice
// console.log(Person.prototype.greet());
for (const key in alice) {
	console.log(key)
}

class Vehicle {
	constructor(brand) {
		this.brand = brand;
	}

	honk() {
		return "Beep!"
	}
}

class Car extends Vehicle {
	constructor(branch, model) {
		super(brand);
		this.model = model;
	}

	getDetails() {
		return `${this.brand} ${this.model}`
	}
}

const myCar = new Car("Toyota", "Corolla");
console.log(myCar.honk()); // "Beep!" 
console.log(myCar.getDetails()); // "Toyota Corolla"

const dynamicMethodName = 'compute';
class Dynamic {
	[dynamicMethodName](x, y) {
		return x * y;
	}
}

const inst = new Dynamic();
inst.compute(10, 10);


//  A useful trick for advanced programmers is to recognize that classes can be partially
//  emulated using factory functions and closures without sacrificing prototype integrity. In
//  complex applications that require both immutability and performance optimization, it may
//  be beneficial to combine class-based syntax with direct prototypal methods. The following
//  pattern demonstrates how one might extend a class with additional functionalities post
// definition without modifying the class declaration itself:
class Logger {
	log(message) {
		console.log(message)
	}
}

// Add methods to the prototype, not the constructor
Object.assign(Logger.prototype, {
	error(message) {
		console.error("[Error] " + message);
	},
	warn(message) {
		console.warn("[Warn] " + message)
	}
})

const logger = new Logger();
logger.log('Logging information')
logger.error('Error information')
logger.warn('Warning information')

// ========= Real-world use cases and examples ========= 
// Plugin System for a Database ORM
class Model { // Core ORM class
	constructor(data = {}) {
		this.data = data;
		this.timestamps = { created: null, updated: null }
	}

	save() {
		console.log(`Saving to database: ${this.data}`)
		return this;
	}
}

// Plugin: Soft delete functionality
const SoftDeletePlugin = {
	softDelete() {
		this.data.deletedAt = new Date();
		this.save();
		console.log(`Soft deleted at: ${this.data.deletedAt}`)
		return this;
	},
	restore() {
		delete this.data.deletedAt;
		this.save();
		console.log('Restored record')
		return this;
	},
	isDeleted() {
		return !!this.data.deletedAt;
	}
}

// Plugin: Validation
const ValidationPlugin = {
	validate(rules) {
		for (let [field, rule] of Object.entries(rules)) {
			if (rule.required && !this.data[field]) {
				throw new Error(`Field ${field} is required`)
			}

			if (rule.minLength && this.data[field].length < rule.minLength) {
				throw new Error(`Field ${field} must be at least ${rule.minLength} characters`)
			}
		}

		return true;
	},
	validateAndSave(rules) {
		this.validate(rules);
		return this.save();
	}
}

// Apply plugins conditionally
Object.assign(Model.prototype, SoftDeletePlugin)
Object.assign(Model.prototype, ValidationPlugin)

// Usage
const user = new Model({ name: 'John', email: 'john@gmail.com' })
user.validateAndSave({
	name: { required: true, minLength: 2 },
	email: { required: true }
})
user.softDelete();
console.log(`Is deleted? ${user.isDeleted}`); // true
user.restore();

// HTTP Client with Environment-Specific Methods
class HttpClient {
	constructor(baseURL) {
		this.baseURL = baseURL;
		this.headers = { 'Content-Type': 'application/json' }
	}

	async get(endpoint) {
		console.log(`GET ${this.baseURL}${endpoint}`)
		return { status: 200, data: {} };
	}

	async post(endpoint, data) {
		console.log(`POST ${this.baseURL}${endpoint}`, data)
		return { status: 201, data: {} }
	}
}

// Development-only debugging methods
if (process.env.NODE_ENV === 'development') {
	object.assign(HttpClient.prototype, {
		debug() {
			console.log('=== HTTP Client Debug Info ===')
			console.log(`Base URL: ${this.baseURL}`)
			console.log(`Headers: ${this.headers}`)
			console.log('==============================');
		},
		mockResponse(endpoint, response) {
			this._mocks = this._mocks || {};
			this._mocks[endpoint] = response;
			console.log(`Mocked ${endpoint} with: ${response}`)
		},
		async testEndpoint(endpoint) {
			console.time(`Testing ${endpoint}`)
			const result = await this.get(endpoint);
			console.timeEnd(`Testing ${endpoint}`)
			return result;
		}
	})
}

// Production-only methods
if (process.env.NODE_ENV === 'production') {
	Object.assign(HttpClient.prototype, {
		async getWithRetry(endpoint, retries = 3) {
			for (let i = 0; i < retries; i++) {
				try {
					return await this.get(endpoint);
				} catch (error) {
					if (i === retries - 1) throw error;
					await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)))
				}
			}
		},
		enableMetrics() {
			const originalGet = this.get;
			this.get = async function (...args) {
				const start = Date.now()
				const result = await originalGet.apply(this, args);
				// Send metrics to monitoring service
				console.log(`Metric: GET took ${Date.now() - start}ms`)
				return result;
			}
		}
	})
}

// Event Emitter with Feature Flags
class EventEmitter {
	constructor() {
		this.events = {}
	}

	on(event, handler) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(handler);
		return this;
	}

	emit(event, ...args) {
		if (this.events[event]) {
			this.events[event].forEach(handler => handler(...args))
		}

		return this;
	}
}

// Feature flag system
const FEATURES = {
	ANALYTICS: true,
	DEBUGGING: true,
	PERSISTENCE: false,
}

// Conditionally add analytics
if (FEATURES.ANALYTICS) {
	Object.assign(EventEmitter.prototype, {
		trackEvent(eventName, metadata = {}) {
			this.on(eventName, (data) => {
				console.log('Analytics:', {
					event: eventName,
					timestamp: new Date().toISOString(),
					metadata: { ...metadata, ...data }
				});
			});
			return this;
		}
	});
}

// Conditionally add debugging
if (FEATURES.DEBUGGING) {
	Object.assign(EventEmitter.prototype, {
		debugMode() {
			const originalEmit = this.emit;
			this.emit = function (event, ...args) {
				console.group(`🔍 Event: ${event}`)
				console.log(`Payload: ${args}`);
				console.log(`Listeners: ${this.events[event]?.length || 0}`);
				console.groupEnd()
				return originalEmit.apply(this, arguments)
			};
			return this;
		},
		listAllEvents() {
			return Object.keys(this.events)
		}
	});
}

// Usage
const emitter = new EventEmitter()
emitter.trackEvent('user_login')
emitter.debugMode()
emitter.on('user_login', (user) => console.log('User logged in: ' + user))
emitter.emit('user_login', { id: 123, name: 'Alice' })

// Component System with Mixins
// Base component class
class Component {
	constructor(props = {}) {
		this.props = props;
		this.state = {}
	}

	render() {
		return `<div>${JSON.stringify(this.state)}</div>`
	}
}

// Mixin factory
function applyMixins(targetClass, ...mixins) {
	mixins.forEach(mixin => {
		Object.assign(targetClass.prototype, mixin)
	})
}

// Draggable mixin
const DraggableMixin = {
	enableDragging() {
		this.isDraggable = true;
		this.position = { x: 0, y: 0 }
		console.log('Dragging enabled for component.')
		return this;
	},
	dragTo(x, y) {
		if (!this.isDraggable) {
			throw new Error('Component is not draggable.')
		}

		this.position = { x, y };
		console.log(`Draggable to: ${x}, ${y}`);
		return this;
	}
}

// Resizable mixin
const ResizableMixin = {
	enableResizing() {
		this.isResizable = true;
		this.dimensions = { width: 100, height: 100 };
		console.log(`Resizing enabled for component.`)
		return this;
	},
	resizeTo(width, height) {
		if (!this.isResizable) {
			throw new Error('Component is not resizable')
		}
		this.dimensions = { width, height }
		console.log(`Resized to ${width}x${height}`)
		return this;
	}
}

// Animatable mixin
const AnimatableMixin = {
	animate(property, from, to, duration) {
		console.log(`Animating ${property}: ${from} -> ${to} over ${duration}ms`)
		this.state[property] = from;

		setTimeout(() => {
			this.state[property] = to;
			console.log(`Animation complete: ${property} = ${to}`)
		}, duration);

		return this;
	},
	fadeIn(duration = 300) {
		return this.animate('opacity', 0, 1, duration)
	},
	fadeOut(duration = 300) {
		return this.animate('opacity', 1, 0, duration)
	}
}

applyMixins(Component, DraggableMixin, ResizableMixin, AnimatableMixin);

// Usage
const widget = new Component({ title: 'My widget' })
widget.enableDragging().enableResizing().dragTo(100, 200).resizeTo(300, 400).fadeIn(500)

// Factory Function + Closure Pattern Combined with Classes
// Hybrid approach: Class with factory-enhanced instances
class DataStore {
	constructor(name) {
		this.name = name;
		this.data = new Map();
	}

	set(key, value) {
		this.data.set(key, value)
		return this;
	}

	get(key) {
		return this.data.get(key)
	}
}

// Factory that creates enhanced instances with private state via closures
function createSecureDataStore(name, encryptionKey) {
	const store = new DataStore(name);

	// private state via closure
	let accessCount = 0;
	let lastAccessed = null;
	const auditLog = []

	// enhance the instance with additional methods
	Object.assign(store, {
		secureSet(key, value) {
			const encrypted = btoa(encryptionKey + value); // simple encryption
			auditLog.push({
				action: 'set',
				key,
				timestamp: new Date(),
				accessCount: ++accessCount
			});
			lastAccessed = new Date();
			return this.set(key, encrypted)
		},
		secureGet(key) {
			const encrypted = this.get(key);
			if (!encrypted) return null;

			auditLog.push({
				action: 'get',
				key,
				timestamp: new Date(),
				accessCount: ++accessCount
			})

			lastAccessed = new Date();
			return atob(encrypted).replace(encrypted, '')
		},
		getAuditLog() {
			return [...auditLog];
		},
		getStats() {
			return {
				accessCount,
				lastAccessed,
				totalEntries: this.data.size,
				auditEntries: auditLog.length
			}
		}
	});

	// Freeze certain methods to prevent tampering
	Object.freeze(store.getAuditLog)
	Object.freeze(store.getStats)

	return store;
}

// Usage
const secureStore = createSecureDataStore('UserData', 'secret123');
secureStore.secureSet('password', 'myPassword');
secureStore.secureSet('email', 'user@example.com');

console.log('Retrieved: ' + secureStore.secureGet('password'))
console.log('Stats: ' + secureStore.getStats())
console.log('Audit Log: ' + secureStore.getAuditLog())
// Key Benefits of This Pattern
// Separation of Concerns: Core functionality stays in the class, extensions are added separately
// Conditional Enhancement: Add methods based on environment, feature flags, or runtime conditions
// Plugin Architecture: Third-party code can extend your classes without modifying source
// Progressive Enhancement: Start with a minimal class and layer on functionality as needed
// Testing Flexibility: Can add test-specific methods without polluting production code
// Backward Compatibility: Can extend existing classes without breaking existing code

// This pattern is particularly useful in scenarios where you need to maintain a clean class
// interface while allowing for flexible runtime extensions, making it valuable for library
// authors, plugin systems, and large applications with varying deployment configurations.



// Advanced strategies for optimizing object creation also include pre-allocation and object
// pooling. In scenarios where objects are created and discarded frequently (such as in game
// loops or real-time data processing), reusing objects from a pool can dramatically reduce
// garbage collection overhead. A simple object pool implementation might resemble:
function ObjectPool(createFn, poolSize) {
	this.pool = []
	this.createFn = createFn;
	for (var i = 0; i < poolSize; i++) {
		this.pool.push(createFn())
	}
}

ObjectPool.prototype.acquire = function () {
	return this.pool.length ? this.pool.pop() : this.createFn();
}

ObjectPool.prototype.release = function (obj) {
	this.pool.push(obj)
}

function createParticle() {
	return {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0
	}
}

var particlePool = new ObjectPool(createParticle, 100);
var particle = particlePool.acquire();
// Set properties for particle simulation... 
particle.x = Math.random() * 500;
particle.vx = Math.random() * 10;
particlePool.release(particle);
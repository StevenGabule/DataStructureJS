function lookupProperty(obj, key) {
	while (obj !== null) {
		if (obj.hasOwnProperty(key)) {
			return obj[key];
		}

		obj = Object.getPrototypeOf(obj);
	}

	return undefined;
}


const basedProto = {
	greet() {
		return "Hello world";
	}
}

// const derivedObj = Object.create(basedProto);
// console.log(derivedObj.greet());


function Person(name) {
	this.name = name;
}

Person.prototype.getName = function () {
	return this.name;
}

// let alice = new Person('Alice borderland');
// console.log(alice.getName()); // Alice borderland

function reassignedPrototype(obj, newProto) {
	Object.setPrototypeOf(obj, newProto);
}

const baseA = {
	methodA() { return "method a" }
}

const baseB = {
	methodB() { return "method b" }
}

// const dynamicObj = Object.create(baseA);
// console.log(dynamicObj.methodA());

// Dynamically switch the prototype
// reassignedPrototype(dynamicObj, baseB);
// console.log(dynamicObj.methodB());
// console.log(dynamicObj.methodA());

function createCustomObject(proto, properties) {
	var obj = Object.create(proto);
	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			Object.defineProperty(obj, key, {
				value: properties[key],
				writable: true,
				configurable: true,
				enumerable: true,
			})
		}
	}

	return obj;
}

// const enhancedObj = createCustomObject(basedProto, {
// 	enhanced: function() { return "Enhanced behavior!" }
// });

// console.log(enhancedObj.greet());
// console.log(enhancedObj.enhanced());

function NewOperator(Constructor, ...args) {
	let instance = Object.create(Constructor.prototype);
	let result = Constructor.apply(instance, args);
	return typeof result === 'object' && result !== null ? result : instance;
}

function BaseComponent(config) {
	this.config = config || {};
}

BaseComponent.prototype.render = function () {
	return "Rendering base components"
}

function AdvancedComponent(config, advancedConfig) {
	BaseComponent.call(this, config);
	this.advancedConfig = advancedConfig || {};
}

// Inherit prototype from BaseComponent
AdvancedComponent.prototype = Object.create(BaseComponent.prototype);
AdvancedComponent.prototype.constructor = AdvancedComponent;
AdvancedComponent.prototype.renderAdvanced = function () {
	return "Rendering advanced component with config: " + JSON.stringify(this.advancedConfig);
}

// const comp = new AdvancedComponent({width: 100},{animation: true});
// console.log(comp.render());
// console.log(comp.renderAdvanced());

function SecureEntity(secret) {
	// Private variable captured within a closure
	let _secret = secret;

	this.getSecret = function () {
		return _secret;
	}

	this.setSecret = function (newSecret) {
		if (typeof newSecret === 'string') {
			_secret = newSecret;
		} else {
			throw new Error('Invalid secret type.');
		}
	}
}

SecureEntity.prototype.reveal = function () {
	// this method has no access to the private variable _secret
	return "Access denied!";
}

let entity = new SecureEntity("initial");
console.log(entity.getSecret());
entity.setSecret('updated secret!');
console.log(entity.getSecret());


function Mixin(source) {
	return function (target) {
		Object.keys(source).forEach(function (key) {
			target[key] = source[key];
		});
	};
}


var LoggerMixin = {
	log: function (message) {
		console.log("[LOG]", message);
	}
}

function Service(name) {
	this.name = name;
}

Service.prototype.start = function () {
	return this.name + " started";
}

var applyLogger = Mixin(LoggerMixin);
var service = new Service("DatabaseService");
applyLogger(service);
service.log("Service is initializing...");
// "DatabaseService started" remains accessible via the prototype.

function StrictConstructor(param) {
	if (!(this instanceof StrictConstructor)) {
		return new StrictConstructor(param);
	}

	this.param = param;
}

var strictInstance = StrictConstructor("enforced");
console.log(StrictInstance.param); // enforced



var base = {
	init: function (data) {
		this.data = data;
		return this;
	},
	process: function () {
		// default processing logic
		return this.data;
	}
}


var derived = Object.create(base);
derived.process = function () {
	// Overriding process method for specialized behavior
	return "Processed: " + this.data;
}

var instance = Object.create(derived).init('Sample data');
console.log(instance.process());
// Expected output: "Processed: Sample Data"

var prototype = {
	greet: function () {
		return "Hello, " + this.name;
	}
}

var properties = {
	name: {
		value: "AdvancedUser",
		enumerable: true,
		writable: false,
		configurable: false,
	},
	age: {
		value: 30,
		writable: true,
		configurable: true,
		enumerable: true
	}
}

var user = Object.create(prototype, properties);
console.log(user.greet()); // "Hello, AdvancedUser"


var mixinMethods = {
	log: function (message) { console.log(`[LOG]: ${message}`) },
	error: function (message) { console.error(`[ERROR]: ${message}`) },
}

function applyMixin(target, mixin) {
	// Use Object.create to obtain a clean object with mixin's methods
	var mixinPrototype = Object.create(mixin);
	Object.keys(mixinPrototype).forEach(function (key) {
		target[key] = mixinPrototype[key];
	});

	return target;
}

var service = { serviceName: "DataService" };
applyMixin(service, mixinMethods);
service.log("Service initialized successfully.");

var Shape = {
	init: function (type) {
		this.type = type;
		return this;
	},
	describe: function () {
		return `This is a ${this.type}`;
	}
}

var Circle = Object.create(Shape);
Circle.init = function (radius) {
	// Override init to incorporate specific properties 
	Shape.init.call(this, 'circle');
	this.radius = radius;
	return this;
}

Circle.area = function () {
	return Math.PI * this.radius * this.radius;
}

var circleInstance = Object.create(Circle).init(5);
console.log(circleInstance.describe()); // "This is a circle" 
console.log(circleInstance.area()); // 78.53981633974483

function createModule(baseModule, extension) {
	var module = Object.create(baseModule);
	Object.keys(extension).forEach(function (key) {
		Object.defineProperty(module, key, {
			value: extension[key],
			writable: true,
			configurable: true,
			enumerable: true
		});
	});

	return module;
}

var coreModule = {
	start: function () {
		return "Core module started.";
	}
}

var extendedModule = createModule(coreModule, {
	start: function () {
		return "Extended module started with additional features.";
	},
	stop: function () {
		return "Module stopped.";
	},
});

console.log(extendedModule.start()); // "Extended module started with additional features." 
console.log(extendedModule.stop());  // "Module stopped."


function cloneObject(obj) {
	var cloned = Object.create(Object.getPrototypeOf(obj));
	return Object.assign(cloned, obj);
}

var original = {
	a: 1,
	b: 2,
	describe: function () {
		return `a: ${this.a}, b: ${this.b}`
	},
}

var copy = cloneObject(original);
copy.a = 42;
console.log(original.describe());
// "a: 1, b: 2"

console.log(copy.describe());
// "a: 42, b: 2"

var canFly = {
	fly: function () {
		return this.name + " is flying.";
	}
}

var canSwim = {
	swim: function () {
		return this.name + " is swimming.";
	}
}

var bird = Object.create(canFly);
bird.init = function (name) {
	this.name = name;
	return this;
}

var duck = Object.create(bird);
duck = Object.assign(duck, canSwim);
duck.init("Donald");
console.log(duck.fly()); // Donald is flying
console.log(duck.swim()); // Donald is swimming

// Helper function for method delegation along the prototype chain 
function callSuper(obj, methodName, args) {
	var proto = Object.getPrototypeOf(obj);
	if (proto && typeof proto[methodName] === "function") {
		return proto[methodName].apply(obj, args);
	}

	return undefined;
}


var baseLogger = {
	log: function () {
		return "[Base] Logging information.";
	}
}


var enhancedLogger = Object.create(baseLogger);
enhancedLogger.log = function () {
	var superLog = callSuper(this, "log", []);
	return superLog + "[Enhanced] Additional context provided.";
}

console.log(enhancedLogger.log()); // "[Base] Logging information. [Enhanced] Additional context provided."

var eventMixin = {
	subscribe: function (event, handler) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(handler);
	},
	publish: function (event, data) {
		if (this._events && this._events[event]) {
			this._events[event].forEach(function (handler) {
				handler(data);
			});
		}
	}
};

var widget = { name: "Widget" };

// Mixin event functionality into widget
Object.keys(eventMixin).forEach(function (key) {
	widget[key] = eventMixin[key];
});

widget.subscribe("update", function (data) {
	console.log("Widget update: " + data);
})

widget.publish("update", "Data refreshed"); // Widget update: Data refreshed

var loggerMixin = {
	log: function (message) {
		console.log('[LOG]: ' + message)
	},
	error: function (message) {
		console.error("[ERROR]: " + message)
	}
}

function applyMixin(target, mixin) {
	var mixinDecorator = Object.create(mixin);
	Object.getOwnPropertyNames(mixinDecorator).forEach(function (prop) {
		if (typeof mixinDecorator[prop] === 'function') {
			target[prop] = mixinDecorator[prop];
		}
	});

	return target;
}

var service = { serviceName: "DataService" };
applyMixin(service, loggerMixin);
service.log("Service started.");

var persistenceMixin = {
	save: function () {
		console.log("Saving: " + JSON.stringify(this))
	},
	load: function (data) {
		Object.assign(this, data)
	}
}

var user = { username: "advancedDev" };
Object.assign(user, eventMixin, loggerMixin, persistenceMixin);
user.log("User created");
user.save();


// advanced mixin facilitator
function mergeMixins(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		Object.getOwnPropertyNames(source).forEach(function (prop) {
			if (target.hasOwnProperty(prop)) {
				throw new Error(`Property conflict: ${prop} already exists on target`)
			}
			Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source))
		})
	}

	return target;
}

var analyticsMixin = {
	track: function (evt) {
		console.log(`Tracking events: ${evt}`)
	}
}

var dashboard = { title: 'sales dashboard' }
mergeMixins(dashboard, loggerMixin, analyticsMixin);
dashboard.log("Dashboard loaded.")
dashboard.track("Click!")

var cacheMixin = (function () {
	var cacheData = new WeakMap();
	return {
		cache: function (key, value) {
			if (!cacheData.has(this)) {
				cacheData.set(this, {})
			}
			cacheData.get(this)[key] = value;
		},
		retrieve: function (key) {
			return cacheData.has(this) ? cacheData.get(this)[key] : undefined
		}
	}
})()

var resource = { resourceName: "DataResource" };
Object.assign(resource, cacheMixin);
resource.cache('id', 42);
console.log(resource.retrieve("id")); // Expected output: 42


// Another advanced integration strategy involves dynamically adjusting mixin behavior based
// on contextual information. Developers may design mixins that modify their methods
// according to runtime data or configuration parameters. This dynamic application of mixins
// can be achieved by wrapping mixin functions within higher-order functions. Consider the
// following example:
function configurableLogger(config) {
	var prefix = config && config.prefix ? config.prefix : "[LOG]";
	return {
		log: function (message) {
			console.log(`${prefix} ${message}`)
		}
	}
}

var adminLogger = configurableLogger({ prefix: "[ADMIN]" });
var userLogger = configurableLogger({ prefix: "[USER]" });

var adminPanel = { panel: "Control" }
Object.assign(adminPanel, adminLogger);
adminPanel.log("Admin Panel loaded.")

var userPanel = { panel: "Dashboard" };
Object.assign(userPanel, userLogger);
userPanel.log("User dashboard loaded.")


// ES6 provides
// syntactic sugar over prototypal inheritance, and mixins can be applied both via direct
// augmentation of class prototypes and through composition within class constructors. A
// popular pattern entails defining mixin functions that extend the target class’s prototype. 
// For instance:
let timingMixin = {
	startTimer: function () {
		this._startTime = Date.now();
	},
	stopTimer: function () {
		return Date.now() - this._startTime;
	}
}

function applyMixinToClass(targetClass, mixin) {
	Object.keys(mixin).forEach(function (key) {
		targetClass.prototype[key] = mixin[key];
	})
}

class Task {
	constructor(name) {
		this.name = name;
	}
}

applyMixinToClass(Task, timingMixin);
let task = new Task("Compute");
task.startTimer();
// ... perform tasks operations ...
console.log(`Task duration: ${task.stopTimer()} ms`)













































































































































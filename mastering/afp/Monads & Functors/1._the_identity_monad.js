// ============================================
// IDENTITY MONAD - The Simplest Monad
// ============================================
class Identity {
	constructor(value) {
		this._value = value;
	}

	static of(value) {
		return new Identity(value);
	}

	map(fn) {
		return Identity.of(fn(this._value));
	}

	flatMap(fn) {
		return fn(this._value);
	}

	chain(fn) {
		return this.flatMap(fn);
	}

	extract() {
		return this._value;
	}

	inspect() {
		return `Identity(${JSON.stringify(this._value)})`;
	}
}

// Why use Identity? It's useful for:
// 1. Abstracting function application
// 2. Making regular values composable with monadic values
// 3. Testing monadic interfaces

// Real-world example: Plugin system with monadic interface
class PluginSystem {
	constructor() {
		this.plugins = [];
	}

	// Register plugin that works with any monad
	register(plugin) {
		this.plugins.push(plugin);
		return this;
	}

	// Process value through all plugins
	process(value, MonadType = Identity) {
		return this.plugins.reduce(
			(acc, plugin) => acc.flatMap(plugin),
			MonadType.of(value)
		);
	}
}

// Create plugins that return monadic values
const validatePlugin = (data) => {
	if (!data.id) {
		return Identity.of({ ...data, id: Date.now() });
	}

	return Identity.of(data);
}

const enrichPlugin = (data) => {
	return Identity.of({
		...data,
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	});
}

const transformPlugin = (data) => {
	return Identity.of({
		...data,
		processed: true,
		hash: btoa(JSON.stringify(data)).substring(0, 10)
	})
}

// Usage
const pluginSystem = new PluginSystem()
	.register(validatePlugin)
	.register(enrichPlugin)
	.register(transformPlugin);

const result = pluginSystem.process({ name: 'Test' });
console.log(result.extract());
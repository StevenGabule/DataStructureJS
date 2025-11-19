// ============================================
// IO MONAD - Pure Functional Side Effects
// ============================================

class IO {
	constructor(effect) {
		this.effect = effect;
	}

	static of(effect) {
		return new IO(() => value);
	}

	map(fn) {
		return new IO(() => fn(this.effect()))
	}

	flatMap(fn) {
		return new IO(() => fn(this.effect()).effect());
	}

	chain(fn) {
		return this.flatMap(fn);
	}

	// Run the effect (impure - only call at the edge of your program)
	run() {
		return this.effect();
	}

	// Compose IO actions
	compose(io) {
		return new IO(() => {
			this.run();
			return io.run();
		})
	}
}


// ============================================
// REAL-WORLD USE CASE: File System Operations
// ============================================
const fs = require('fs').promises;
const path = require('path');

// Pure functions that return IO actions
const readFile = (filename) => new IO(async () => {
	const content = await fs.readFile(filename, 'utf8');
	return content;
});

const writeFile = (filename, content) => new IO(async () => {
	await fs.writeFile(filename, content);
	return filename;
});

const appendFile = (filename, content) => new IO(async () => {
	await fs.appendFile(filename, content);
	return filename;
});

const deleteFile = (filename) => new IO(async () => {
	await fs.unlink(filename);
	return filename;
});

// Composable file operations
const processConfigFile = (configPath) => {
	return readFile(configPath)
		.map(content => JSON.parse(content))
		.map(config => ({
			...config,
			lastModified: new Date().toISOString(),
			version: (config.version || 0) + 1
		}))
		.map(config => JSON.stringify(config, null, 2))
		.flatMap(() => readFile(configPath))
		.map(content => {
			const config = JSON.parse(content);
			config.processed = true;
			return JSON.stringify(config, null, 2);
		})
		.flatMap(content => writeFile(configPath, content));
}

// ============================================
// DOM MANIPULATION WITH IO MONAD
// ============================================

const DOM = {
	querySelector: (selector) => new IO(() => {
		document.querySelector(selector)
	}),
	querySelectorAll: (selector) => new IO(() =>
		Array.from(document.querySelectorAll(selector))
	),
	createElement: (tag) => new IO(() => document.createElement(tag)),
	setAttribute: (element, attr, value) => new IO(() => {
		element.setAttribute(attr, value);
		return element;
	}),
	appendChild: (parent, child) => new IO(() => {
		parent.appendChild(child);
		return parent;
	}),
	innerHTML: (element, html) => new IO(() => {
		element.innerHTML = html;
		return element;
	}),
	addEventListener: (element, event, handler) => new IO(() => {
		element.addEventListener(event, handler);
		return element;
	}),
	style: (element, styles) => new IO(() => {
		Object.assign(element.style, styles);
		return element;
	})
};

// Composable DOM operations
const createInteractiveButton = (text, clickHandler) => {
	return DOM.createElement('button')
		.flatMap(btn => DOM.innerHTML(btn, text))
		.flatMap(btn => DOM.setAttribute(btn, 'class', 'interactive-btn'))
		.flatMap(btn => DOM.style(btn, {
			padding: '10px 20px',
			backgroundColor: '#007bff',
			color: 'white',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer'
		}))
		.flatMap(btn => DOM.addEventListener(btn, 'click', clickHandler))
		.flatMap(btn => DOM.querySelector('#app')
			.flatMap(app => DOM.appendChild(app, btn))
		);
};

// Usage - Effects are composed but not executed until .run()
const buttonEffect = createInteractiveButton('click me!', () => {
	console.log('Button clicked!')
});

// Run the effect when ready (at the edge of the program)
// buttonEffect.run();

// ============================================
// HTTP REQUESTS WITH IO MONAD
// ============================================

class HTTP {
	static get(url, options = {}) {
		return new IO(async () => {
			const response = await fetch(url, { ...options, method: 'GET' });
			if (!response.ok) throw new Error(`Http ${response.status}`);
			return response.json();
		});
	}

	static post(url, data, options = {}) {
		return new IO(async () => {
			const response = await fetch(url, {
				...options,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			return response.json();
		});
	}

	static sequential(...requests) {
		return requests.reduce(
			(acc, request) => acc.flatMap(() => request),
			IO.of(null)
		);
	}

	static parallel(...requests) {
		return new IO(async () => {
			const promises = requests.map(req => req.run());
			return Promise.all(promises);
		})
	}
}

// Composable API calls
const fetchUserDAta = (userId) => {
	const user = HTTP.get(`/api/users/${userId}`);
	const posts = HTTP.get(`/api/users/${userId}/posts`);
	const comments = HTTP.get(`/api/users/${userId}/comments`);

	return HTTP.parallel(user, posts, comments).map(([userData, userPosts, userComments]) => ({
		...userData,
		posts: userPosts,
		comments: userComments,
		stats: {
			postCount: userPosts.length,
			commentCount: userComments.length,
		}
	}));
};

// Chain dependent API calls
const createUserWithProfile = (userData) => {
	return HTTP.post('/api/users', userData)
		.flatMap(user =>
			HTTP.post('/api/profiles', {
				userId: user.id,
				bio: userData.bio,
				avatar: userData.avatar
			}).map(profile => ({ user, profile }))
		).flatMap(({ user, profile }) => HTTP.post('/api/notifications/welcome', {
			userId: user.id,
			email: user.email
		}).map(() => ({ user, profile }))
		);
}























































































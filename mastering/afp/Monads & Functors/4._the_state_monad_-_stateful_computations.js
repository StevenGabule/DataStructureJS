// =====================================================
// STATE MONAD - Pure Stateful Computations
// =====================================================

class State {
	constructor(computation) {
		this.computation = computation;
	}

	static of(value) {
		return new State(state => [value, state]);
	}

	static get() {
		return new State(state => [state, state]);
	}

	static put(newState) {
		return new State(() => [null, newState]);
	}

	static modify(fn) {
		return new State(state => [null, fn(state)]);
	}

	map(fn) {
		return new State(state => {
			const [value, newState] = this.computation(state);
			return [fn(value), newState];
		});
	}

	flatMap(fn) {
		return new State(state => {
			const [value, newState] = this.computation(state);
			return fn(value).computation(newState);
		});
	}

	chain(fn) {
		return this.flatMap(fn);
	}

	run(initialState) {
		return this.flatMap(fn);
	}

	run(initialState) {
		return this.computation(initialState);
	}

	eval(initialState) {
		return this.computation(initialState)[0];
	}

	exec(initialState) {
		return this.computation(initialState)[1];
	}
}

// ==================================================
// REAL-WORLD: GAME STATE MANAGEMENT
// ==================================================

class GameState {
	constructor(player, enemies, items, score) {
		this.player = player;
		this.enemies = enemies;
		this.items = items;
		this.score = score;
	}
}

const GameActions = {
	movePlayer: (direction) => State.modify(state => ({
		...state,
		player: {
			...state.player,
			position: GameActions.calculateNewPosition(
				state.player.position,
				direction
			)
		}
	})),
	calculateNewPosition: (position, direction) => {
		const moves = {
			up: { x: 0, y: -1 },
			down: { x: 0, y: 1 },
			left: { x: -1, y: 0 },
			right: { x: 1, y: 0 },
		};
		const move = moves[direction] || { x: 0, y: 0 };
		return {
			x: position.x + move.x,
			y: position.y + move.y,
		}
	},
	takeDamage: (amount) => State.modify(state => ({
		...state,
		player: {
			...state.player,
			health: Math.max(0, state.player.health - amount)
		}
	})),
	heal: (amount) => State.modify(state => ({
		...state,
		player: {
			...state.player,
			health: Math.min(100, state.player.health + amount)
		}
	})),
	collectItem: (item) => State.get().flatMap(state => {
		const newItems = state.items.filter(i => i.id !== item.id);
		return State.put({
			...state,
			items: newItems,
			score: state.score + item.value,
			player: item.type === 'health' ? {
				...state.player,
				health: Math.min(100, state.player.health + item.effect)
			} : state.player
		}).map(() => item);
	}),
	spawnEnemy: (enemy) => State.modify(state => ({
		...state,
		enemies: [...state.enemies, { ...enemy, id: Date.now() }]
	})),
	attackEnemy: (enemyId, damage) => State.get().flatMap(state => {
		const enemy = state.enemies.find(e => e.id === enemyId);
		if (!enemy) return State.of(null);

		const updatedEnemy = {
			...enemy,
			health: enemy.health - damage
		};

		if (updatedEnemy.health <= 0) {
			// Enemy defeated
			return State.put({
				...state,
				enemies: state.enemies.filter(e => e.id !== enemyId),
				score: state.score + enemy.points
			}).map(() => ({ default: true, points: enemy.points }))
		} else {
			// Enemy still alive
			return State.put({
				...state,
				enemies: state.enemies.map(e => e.id === enemyId ? updatedEnemy : e)
			}).map(() => ({ defeated: false, remainingHealth: updatedEnemy.health }))
		}
	})
};

// Compose game actions
const playerTurn = () => {
	return GameActions.movePlayer('right')
		.flatMap(() => State.get())
		.flatMap(state => {
			// Check for item at player position
			const item = state.items.find(i =>
				i.position.x === state.player.position.x &&
				i.position.y === state.player.position.y
			);

			if (item) {
				return GameActions.collectItem(item)
			}

			return State.of(null);
		})
		.flatMap(() => State.get())
		.flatMap((state) => {
			// Check for enemy at player position
			const enemy = state.enemies.find(e =>
				Math.abs(e.position.x - state.player.position.x) <= 1 &&
				Math.abs(e.position.y - state.position.y) <= 1
			);

			if (enemy) {
				return GameActions.attackEnemy(enemy.id, state.player.attackEnemy);
			}

			return State.of(null);
		});
};

// Initialize game state
const initialGameState = new GameState(
	{ position: { x: 0, y: 0 }, health: 100, attackPower: 10 },
	[
		{ id: 1, position: { x: 2, y: 0 }, health: 30, points: 10 },
		{ id: 2, position: { x: 5, y: 2 }, health: 50, points: 20 },
	],
	[
		{ id: 1, position: { x: 1, y: 0 }, type: 'health', effect: 20, value: 5 },
		{ id: 2, position: { x: 3, y: 1 }, type: 'coin', effect: 0, value: 10 },
	],
	0
);

// Run game turn
const [result, finalState] = playerTurn().run(initialGameState);


// =========================================================
// PARSER COMBINATOR WITH STATE MONAD
// =========================================================

class Parser extends State {
	static char(c) {
		return new Parser(input => {
			if (input[0] === c) {
				return [c, input.slice(1)];
			}

			throw new Error(`Expected '${c}' but got '${input[0]}'`);
		});
	}

	static string(s) {
		return new Parser(input => {
			if (input.startsWith(s)) {
				return [s, input.slice(s.length)];
			}
			throw new Error(`Expected '${s}'`)
		})
	}

	static regex(patter) {
		return new Parser(input => {
			const match = input.match(pattern);
			if (match && match.index === 0) {
				return [match[0], input.slice(match[0].length)];
			}
			throw new Error(`Pattern ${pattern} did not match`);
		});
	}

	static many(parser) {
		return new Parser(input => {
			const results = [];
			let remaining = input;

			try {
				while (true) {
					const [value, rest] = parser.computation(remaining);
					results.push(value);
					remaining = rest;
				}
			} catch (error) {
				// Stop when parser fails
			}

			return [results, remaining]
		});
	}

	static many1(parser) {
		return parser.flatMap(first => Parser.many(parser).map(rest => [first, ...rest]));
	}

	static choice(...parsers) {
		return new Parser(input => {
			for (const parser of parsers) {
				try {
					return parser.computation(input)
				} catch (error) {
					// try next parser
				}
			}

			throw new Error('No parser matched');
		});
	}

	static sequence(...parsers) {
		return parsers.reduce(
			(acc, parser) => acc.flatMap(results =>
				parser.map(value => [...results, value])
			),
			Parser.of([])
		);
	}

	or(other) {
		return Parser.choice(this, other);
	}
}

// Build a JSON parser
const JsonParser = {
	whitespace: Parser.regex(/\s*/),
	number: Parser.regex(/-?\d(\.\d+)?([eE][+-]?\d+)?/).map(str => Number(str)),
	string: Parser.char('"')
		.flatMap(() => Parser.many(
			Parser.regex(/[^"\\]/).or(
				Parser.string('\\').flatMap(() =>
					Parser.choice(
						Parser.char('"'),
						Parser.char('\\'),
						Parser.char('/'),
						Parser.char('b').map(() => '\b'),
						Parser.char('f').map(() => '\f'),
						Parser.char('n').map(() => '\n'),
						Parser.char('r').map(() => '\r'),
						Parser.char('t').map(() => '\t'),
					)
				)
			)
		)).flatMap(chars => Parser.char('"').map(() => chars.join(''))),
	boolean: Parser.string('true').map(() => true).or(Parser.string('false').map(() => false)),
	null: Parser.string('null').map(() => null),
	array: new Parser(input => {
		const [_, rest1] = Parser.chat('[').computation(input);
		const [_2, rest2] = JsonParser.whitespace.computation(rest1);

		if (rest2[0] === ']') {
			return [[], rest2.slice(1)];
		}

		const values = [];
		let remaining = rest2;

		while (true) {
			const [value, rest3] = JsonParser.value.computation(remaining);
			values.push(value);
			const [_3, rest4] = JsonParser.whitespace.computation(rest3);

			if (rest4[0] === ']') {
				return [values, rest4.slice(1)];
			}

			if (rest4[0] === ',') {
				const [_4, rest5] = Parser.char(',').computation(rest4);
				const [_5, rest6] = JsonParser.whitespace.computation(rest5);
				remaining = rest6;
			} else {
				throw new Error('Expected , or ]');
			}
		}
	}),
	value: new Parser(input => {
		return Parser.choice(
			JsonParser.string,
			JsonParser.number,
			JsonParser.boolean,
			JsonParser.null,
			JsonParser.array,
		).computation(input)
	})
}


// Parse JSON
const jsonString = '[1, true, "hello", null, [2, 3]]';
const [parsed, remaining] = JsonParser.value.run(jsonString);
console.log('Parsed:', parsed); // [1, true, "hello", null, [2, 3]]

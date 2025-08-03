const roads = [
	"Alice's House-Bob's House", "Alice's House-Cabin",
	"Alice's House-Post Office", "Bob's House-Town Hall",
	"Daria's House-Ernie's House", "Daria's House-Town Hall",
	"Ernie's House-Grete's House", "Grete's House-Farm",
	"Grete's House-Shop", "Marketplace-Farm",
	"Marketplace-Post Office", "Marketplace-Shop",
	"Marketplace-Town Hall", "Shop-Town Hall"
];

const mailRoute = [
	"Alice's House", "Cabin", "Alice's House", "Bob's House",
	"Town Hall", "Daria's House", "Ernie's House",
	"Grete's House", "Shop", "Grete's House", "Farm", "Marketplace", "Post Office"
];

const roadGraph = buildGraph(roads);

function buildGraph(edges) {
	let graph = Object.create(null);

	function addEdge(from, to) {
		if (from in graph) {
			graph[from].push(to);
		} else {
			graph[from] = [to];
		}
	}

	for (let [from, to] of edges.map(r => r.split('-'))) {
		addEdge(from, to);
		addEdge(to, from);
	}

	return graph;
}

class VillageState {
	place;
	parcels;
	constructor(place, parcels) {
		this.place = place;
		this.parcels = parcels;
	}

	move(destination) {
		if (!roadGraph[this.place].includes(destination)) {
			return this;
		} else {
			let parcels = this.parcels.map(p => {
				if (p.place != this.place) return p;
				return { place: destination, address: p.address }
			}).filter(p => p.place != p.address);
			return new VillageState(destination, parcels);
		}
	}

	static random = function (parcelCount = 5) {
		let parcels = []
		for (let i = 0; i < parcelCount; i++) {
			let address = randomPick(Object.keys(roadGraph));
			let place;
			do {
				place = randomPick(Object.keys(roadGraph))
			} while (place === address);
			parcels.push({ place, address })
		}
		return new VillageState('Post Office', parcels);
	}
}

// let first = new VillageState('Post Office', [{ place: 'Post Office', address: "Alice's House" }]);
// let next = first.move("Alice's House");
// console.log(next.place); 		// Alice's House
// console.log(next.parcels); 	// []
// console.log(first.place); 	// Post Office

function runRobot(state, robot, memory) {
	for (let turn = 0; ; turn++) {
		if (state.parcels.length === 0) {
			console.log(`Done in ${turn} turns`);
			break;
		}
		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
		console.log(`Moved to ${action.direction}`);
	}
}

function randomPick(array) {
	let choice = Math.floor(Math.random() * array.length);
	return array[choice];
}

function randomRobot(state) {
	return { direction: randomPick(roadGraph[state.place]) }
}

function routeRobot(state, memory) {
	if (memory.length === 0) {
		memory = mailRoute;
	}
	return { direction: memory[0], memory: memory.slice(1) }
}

function findRoute(graph, from, to) {
	let work = [{ at: from, route: [] }];
	for (let i = 0; i < work.length; i++) {
		let { at, route } = work[i];
		for (let place of graph[at]) {
			if (place == to) return route.concat(place);
			if (!work.some(w => w.at == place)) {
				work.push({ at: place, route: route.concat(place) })
			}
		}
	}
}

function goalOrientedRobot({ place, parcels }, route) {
	if (route.length == 0) {
		let parcel = parcels[0];
		if (parcel.place != place) {
			route = findRoute(roadGraph, place, parcel.place)
		} else {
			route = findRoute(roadGraph, place, parcel.address)
		}
	}
	return {
		direction: route[0],
		memory: route.slice(1)
	}
}

// runRobot(VillageState.random(), randomRobot)
// runRobot(VillageState.random(), goalOrientedRobot, [])

/**
 * Runs a robot for a single task and returns the number of turns it took.
 * @param {VillageState} state - The initial state of the task.
 * @param {Function} robot - The robot function to execute.
 * @param {*} memory - The initial memory for the robot.
 * @returns {number} The number of turns taken to complete the task.
 */
function runTask(state, robot, memory) {
	for (let turn = 0; ; turn++) {
		if (state.parcels.length === 0) {
			return turn;
		}
		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
	}
}

/**
 * Compares the performance of two robots over 100 identical tasks.
 * @param {Function} robot1 - The first robot function.
 * @param {*} memory1 - The initial memory for the first robot.
 * @param {Function} robot2 - The second robot function.
 * @param {*} memory2 - The initial memory for the second robot.
 */
function compareRobots(robot1, memory1, robot2, memory2) {
	let total1 = 0, total2 = 0;
	const tasks = 100;
	const taskStates = [];

	// Generate 100 tasks beforehand so both robots face the exact same challenges
	for (let i = 0; i < tasks; i++) {
		taskStates.push(VillageState.random())
	}

	for (let i = 0; i < tasks; i++) {
		// Both robots solve the *some* task
		total1 += runTask(taskStates[i], robot1, memory1);
		total2 += runTask(taskStates[i], robot2, memory2);
	}

	console.log(`--- Robot Comparison (${tasks} tasks.) ---`);

	console.log(`${robot1.name} needed as average of ${total1 / tasks} steps per task.`);
	console.log(`${robot2.name} needed as average of ${total2 / tasks} steps per task.`);
}

/**
 * A more efficient robot that chooses the shortest path to the nearest
 * parcel, whether it's a pickup or a delivery.
 * @parm {object} {place, parcels} - The current state of the robot.
 * @param {array} route - The robot's current route memory.
 * @returns {object} The next action (direction and memory).
 */
function efficientRobot({ place, parcels }, route) {
	if (route.length === 0) {
		// Find routes for all possible tasks (pickups and deliveries)
		let routes = parcels.map(parcel => {
			if (parcel.place != place) {
				return {
					route: findRoute(roadGraph, place, parcel.place),
					pickUp: true
				}
			} else {
				// Route to delivery this parcel
				return {
					route: findRoute(roadGraph, place, parcel.address),
					pickUp: false,
				}
			}
		});

		// Score each route. A lower score is better.
		// We slightly prefer deliveries over pickups if the distance is the same.
		// as this clears a task from our list.
		function score({ route, pickUp }) {
			return (pickUp ? 0.5 : 0) + route.length;
		}

		// Choose the route the best score (the lowest number)
		route = routes.reduce((a, b) => score(a) < score(b) ? a : b).route;
	}
	return {
		direction: route[0],
		memory: route.slice(1)
	}
}

compareRobots(routeRobot, [], efficientRobot, []);
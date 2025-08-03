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

function buildGraph(edges) {
	let graph = Object.create(null);

	function addEdge(from, to) {
		if (graph[from] == null) {
			graph[from] = [to];
		} else {
			graph[from].push(to);
		}
	}

	for (let [from, to] of edges.map(r => r.split('-'))) {
		addEdge(from, to);
		addEdge(to, from);
	}

	return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
	place;
	parcels;
	fuel;
	roadClosures;
	gasStation;
	constructor(place, parcels, fuel = 100, roadClosures = [], gasStation = 'Marketplace') {
		this.place = place;
		this.parcels = parcels;
		this.fuel = fuel;
		this.roadClosures = roadClosures;
		this.gasStation = gasStation;
	}

	move(destination) {
		// Check if the move is valid (not blocked by a closure)
		const isRoadClosed = this.roadClosures.some(r =>
			(r.from === this.place && r.to === destination) ||
			(r.from === destination && r.to === this.place))

		// Check if the destination is reachable from the current place
		if (!roadGraph[this.place].includes(destination) || isRoadClosed) {
			return this; // Stay in the same place if the move is invalid
		}

		// Refuel at the gas station BEFORE moving (fixed logic)
		let newFuel = this.fuel;
		if (this.place === this.gasStation) {
			newFuel = 100; // Refuel at the gas station
		}

		// A move consumes fuel
		newFuel = newFuel - 1;

		if (newFuel <= 0) {
			console.log('Robot ran out of fuel!');
			return new VillageState(destination, [], 0, this.roadClosures, this.gasStation)
		}

		// Move parcels that are at the current location to the new destination
		let parcels = this.parcels.map(p => {
			if (p.place != this.place) return p;
			return { ...p, place: destination }
		}).filter(p => p.place != p.address); // Drop off delivered parcels

		return new VillageState(destination, parcels, newFuel, this.roadClosures, this.gasStation);
	}

	// Generates a random state with a given number of parcels
	static random(parcelCount = 5) {
		let parcels = []
		for (let i = 0; i < parcelCount; i++) {
			let address = randomPick(Object.keys(roadGraph));
			let place;
			do {
				place = randomPick(Object.keys(roadGraph))
			} while (place === address); // Ensure pickup and drop-off are different
			parcels.push({
				place,
				address,
				weight: randomPick([1, 2, 3])
			}) // Assign a random weight
		}

		// Randomly close one road
		const roadToClose = randomPick(roads).split('-');
		const roadClosures = [{ from: roadToClose[0], to: roadToClose[1] }]

		return new VillageState('Post Office', parcels, 100, roadClosures);
	}
}

function randomPick(arrRoadGraph) {
	return arrRoadGraph[Math.floor(Math.random() * arrRoadGraph.length)];
}

function randomRobot(state) {
	return { direction: randomPick(roadGraph[state.place]) }
}

function findRoute(graph, from, to, closedRoads = []) {
	let work = [{ at: from, route: [] }];
	for (let i = 0; i < work.length; i++) {
		let { at, route } = work[i];
		for (let place of graph[at]) {
			const isRoadClosed = closedRoads.some(r => (r.from === at && r.to === place) || (r.from === place && r.to === at));
			if (isRoadClosed) continue; // Skip closed roads
			if (place == to) return route.concat(place);
			if (!work.some(w => w.at == place)) work.push({ at: place, route: route.concat(place) })
		}
	}
}

/**
 * The ultimate robot that handles capacity, fuel and road closures.
 */
function superRobot({ place, parcels, fuel, roadClosures, gasStation }, memory) {
	const capacity = 10;
	let route = (memory && memory.route) ? memory.route : [];

	if (route.length === 0) {
		const currentLoad = parcels
			.filter(p => p.place === place)
			.reduce((sum, p) => sum + p.weight, 0);

		// Check if we need to refuel urgently
		const routeToGas = findRoute(roadGraph, place, gasStation, roadClosures);
		if (fuel < (routeToGas ? routeToGas.length : Infinity) + 15) { // Fuel buffer
			if (routeToGas) {
				route = routeToGas;
				return {
					direction: route[0],
					memory: { route: route.slice(1) }
				}
			}
		}

		// Identify all possible tasks (pickups, deliveries)
		let possibleTasks = parcels.map(parcel => ({
			route: findRoute(roadGraph, place, parcel.place !== place ? parcel.place : parcel.address, roadClosures),
			parcel,
			type: parcel.place !== place ? 'pickup' : 'delivery'
		})).filter(task => task.route != null); // Filter out unreachable tasks

		// Filter tasks based on capacity
		let feasibleTasks = possibleTasks.filter(task => {
			if (task.type === 'pickup') return currentLoad + task.parcel.weight <= capacity;
			return true
		});

		if (feasibleTasks.length === 0) feasibleTasks = possibleTasks.filter(task => task.type === 'delivery')
		if (feasibleTasks.length === 0) return { direction: randomPick(roadGraph[place]), memory: { route: [] } }

		// Score and choose the best task
		function score({ route, type }) {
			return route.length + (type === 'pickup' ? 0.5 : 0)
		}

		route = feasibleTasks.reduce((a, b) => score(a) < score(b) ? a : b).route;
	}

	return { direction: route[0], memory: { route: route.slice(1) } }
}

/**
 * A more efficient robot that chooses the shortest path to the nearest
 * parcel, whether it's a pickup or a delivery.
 * FIXED: Now properly handles roadClosures and fuel management
 */
function efficientRobot({ place, parcels, fuel, roadClosures, gasStation }, memory) {
	let route = (memory && memory.route) ? memory.route : [];

	if (route.length === 0) {
		// Check if we need to refuel urgently
		const routeToGas = findRoute(roadGraph, place, gasStation, roadClosures);
		if (fuel < (routeToGas ? routeToGas.length : Infinity) + 10) { // Fuel buffer
			if (routeToGas) {
				route = routeToGas;
				return {
					direction: route[0],
					memory: { route: route.slice(1) }
				}
			}
		}

		// Find routes for all possible tasks (pickups and deliveries)
		let routes = parcels.map(parcel => {
			if (parcel.place != place) {
				return { route: findRoute(roadGraph, place, parcel.place, roadClosures), pickUp: true }
			} else {
				return { route: findRoute(roadGraph, place, parcel.address, roadClosures), pickUp: false }
			}
		}).filter(r => r.route != null); // Filter out unreachable routes

		if (routes.length === 0) {
			return { direction: randomPick(roadGraph[place]), memory: { route: [] } };
		}

		// Score each route. A lower score is better.
		function score({ route, pickUp }) {
			return (pickUp ? 0.5 : 0) + route.length;
		}

		// Choose the route with the best score (the lowest number)
		route = routes.reduce((a, b) => score(a) < score(b) ? a : b).route;
	}

	return { direction: route[0], memory: { route: route.slice(1) } }
}

/**
 * A robot that considers parcel weight and its own carrying capacity.
 */
function capacityRobot({ place, parcels, fuel, roadClosures, gasStation }, memory) {
	const capacity = 10;
	let route = memory && memory.route ? memory.route : [];

	if (route.length == 0) {
		// Check if we need to refuel urgently
		const routeToGas = findRoute(roadGraph, place, gasStation, roadClosures);
		if (fuel < (routeToGas ? routeToGas.length : Infinity) + 10) { // Fuel buffer
			if (routeToGas) {
				route = routeToGas;
				return {
					direction: route[0],
					memory: { route: route.slice(1) }
				}
			}
		}

		const currentLoad = parcels.filter(p => p.place === place).reduce((sum, p) => sum + p.weight, 0);

		let possibleTasks = parcels.map(p => ({
			route: findRoute(roadGraph, place, p.place !== place ? p.place : p.address, roadClosures),
			parcel: p,
			type: p.place !== place ? "pickup" : "delivery"
		})).filter(t => t.route != null); // Filter out unreachable tasks

		let feasibleTasks = possibleTasks.filter(t => t.type === "pickup" ? currentLoad + t.parcel.weight <= capacity : true);

		if (feasibleTasks.length === 0) {
			feasibleTasks = possibleTasks.filter(t => t.type === "delivery");
		}

		if (feasibleTasks.length === 0) {
			return { direction: randomPick(roadGraph[place]), memory: { route: [] } };
		}

		function score({ route, type }) { return route.length + (type === "pickup" ? 0.5 : 0); }
		route = feasibleTasks.reduce((a, b) => score(a) < score(b) ? a : b).route;
	}
	return { direction: route[0], memory: { route: route.slice(1) } };
}

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

function routeRobot(state, memory) {
	if (memory.length === 0) {
		memory = mailRoute;
	}
	return { direction: memory[0], memory: memory.slice(1) }
}

function goalOrientedRobot({ place, parcels, roadClosures }, route) {
	if (route.length == 0) {
		let parcel = parcels[0];
		if (parcel.place != place) {
			route = findRoute(roadGraph, place, parcel.place, roadClosures)
		} else {
			route = findRoute(roadGraph, place, parcel.address, roadClosures)
		}
	}
	return {
		direction: route[0],
		memory: route.slice(1)
	}
}

/**
 * Runs a robot for a single task and returns the number of turns it took.
 */
function runTask(state, robot, memory) {
	for (let turn = 0; ; turn++) {
		if (state.parcels.length === 0) {
			return turn; // Task complete
		}

		if (state.fuel <= 0) {
			return 500; // Penalize for running out of fuel
		}

		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
	}
}

/**
 * Compares the performance of two robots over 100 identical tasks.
 */
function compareRobots(robot1, memory1, robot2, memory2) {
	let total1 = 0, total2 = 0;
	const tasks = 100;
	const taskStates = [];

	for (let i = 0; i < tasks; i++) {
		taskStates.push(VillageState.random());
	}

	for (let i = 0; i < tasks; i++) {
		// Create a fresh copy of the state for each robot run
		let state1 = new VillageState(taskStates[i].place, taskStates[i].parcels.slice(), taskStates[i].fuel, taskStates[i].roadClosures, taskStates[i].gasStation);
		let state2 = new VillageState(taskStates[i].place, taskStates[i].parcels.slice(), taskStates[i].fuel, taskStates[i].roadClosures, taskStates[i].gasStation);

		// Use consistent memory initialization
		let currentMemory1 = { route: [] };
		let currentMemory2 = { route: [] };

		total1 += runTask(state1, robot1, currentMemory1);
		total2 += runTask(state2, robot2, currentMemory2);
	}

	console.log(`--- Robot Comparison (${tasks} tasks) ---`);
	console.log(`${robot1.name} needed an average of ${total1 / tasks} steps per task.`);
	console.log(`${robot2.name} needed an average of ${total2 / tasks} steps per task.`);
}

compareRobots(capacityRobot, { route: [] }, superRobot, { route: [] });
// ============================================
// WRITER MONAD - Accumulating Values
// ============================================

class Writer {
	constructor(value, log) {
		this.value = value;
		this.log = log;
	}

	static of(value, monoid) {
		return new Writer(value, monoid.empty());
	}

	map(fn) {
		return new Writer(fn(this.value), this.log);
	}

	flatMap(fn, monoid) {
		const result = fn(this.value);
		return new Writer(
			result.value,
			monoid.concat(this.log, result.log)
		);
	}

	tell(log, monoid) {
		return new Writer(this.value, monoid.concat(this.log, log));
	}

	run() {
		return [this.value, this.log];
	}
}

// Monoids for different log types
const StringMonoid = {
	empty: () => '',
	concat: (a, b) => a + b
};

const ArrayMonoid = {
	empty: () => [],
	concat: (a, b) => [...a, ...b]
};

const SumMonoid = {
	empty: () => 0,
	concat: (a, b) => a + b
};

// ============================================
// REAL-WORLD: AUDIT LOGGING SYSTEM
// ============================================

class AuditLog {
	constructor(entries = []) {
		this.entries = entries;
	}

	static empty() {
		return new AuditLog([]);
	}

	static concat(log1, log2) {
		return new AuditLog([...log1.entries, ...log2.entries]);
	}

	add(entry) {
		return new AuditLog([...this.entries, {
			...entry,
			timestamp: new Date().toISOString()
		}]);
	}
}

const AuditMonoid = {
	empty: () => AuditLog.empty(),
	concat: (a, b) => AuditLog.concat(a, b)
};

// Business logic with audit logging
const calculatePrice = (items) => {
	const basePrice = items.reduce((sum, item) => sum + item.price, 0);
	return new Writer(
		basePrice,
		new AuditLog([{
			action: 'CALCULATE_BASE_PRICE',
			details: { itemCount: items.length, basePrice }
		}])
	);
};

const applyDiscount = (price, discountPercent) => {
	const discountAmount = price * (discountPercent / 100);
	const discountedPrice = price - discountAmount;

	return new Writer(
		discountedPrice,
		new AuditLog([{
			action: 'APPLY_DISCOUNT',
			details: {
				originalPrice: price,
				discountPercent,
				discountAmount,
				finalPrice: discountedPrice
			}
		}])
	);
};

const applyTax = (price, taxRate) => {
	const taxAmount = price * taxRate;
	const totalPrice = price + taxAmount;

	return new Writer(
		totalPrice,
		new AuditLog([{
			action: 'APPLY_TAX',
			details: {
				priceBeforeTax: price,
				taxRate,
				taxAmount,
				totalPrice
			}
		}])
	);
};

const calculateShipping = (price, weight) => {
	const shippingRate = weight < 5 ? 5 : weight < 10 ? 10 : 20;

	return new Writer(
		price + shippingRate,
		new AuditLog([{
			action: 'CALCULATE_SHIPPING',
			details: {
				weight,
				shippingRate,
				totalWithShipping: price + shippingRate
			}
		}])
	);
};

// Compose pricing operations
const processPurchase = (items, discountPercent, taxRate) => {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

	return calculatePrice(items)
		.flatMap(price => applyDiscount(price, discountPercent), AuditMonoid)
		.flatMap(price => applyTax(price, taxRate), AuditMonoid)
		.flatMap(price => calculateShipping(price, totalWeight), AuditMonoid)
		.tell(new AuditLog([{
			action: 'PURCHASE_COMPLETED',
			details: { timestamp: new Date().toISOString() }
		}]), AuditMonoid);
};

// Execute with audit trail
const items = [
	{ name: 'Laptop', price: 1000, weight: 2 },
	{ name: 'Mouse', price: 50, weight: 0.1 },
	{ name: 'Keyboard', price: 100, weight: 0.5 }
];

const [finalPrice, auditLog] = processPurchase(items, 10, 0.08).run();
console.log('Final Price:', finalPrice);
console.log('Audit Trail:', auditLog.entries);

// ============================================
// PERFORMANCE MONITORING WITH WRITER
// ============================================

class PerformanceLog {
	constructor(metrics = []) {
		this.metrics = metrics;
	}

	static empty() {
		return new PerformanceLog([]);
	}

	static concat(log1, log2) {
		return new PerformanceLog([...log1.metrics, ...log2.metrics]);
	}

	record(operation, duration, metadata = {}) {
		return new PerformanceLog([...this.metrics, {
			operation,
			duration,
			metadata,
			timestamp: Date.now()
		}]);
	}

	getStats() {
		const grouped = {};
		this.metrics.forEach(metric => {
			if (!grouped[metric.operation]) {
				grouped[metric.operation] = [];
			}
			grouped[metric.operation].push(metric.duration);
		});

		return Object.entries(grouped).map(([operation, durations]) => ({
			operation,
			count: durations.length,
			total: durations.reduce((a, b) => a + b, 0),
			average: durations.reduce((a, b) => a + b, 0) / durations.length,
			min: Math.min(...durations),
			max: Math.max(...durations)
		}));
	}
}

const PerformanceMonoid = {
	empty: () => PerformanceLog.empty(),
	concat: (a, b) => PerformanceLog.concat(a, b)
};

// Wrap operations with performance monitoring
const timedOperation = (name, operation) => {
	return (...args) => {
		const startTime = performance.now();
		const result = operation(...args);
		const duration = performance.now() - startTime;

		return new Writer(
			result,
			new PerformanceLog().record(name, duration, { args })
		);
	};
};

// Example operations
const expensiveCalculation = timedOperation('calculation', (n) => {
	let result = 0;
	for (let i = 0; i < n * 1000000; i++) {
		result += Math.sqrt(i);
	}
	return result;
});

const dataProcessing = timedOperation('processing', (data) => {
	return data.map(x => x * 2).filter(x => x > 10);
});

const apiCall = timedOperation('api', async (url) => {
	// Simulate API call
	await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
	return { data: 'response' };
});

// Compose monitored operations
const workflow = () => {
	return expensiveCalculation(10)
		.flatMap(result => dataProcessing([1, 2, 3, 4, 5, 10, 20]), PerformanceMonoid)
		.flatMap(data => expensiveCalculation(5), PerformanceMonoid)
		.map(result => ({ success: true, result }));
};

const [workflowResult, performanceLog] = workflow().run();
console.log('Result:', workflowResult);
console.log('Performance Stats:', performanceLog.getStats());
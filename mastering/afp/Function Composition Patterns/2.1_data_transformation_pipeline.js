// ============================================
// E-COMMERCE ORDER PROCESSING SYSTEM
// ============================================

class OrderProcessor {
	constructor() {
		this.middleware = [];
	}

	// HOF t hat creates middleware functions
	static createMiddleware(name, fn) {
		return async (context) => {
			console.log(`[${name}] starting...`);
			const startTime = Date.now();

			try {
				const result = await fn(context);
				const duration = Date.now() - startTime;
				console.log(`[${name}] Completed in ${duration}ms`)
				return result;
			} catch (error) {
				console.error(`[${name}] Failed: ${error.message}`);
				throw error;
			}
		};
	}

	// HOF for creating validators
	static createValidator(rules) {
		return (order) => {
			const errors = [];
			for (const [field, validators] of Object.entries(rules)) {
				const value = field.split('.').reduce((obj, key) => obj?.[key], order);

				for (const validator of validators) {
					const error = validator(value, field);
					if (error) errors.push(error);
				}
			}

			if (errors.length > 0) {
				throw new ValidationError(errors)
			}

			return order;
		};
	}
}

// Validation rules using HOFs
const required = (message) => (value, field) =>
	!value ? `${field} is required: ${message}` : null;

const minAmount = (min) => (value, field) =>
	value < min ? `${field} must be at least ${min}` : null;

const inRange = (min, max) => (value, field) =>
	value < min || value > max ? `${field} must be between ${min} and ${max}` : null;


// create order validator
const validateOrder = OrderProcessor.createValidator({
	'customer.id': [required('Customer ID is mandatory')],
	'customer.email': [required('Email is needed for confirmation')],
	'items': [
		value => !Array.isArray(value) || value.length === 0
			? 'Order must contain items'
			: null
	],
	'payment.amount': [
		require('Payment amount missing'),
		minAmount(0.01)
	],
});

// HOF for creating calculators
const createPriceCalculator = (strategies) => {
	return (order) => {
		let totalPrice = 0;

		// Base price calculation
		for (const item of order.items) {
			totalPrice += item.price * item.quantity;
		}

		// Apply pricing strategies (discount, taxes, etc.)
		const context = { order, totalPrice };

		for (const strategy of strategies) {
			totalPrice = strategy(context);
			context.totalPrice = totalPrice;
		}

		return {
			...order,
			pricing: {
				...context,
				final: totalPrice
			}
		}
	}
}

// Pricing strategies as HOFs
const percentageDiscount = (percentage) => ({ totalPrice, order }) => {
	if (order.coupon?.type === 'percentage') {
		return totalPrice * (1 - percentage / 100);
	}

	return totalPrice;
}

const bulkDiscount = (minItems, discountRate) => ({ totalPrice, order }) => {
	const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
	return totalItems >= minItems ? totalPrice * (1 - discountRate) : totalPrice;
}

const addTax = (taxRate) => ({ totalPrice }) => totalPrice * (1 + taxRate);

const addShipping = (shippingRates) => ({ totalPrice, order }) => {
	const weight = order.items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
	const shippingCost = shippingRates.find(rate => weight <= rate.maxWeight)?.cost || 0;
	return totalPrice + shippingCost;
}

// Compose the complete pipeline
const processOrder = pipe(
	validateOrder,
	createPriceCalculator([
		percentageDiscount(10),
		bulkDiscount(5, 0.15),
		addTax(0.08),
		addShipping([
			{ maxWeight: 1, cost: 5 },
			{ maxWeight: 5, cost: 10 },
			{ maxWeight: 10, cost: 20 },
		])
	]),
	OrderProcessor.createMiddleware('inventory', checkInventory),
	OrderProcessor.createMiddleware('payment', processPayment),
	OrderProcessor.createMiddleware('fulfillment', createFulfillment),
	OrderProcessor.createMiddleware('notification', sendNotifications),
)













































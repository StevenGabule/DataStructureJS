// ============================================
// COMPOSABLE FORM VALIDATION SYSTEM
// ============================================

// HOF: Create validator composer
const createValidatorComposer = () => {
	const validators = new Map();

	// Core validator HOF
	const createValidator = (name, validationFn, errorMessage) => {
		return (value, context = {}) => {
			const isValid = validationFn(value, context);
			return isValid ? null : {
				validator: name,
				message: typeof errorMessage === 'function'
					? errorMessage(value, context)
					: errorMessage,
				value
			};
		};
	};

	// Validator combinators
	const add = (...validators) => {
		return (value, context) => {
			for (const validator of validators) {
				const error = validator(value, context);
				if (error) return error;
			}

			return null;
		}
	}

	const or = (...validators) => {
		return (value, context) => {
			const errors = [];
			for (const validator of validators) {
				const error = validator(value, context);
				if (!error) return null;
				errors.push(error);
			}

			return {
				validator: 'or',
				message: `None of the condition were met: ${errors.map(e => e.message).join(', ')}`,
				value
			};
		};
	};

	const not = (validator) => {
		return (value, context) => {
			const error = validator(value, context);
			return error ? null : {
				validator: 'not',
				message: `Value should not pass validation but it did`,
				value
			};
		};
	};

	return { createValidator, and, or, not, validators }
}

// Create validator library
const v = createValidatorComposer();

// Basic validators
const required = v.createValidator(
	'required',
	value => value != null && value !== '',
	'This field is required'
)

const minLength = (min) => v.createValidator(
	'minLength',
	value => !value || value.length >= min,
	value => `Must be at least ${min} characters.`
)

const maxLength = (max) => v.createValidator(
	'maxLength',
	value => !value || value.length <= max,
	value => `Must be at most ${max} characters`
);

const pattern = (regex, message) => v.createValidator(
	'pattern',
	value => !value || regex.test(value),
	message || 'Invalid format'
);

const email = pattern(
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	'Please enter a valid email address'
);

const numeric = v.createValidator(
	'numeric',
	value => !value || !isNaN(Number(value)),
	'Must be a number'
);

const inRange = (min, max) => v.createValidator(
	'inRange',
	value => {
		const num = Number(value);
		return !value || (num >= min && num <= max);
	},
	`Must be between ${min} and ${max}`
)

const password = v.and(
	required,
	minLength(8),
	maxLength(128),
	pattern(/[A-Z]/, 'Must contain at least one uppercase letter'),
	pattern(/[a-z]/, 'Must contain at least one lowercase letter'),
	pattern(/[0-9]/, 'Must contain at least one number'),
	pattern(/[!@#$%^&*]/, 'Must contain at least one special character')
);

const username = v.and(
	required,
	minLength(3),
	maxLength(20),
	pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed.')
)

// HOF: Create form validator
const createFormValidator = (schema) => {
	return (formData) => {
		const errors = {};
		const validated = {};

		for (const [field, validators] of Object.entries(schema)) {
			const value = formData[field];
			const fieldErrors = [];

			// Support single validator or array of validators
			const validatorList = Array.isArray(validators) ? validators : [validators];

			for (const validator of validatorList) {
				const error = validator(value, formData);
				if (error) {
					fieldErrors.push(error);
				}
			}

			if (fieldErrors.length > 0) {
				errors[field] = fieldErrors;
			} else {
				validated[field] = value;
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
			validated
		}
	}
}

// HOF: Create async validator
const createAsyncValidator = (validatorFn, errorMessage) => {
	return async (value, context) => {
		try {
			const isValid = await validatorFn(value, context);
			return isValid ? null : {
				validator: 'async',
				message: errorMessage,
				value
			};
		} catch (error) {
			return {
				validator: 'async',
				message: error.message || errorMessage,
				value
			}
		}
	}
}

// Async validators
const uniqueUsername = createAsyncValidator(
	async (username) => {
		const response = await fetch(`/api/v1/check-username/${username}`);
		const { available } = await response.json();
		return available;
	},
	'Username is already taken'
);

const validCaptcha = createAsyncValidator(
	async (token) => {
		const response = await fetch('/api/verify-captcha', {
			method: 'POST',
			body: JSON.stringify({ token })
		});

		return response.ok
	},
	'Invalid captcha'
);

// Complete form validation example
const registrationFormValidator = createFormValidator({
	username: [username, uniqueUsername],
	email: [required, email],
	password: password,
	confirmPassword: [
		required,
		v.createValidator(
			'match',
			(value, context) => value === context.password,
			'Passwords do not match'
		)
	],
	age: [required, numeric, inRange(18, 120)],
	terms: v.createValidator(
		'accepted',
		value => value === true,
		'You must accept the terms and conditions'
	)
});

// Usage
const formData = {
	username: 'john_doe',
	email: 'john@example.com',
	password: 'SecureP@ss123',
	age: '25',
	terms: true
}

registrationFormValidator(formData).then(result => {
	if (result.isValid) console.log(`Form is valid: ${result.validated}`);
	else console.log(`Validation errors: ${result.errors}`);
})
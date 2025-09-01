// named-exports.js
export const PI = 3.14159;
export function calculationArea(radius) {
	return PI * radius * radius;
}

export class Circle {
	constructor(radius) {
		this.radius = radius;
	}
}

// default-export.js
const utilityFunction = data => {
	return data.map(item => item.toUpperCase())
}

export default utilityFunction;

// importing.js
// import utilityFunction from './default-export.js';
// import {PI, calculationArea} from './name-exports.js'
// import {calculationArea as calcArea} from './named-exports.js'
// import * as MathUtils from './name-exports.js'

// React Module Pattern
// import React from 'react'
// import {useState, useEffect} from 'react'
// import './Component.css'

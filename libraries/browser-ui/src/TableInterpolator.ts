/**
* Returns a value based on a response curve defined by tabular data.
* Some pre-defined graceful curves (gaussian, for example) are pre-defined as part of class
* @author arzga
*
* INTERPOLATE USAGE:
*
* float outputValue = TableInterpolator.interpolateLinearf(TableInterpolator.gaussian, 30, 0, 100f);
*
* Example:
*  - Output curve is defined by values in a float array (in this gaussian curve example: values ranging from 0.0f via 1.0f back to 0.0f).
*  - We want the interpolateLinearf to interpolate and return the value at position 30 on the curve
*  - The input value range in this call is defined as 0 to 100.
*  - The output curve is "stretched" to fit the input range. The table defining the curve may have an arbitrary number of values, they just enhance the resolution of the curve.
*  - A linear interpolated value is returned based on two neighbouring tabular values.
*  - If pos < min, first table value is returned
*  - If pos > max, last table value is returned 
*
* EXTRAPOLATE USAGE:
*
* float outputValue = TableInterpolator.extrapolateLinearf(TableInterpolator.gaussian, 30, 0, 100f);
*
* To extrapolate output values outside input range, use extrapolateLinearf. Within input range, it functions exactly as interpolateLinearf.
* Output values outside input range are linearly extrapolated based on two first/last values of tabular data.
* 
**/

export const fadeIn = [0.0, 1.0];
export const fadeOut = [1.0, 0.0];
// __..-´´-..__		0..1..0
export const gaussian = [0.0, 0.007822, 0.01286, 0.020581, 0.032067, 0.048637, 0.071812, 0.10322, 0.14443, 0.196733, 0.260872, 0.336749, 0.423169, 0.517666, 0.616473, 0.714672, 0.806545, 0.886091, 0.94767, 0.986653, 1, 0.986653, 0.94767, 0.886091, 0.806545, 0.714672, 0.616473, 0.517666, 0.423169, 0.336749, 0.260872, 0.196733, 0.14443, 0.10322, 0.071812, 0.048637, 0.032067, 0.020581, 0.01286, 0.007822, 0.0];

// _____-´´´´´´		0..1
export const easeInOut = [0.0, 0.00092, 0.001585, 0.002661, 0.004359, 0.006966, 0.010864, 0.016538, 0.024579, 0.035672, 0.050571, 0.070051, 0.094849, 0.125579, 0.162654, 0.206202, 0.255996, 0.311429, 0.371505, 0.434891, 0.5, 0.565109, 0.628495, 0.688571, 0.744004, 0.793798, 0.837346, 0.874421, 0.905151, 0.929949, 0.949429, 0.964328, 0.975421, 0.983462, 0.989136, 0.993034, 0.995641, 0.997339, 0.998415, 0.99908, 1.0];

// __--------´´		-1..0..1
export const hyperbolic = [-1.0, -0.895317, -0.792429, -0.693037, -0.598669, -0.510606, -0.429835, -0.357023, -0.29251, -0.23633, -0.188245, -0.147794, -0.114348, -0.087169, -0.06546, -0.048418, -0.035268, -0.025297, -0.017864, -0.012419, 0, 0.012419, 0.017864, 0.025297, 0.035268, 0.048418, 0.06546, 0.087169, 0.114348, 0.147794, 0.188245, 0.23633, 0.29251, 0.357023, 0.429835, 0.510606, 0.598669, 0.693037, 0.792429, 0.895317, 1.0];

// _.--´´´´--._		0..1..0
export const ballistic = [0.0, 0.36, 0.64, 0.84, 0.96, 1, 0.96, 0.84, 0.64, 0.36, 0.0];

// _..---´´´´´´		0..1
export const saturate = [0.0, 0.19, 0.36, 0.51, 0.64, 0.75, 0.84, 0.91, 0.96, 0.99, 1.0];

// _.--´´´´´´´´		0..1
export const saturate3 = [0.0, 0.271, 0.488, 0.657, 0.784, 0.875, 0.936, 0.973, 0.992, 0.999, 1.0];

// ____...---´		0..1
export const exp = [0.0, 0.01, 0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81, 1.0];

// _____...--´		0..1
export const exp3 = [0.0, 0.001, 0.008, 0.027, 0.064, 0.125, 0.216, 0.343, 0.512, 0.729, 1.0];

// ________..-´		0..1
export const exp4 = [0.0, 0.0001, 0.0016, 0.0081, 0.0256, 0.0625, 0.1296, 0.2401, 0.4096, 0.6561, 1.0];

/**
 * Look up a matching y for x from table of "y-values" evenly mapped to x-axis range min..max
 * Linearly interpolate in-between values.
 * Repeat table edge y values for x values outside min..max range
 * @param table	Table of float values of at least 2 values
 * @param x
 * @param min	X coordinate of first value in table. If x < min, return first value in table
 * @param max	X coordinate of last value in table. If x > max, return first last in table
 * @return linearly interpolated value "y" corresponding to tabular data mapped to range min..max
 */

export function interpolateLinearf(table: number[], x: number, min: number, max: number): number {
	if (x < min) return table[0];
	if (x > max) return table[table.length-1];
	
	let step = (max - min) / (table.length - 1);
	if (step <= 0) return table[0]; 
	
	let index = (x - min) / step;
	let index_floor = Math.floor(index);
	let index_ceil = Math.ceil(index);
	let offset = index - index_floor;
	
	return ((1 - offset) * table[index_floor]) + (offset * table[index_ceil]);
}

/**
 * Look up a matching y for x from table of "y-values" evenly mapped to x-axis range min..max
 * Linearly interpolate in-between values.
 * Linearly extrapolate values for x values outside min..max, range based on 2 outermost values in table
 * @param table	Table of float values of at least 2 values
 * @param x
 * @param min	X coordinate of first value in table. If x < min, return linear value based on first and second entry in table
 * @param max	X coordinate of last value in table. If x > max, return linear value based on last and second-last entry in table
 * @return linearly extrapolated value "y" corresponding to tabular data mapped to range min..max
 */

 export function extrapolateLinearf(table: number[], x: number, min: number, max: number): number {
	if (x >= min && x <= max) {
		return interpolateLinearf(table, x, min, max);
	}

	let step = (max - min) / (table.length - 1);
	if (step <= 0) return table[0]; 
	
	if (x < min) {
		let j = table[1] - table[0];
		return (x - min) * j/step + table[0];
	}
	let k = table[table.length-1] - table[table.length-2];
	return (x - max) * k/step + table[table.length-1];
}

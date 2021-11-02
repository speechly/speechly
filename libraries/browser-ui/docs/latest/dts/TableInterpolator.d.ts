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
export declare const fadeIn: number[];
export declare const fadeOut: number[];
export declare const gaussian: number[];
export declare const easeInOut: number[];
export declare const hyperbolic: number[];
export declare const ballistic: number[];
export declare const saturate: number[];
export declare const saturate3: number[];
export declare const exp: number[];
export declare const exp3: number[];
export declare const exp4: number[];
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
export declare function interpolateLinearf(table: number[], x: number, min: number, max: number): number;
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
export declare function extrapolateLinearf(table: number[], x: number, min: number, max: number): number;

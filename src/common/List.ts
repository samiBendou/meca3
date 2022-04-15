/**
 *
 * ## Brief
 * Encodes values in different native Javascript types.
 *
 * #### Example
 * ```js
 * u.string(); // "(ox, oy, uz)"
 * m.array(); // [mxx, myx, mzx, mxy, ... ]
 * ```
 *
 * ## Float64Array
 * [[Encoder]] class inherits from [[Float64Array]] in order to provide double precision computation, an array subscript operator `u[k]`.
 * and native C/C++ array compatibility.
 * */
export default interface List {
  /** native Javascript array containing object's content */
  array(): number[];

  /** string containing a summary of object's content */
  string(): string;

  /** assigns components to a vector */
  assign(...coordinates: number[]): this;

  /** copies a source vector into `this` component by component */
  copy(vector: this): this;

  /** clone `this` vector */
  clone(): this;
}

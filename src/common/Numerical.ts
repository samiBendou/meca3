export default interface Numerical {
  /** reset to an additive neutral element `0` */
  reset0(): this;

  /** reset to a multiplicative neutral element `1` */
  reset1(): this;

  /** `Math.random` components by components */
  random(): this;

  /** `Math.floor` of the components */
  floor(): this;

  /** `Math.ceil` of the components */
  ceil(): this;

  /** `Math.round` of the components */
  round(): this;

  /** truncation of the components given a number of decimals to keep */
  trunc(decimals: number): this;

  /** `Math.abs` of the components */
  abs(): this;

  /** `Math.min` between the components of the two vectors  */
  min(vector: this): this;

  /** `Math.max` between the components of the two vectors */
  max(vector: this): this;

  /** fills `this` vector with a single scalar value `s` */
  fill(s: number): this;

  /** product between two vectors `u * v` */
  prod(vector: this): this;

  /** multiplicative inverse of a vector `u ** -1` **/
  inv(): this;

  /** `true` if the vector has only exacts 0 as coordinates */
  nil(): boolean;

  /** `true` if the vectors have exactly the same coordinates */
  exact(vector: this): boolean;
}

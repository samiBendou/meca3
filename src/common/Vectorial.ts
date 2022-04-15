export default interface Vectorial {
  /** dimension of the vector */
  readonly dim: number;

  /** usual addition between two vectors `u + v` */
  add(vector: this): this;

  /** usual subtraction between two vectors `u - v` */
  sub(vector: this): this;

  /** usual opposite of the vector `-u` */
  neg(): this;

  /** usual scalar multiplication of the vector `s * u` */
  mul(s: number): this;

  /** usual scalar division of the vector `u / s` */
  div(s: number): this;

  /** linear combination of a scalar and a vector `u + s * v` */
  comb(s: number, v: this): this;
}

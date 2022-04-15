import { Vector, Vector3 } from ".";
import { epsilon, epsilon2, Twice } from "../common/";

/**
 * ## Brief
 *
 * [[Vector3]] represents 6D vectors as a set of six numerical components. It implements [[Vector]] interface.
 *
 * ### Getting started
 *
 * [[Vector6]] objects are made of an array of three cartesian coordinates in an arbitrary basis `[x, y, z, u, v, w]`.
 * They can be considered the following column vector :
 *
 * ![Vector6 shape](media://vector6_shape.png)
 *
 * The [[Vector6]] class is a generalization of [[Vector3]] class but it does not provide geometrical features such as rotations.
 *
 * They can be considered as the concatenation of two parts :
 * - The upper one `(x, y, z)`
 * - The lower one `(u, v, w)`
 *
 * **Note** This representation is particularly useful when dealing with second order differential equations.
 *
 * #### Example
 * ```js
 * let u = Vector6(1, 2, 3, 4, 5, 6);
 * let v = u.upper; // Vector3(1, 2, 3)
 * u.lower = v; // u = (1, 2, 3, 1, 2, 3)
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */

export default class Vector6 implements Vector, Twice<Vector3> {
  dim: Readonly<number> = 6;

  /** upper part of the vector composed by the three first components */
  upper: Vector3;

  /** lower part of the vector composed by the three last components */
  lower: Vector3;

  /** norm of the vector */
  get mag(): number {
    const x = this.upper[0],
      y = this.upper[1],
      z = this.upper[2],
      u = this.lower[0],
      v = this.lower[1],
      w = this.lower[2];
    return Math.sqrt(x * x + y * y + z * z + u * u + v * v + w * w);
  }

  /** squared norm of the vector */
  get mag2(): number {
    const x = this.upper[0],
      y = this.upper[1],
      z = this.upper[2],
      u = this.lower[0],
      v = this.lower[1],
      w = this.lower[2];
    return x * x + y * y + z * z + u * u + v * v + w * w;
  }

  concat(upper: Vector3, lower: Vector3) {
    this.upper[0] = upper[0];
    this.upper[1] = upper[1];
    this.upper[2] = upper[2];
    this.lower[0] = lower[0];
    this.lower[1] = lower[1];
    this.lower[2] = lower[2];
    return this;
  }

  /** constructs a vector with coordinates */
  constructor(
    x: number,
    y: number,
    z: number,
    u: number,
    v: number,
    w: number
  ) {
    this.upper = new Vector3(x, y, z);
    this.lower = new Vector3(u, v, w);
  }

  string(): string {
    return `(${this.upper[0]}, ${this.upper[1]}, ${this.upper[2]}, ${this.lower[0]}, ${this.lower[1]}, ${this.lower[2]})`;
  }

  array(): number[] {
    return [...this.upper, ...this.lower];
  }

  assign(
    x: number,
    y: number,
    z: number,
    u: number,
    v: number,
    w: number
  ): this {
    this.upper[0] = x;
    this.upper[1] = y;
    this.upper[2] = z;
    this.lower[0] = u;
    this.lower[1] = v;
    this.lower[2] = w;
    return this;
  }

  copy(other: Vector6): this {
    this.upper[0] = other.upper[0];
    this.upper[1] = other.upper[1];
    this.upper[2] = other.upper[2];
    this.lower[0] = other.lower[0];
    this.lower[1] = other.lower[1];
    this.lower[2] = other.lower[2];
    return this;
  }

  clone(): this {
    return new Vector6(
      this.upper[0],
      this.upper[1],
      this.upper[2],
      this.lower[0],
      this.lower[1],
      this.lower[2]
    ) as this;
  }

  /** sets vector to zeros */
  reset0(): this {
    this.upper[0] = 0;
    this.upper[1] = 0;
    this.upper[2] = 0;
    this.lower[0] = 0;
    this.lower[1] = 0;
    this.lower[2] = 0;
    return this;
  }

  /** sets vector to ones */
  reset1(): this {
    this.upper[0] = 1;
    this.upper[1] = 1;
    this.upper[2] = 1;
    this.lower[0] = 1;
    this.lower[1] = 1;
    this.lower[2] = 1;
    return this;
  }

  random(): this {
    this.upper[0] = Math.random();
    this.upper[1] = Math.random();
    this.upper[2] = Math.random();
    this.lower[0] = Math.random();
    this.lower[1] = Math.random();
    this.lower[2] = Math.random();
    return this;
  }

  floor(): this {
    this.upper[0] = Math.floor(this.upper[0]);
    this.upper[1] = Math.floor(this.upper[1]);
    this.upper[2] = Math.floor(this.upper[2]);
    this.lower[0] = Math.floor(this.lower[0]);
    this.lower[1] = Math.floor(this.lower[1]);
    this.lower[2] = Math.floor(this.lower[2]);
    return this;
  }

  ceil(): this {
    this.upper[0] = Math.ceil(this.upper[0]);
    this.upper[1] = Math.ceil(this.upper[1]);
    this.upper[2] = Math.ceil(this.upper[2]);
    this.lower[0] = Math.ceil(this.lower[0]);
    this.lower[1] = Math.ceil(this.lower[1]);
    this.lower[2] = Math.ceil(this.lower[2]);
    return this;
  }

  round(): this {
    this.upper[0] = Math.round(this.upper[0]);
    this.upper[1] = Math.round(this.upper[1]);
    this.upper[2] = Math.round(this.upper[2]);
    this.lower[0] = Math.round(this.lower[0]);
    this.lower[1] = Math.round(this.lower[1]);
    this.lower[2] = Math.round(this.lower[2]);
    return this;
  }

  trunc(decimals: number): this {
    const pow10 = Math.pow(10, decimals);
    this.upper[0] = Math.round(this.upper[0] * pow10) / pow10;
    this.upper[1] = Math.round(this.upper[1] * pow10) / pow10;
    this.upper[2] = Math.round(this.upper[2] * pow10) / pow10;
    this.lower[0] = Math.round(this.lower[0] * pow10) / pow10;
    this.lower[1] = Math.round(this.lower[1] * pow10) / pow10;
    this.lower[2] = Math.round(this.lower[2] * pow10) / pow10;
    return this;
  }

  abs(): this {
    this.upper[0] = Math.abs(this.upper[0]);
    this.upper[1] = Math.abs(this.upper[1]);
    this.upper[2] = Math.abs(this.upper[2]);
    this.lower[0] = Math.abs(this.lower[0]);
    this.lower[1] = Math.abs(this.lower[1]);
    this.lower[2] = Math.abs(this.lower[2]);
    return this;
  }

  min(other: Vector6): this {
    this.upper[0] = Math.min(this.upper[0], other.upper[0]);
    this.upper[1] = Math.min(this.upper[1], other.upper[1]);
    this.upper[2] = Math.min(this.upper[2], other.upper[2]);
    this.lower[0] = Math.min(this.lower[0], other.lower[0]);
    this.lower[1] = Math.min(this.lower[1], other.lower[1]);
    this.lower[2] = Math.min(this.lower[2], other.lower[2]);
    return this;
  }

  max(other: Vector6): this {
    this.upper[0] = Math.max(this.upper[0], other.upper[0]);
    this.upper[1] = Math.max(this.upper[1], other.upper[1]);
    this.upper[2] = Math.max(this.upper[2], other.upper[2]);
    this.lower[0] = Math.max(this.lower[0], other.lower[0]);
    this.lower[1] = Math.max(this.lower[1], other.lower[1]);
    this.lower[2] = Math.max(this.lower[2], other.lower[2]);
    return this;
  }

  fill(s: number): this {
    this.upper[0] = s;
    this.upper[1] = s;
    this.upper[2] = s;
    this.lower[0] = s;
    this.lower[1] = s;
    this.lower[2] = s;
    return this;
  }

  norm(): this {
    const s = this.mag;
    this.upper[0] /= s;
    this.upper[1] /= s;
    this.upper[2] /= s;
    this.lower[0] /= s;
    this.lower[1] /= s;
    this.lower[2] /= s;
    return this;
  }

  add(other: Vector6): this {
    this.upper[0] += other.upper[0];
    this.upper[1] += other.upper[1];
    this.upper[2] += other.upper[2];
    this.lower[0] += other.lower[0];
    this.lower[1] += other.lower[1];
    this.lower[2] += other.lower[2];
    return this;
  }

  sub(other: Vector6): this {
    this.upper[0] -= other.upper[0];
    this.upper[1] -= other.upper[1];
    this.upper[2] -= other.upper[2];
    this.lower[0] -= other.lower[0];
    this.lower[1] -= other.lower[1];
    this.lower[2] -= other.lower[2];
    return this;
  }

  neg(): this {
    this.upper[0] *= -1;
    this.upper[1] *= -1;
    this.upper[2] *= -1;
    this.lower[0] *= -1;
    this.lower[1] *= -1;
    this.lower[2] *= -1;
    return this;
  }

  mul(s: number): this {
    this.upper[0] *= s;
    this.upper[1] *= s;
    this.upper[2] *= s;
    this.lower[0] *= s;
    this.lower[1] *= s;
    this.lower[2] *= s;
    return this;
  }

  div(s: number): this {
    this.upper[0] /= s;
    this.upper[1] /= s;
    this.upper[2] /= s;
    this.lower[0] /= s;
    this.lower[1] /= s;
    this.lower[2] /= s;
    return this;
  }

  comb(s: number, other: Vector6): this {
    this.upper[0] += s * other.upper[0];
    this.upper[1] += s * other.upper[1];
    this.upper[2] += s * other.upper[2];
    this.lower[0] += s * other.lower[0];
    this.lower[1] += s * other.lower[1];
    this.lower[2] += s * other.lower[2];
    return this;
  }

  lerp(other: Vector6, s: number): this {
    this.upper[0] += (other.upper[0] - this.upper[0]) * s;
    this.upper[1] += (other.upper[1] - this.upper[1]) * s;
    this.upper[2] += (other.upper[2] - this.upper[2]) * s;
    this.lower[0] += (other.lower[0] - this.lower[0]) * s;
    this.lower[1] += (other.lower[1] - this.lower[1]) * s;
    this.lower[2] += (other.lower[2] - this.lower[2]) * s;
    return this;
  }

  herp(other: Vector6, a: Vector6, b: Vector6, s: number): this {
    const s2 = s * s,
      t0 = s2 * (2 * s - 3) + 1,
      t1 = s2 * (s - 2) + s,
      t2 = s2 * (s - 1),
      t3 = s2 * (3 - 2 * s);
    this.upper[0] =
      this.upper[0] * t0 +
      a.upper[0] * t1 +
      b.upper[0] * t2 +
      other.upper[0] * t3;
    this.upper[1] =
      this.upper[1] * t0 +
      a.upper[1] * t1 +
      b.upper[1] * t2 +
      other.upper[1] * t3;
    this.upper[2] =
      this.upper[2] * t0 +
      a.upper[2] * t1 +
      b.upper[2] * t2 +
      other.upper[2] * t3;
    this.lower[0] =
      this.lower[0] * t0 +
      a.lower[0] * t1 +
      b.lower[0] * t2 +
      other.lower[0] * t3;
    this.lower[1] =
      this.lower[1] * t0 +
      a.lower[2] * t1 +
      b.lower[1] * t2 +
      other.lower[1] * t3;
    this.lower[2] =
      this.lower[2] * t0 +
      a.lower[3] * t1 +
      b.lower[2] * t2 +
      other.lower[2] * t3;
    return this;
  }

  berp(other: Vector6, a: Vector6, b: Vector6, s: number): this {
    const s2 = s * s,
      inv = 1 - s,
      inv2 = inv * inv,
      t0 = inv2 * inv,
      t1 = 3 * s * inv2,
      t2 = 3 * s2 * inv,
      t3 = s2 * s;
    this.upper[0] =
      this.upper[0] * t0 +
      a.upper[0] * t1 +
      b.upper[0] * t2 +
      other.upper[0] * t3;
    this.upper[1] =
      this.upper[1] * t0 +
      a.upper[1] * t1 +
      b.upper[1] * t2 +
      other.upper[1] * t3;
    this.upper[2] =
      this.upper[2] * t0 +
      a.upper[2] * t1 +
      b.upper[2] * t2 +
      other.upper[2] * t3;
    this.lower[0] =
      this.lower[0] * t0 +
      a.lower[0] * t1 +
      b.lower[0] * t2 +
      other.lower[0] * t3;
    this.lower[1] =
      this.lower[1] * t0 +
      a.lower[2] * t1 +
      b.lower[1] * t2 +
      other.lower[1] * t3;
    this.lower[2] =
      this.lower[2] * t0 +
      a.lower[3] * t1 +
      b.lower[2] * t2 +
      other.lower[2] * t3;
    return this;
  }

  der(ds: number, other: Vector6): this {
    this.upper[0] = (this.upper[0] - other.upper[0]) / ds;
    this.upper[1] = (this.upper[1] - other.upper[1]) / ds;
    this.upper[2] = (this.upper[2] - other.upper[2]) / ds;
    this.lower[0] = (this.lower[0] - other.lower[0]) / ds;
    this.lower[1] = (this.lower[1] - other.lower[1]) / ds;
    this.lower[2] = (this.lower[2] - other.lower[2]) / ds;
    return this;
  }

  /** Hadamard product of two vectors*/
  prod(other: Vector6): this {
    this.upper[0] *= other.upper[0];
    this.upper[1] *= other.upper[1];
    this.upper[2] *= other.upper[2];
    this.lower[0] *= other.lower[0];
    this.lower[1] *= other.lower[1];
    this.lower[2] *= other.lower[2];
    return this;
  }

  inv(): this {
    this.upper[0] **= -1;
    this.upper[1] **= -1;
    this.upper[2] **= -1;
    this.lower[0] **= -1;
    this.lower[1] **= -1;
    this.lower[2] **= -1;
    return this;
  }

  dot(other: Vector6): number {
    return (
      this.upper[0] * other.upper[0] +
      this.upper[1] * other.upper[1] +
      this.upper[2] * other.upper[2] +
      this.lower[0] * other.lower[0] +
      this.lower[1] * other.lower[1] +
      this.lower[2] * other.lower[2]
    );
  }

  dist(other: Vector6): number {
    return Math.sqrt(this.dist2(other));
  }

  dist1(other: Vector6): number {
    const dx = Math.abs(this.upper[0] - other.upper[0]),
      dy = Math.abs(this.upper[1] - other.upper[1]),
      dz = Math.abs(this.upper[2] - other.upper[2]),
      du = Math.abs(this.lower[0] - other.lower[0]),
      dv = Math.abs(this.lower[1] - other.lower[1]),
      dw = Math.abs(this.lower[2] - other.lower[2]);
    return dx + dy + dz + du + dv + dw;
  }

  dist2(other: Vector6): number {
    const dx = this.upper[0] - other.upper[0],
      dy = this.upper[1] - other.upper[1],
      dz = this.upper[2] - other.upper[2],
      du = this.lower[0] - other.lower[0],
      dv = this.lower[1] - other.lower[1],
      dw = this.lower[2] - other.lower[2];
    return dx * dx + dy * dy + dz * dz + du * du + dv * dv + dw * dw;
  }

  exact(other: Vector6): boolean {
    return (
      this.upper[0] === other.upper[0] &&
      this.upper[1] === other.upper[1] &&
      this.upper[2] === other.upper[2] &&
      this.lower[0] === other.lower[0] &&
      this.lower[1] === other.lower[1] &&
      this.lower[2] === other.lower[2]
    );
  }

  equal1(other: Vector6): boolean {
    const x = this.upper[0],
      y = this.upper[1],
      z = this.upper[2],
      ox = other.upper[0],
      oy = other.upper[1],
      uz = other.upper[2];
    const u = this.lower[0],
      v = this.lower[1],
      w = this.lower[2],
      uu = other.lower[0],
      uv = other.lower[1],
      uw = other.lower[2];

    // noinspection JSSuspiciousNameCombination
    return (
      Math.abs(x - ox) < epsilon &&
      Math.abs(y - oy) < epsilon &&
      Math.abs(z - uz) < epsilon &&
      Math.abs(u - uu) < epsilon &&
      Math.abs(v - uv) < epsilon &&
      Math.abs(w - uw) < epsilon
    );
  }

  equal2(other: Vector6): boolean {
    return this.dist2(other) < epsilon2;
  }

  nil(): boolean {
    return (
      this.upper[0] === 0 &&
      this.upper[1] === 0 &&
      this.upper[2] === 0 &&
      this.lower[0] === 0 &&
      this.lower[1] === 0 &&
      this.lower[2] === 0
    );
  }

  zero1(): boolean {
    const x = Math.abs(this.upper[0]),
      y = Math.abs(this.upper[1]),
      z = Math.abs(this.upper[2]),
      u = Math.abs(this.lower[0]),
      v = Math.abs(this.lower[1]),
      w = Math.abs(this.lower[2]);

    // noinspection JSSuspiciousNameCombination
    return (
      x <= epsilon * Math.max(1.0, x) &&
      y <= epsilon * Math.max(1.0, y) &&
      z <= epsilon * Math.max(1.0, z) &&
      u <= epsilon * Math.max(1.0, u) &&
      v <= epsilon * Math.max(1.0, v) &&
      w <= epsilon * Math.max(1.0, w)
    );
  }

  zero2(): boolean {
    const x = this.upper[0],
      y = this.upper[1],
      z = this.upper[2],
      u = this.lower[0],
      v = this.lower[1],
      w = this.lower[2];
    return x * x + y * y + z * z + u * u + v * v + w * w < epsilon2;
  }

  /** vector filled with `0` */
  static get zeros(): Vector6 {
    return new Vector6(0, 0, 0, 0, 0, 0);
  }

  /** vector filled with `1` */
  static get ones(): Vector6 {
    return new Vector6(1, 1, 1, 1, 1, 1);
  }

  /** vector filled with `s` */
  static scalar(s: number): Vector6 {
    return new Vector6(s, s, s, s, s, s);
  }

  /**
   * @brief canonical basis vector
   * @details vector filled with `1` at the `k`-th index and `0` elsewhere.
   * @param k {number} order of the vector in basis
   */
  static e(k: number): Vector6 {
    const ek = new Vector6(0, 0, 0, 0, 0, 0);
    if (k > 2) {
      ek.lower[k - 3] = 1;
    } else {
      ek.upper[k] = 1;
    }
    return ek;
  }

  /**
   * @brief canonical basis vector
   * @details vector filled with `-1` at the `k`-th index and `0` elsewhere.
   * @param k {number} order of the vector in basis
   */
  static en(k: number): Vector6 {
    const ek = new Vector6(0, 0, 0, 0, 0, 0);
    if (k > 2) {
      ek.lower[k - 3] = -1;
    } else {
      ek.upper[k] = -1;
    }
    return ek;
  }

  /** vector filled with uniform random values. See [[random]] for more details. */
  static random(): Vector6 {
    return new Vector6(
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    );
  }

  static concatenated(upper: Vector3, lower: Vector3) {
    return new Vector6(
      upper[0],
      upper[1],
      upper[2],
      lower[0],
      lower[1],
      lower[2]
    );
  }

  /** vector from coordinates of array in the form `[x, y, z, u, v, w, ...]` */
  static array(arr: number[]): Vector6 {
    return new Vector6(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
  }
}

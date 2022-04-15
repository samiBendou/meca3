import {
  epsilon,
  epsilon2,
  Matrix,
  Object3,
  Object9,
  Rotation3,
} from "../common/";
import { mag, mag2 } from "./Algebra";
import Vector3 from "./Vector3";

/**

 * ## Brief
 * [[Matrix3]] represents 3x3 dense matrices as a set of numerical components.
 * It implement [[Matrix]] interface and therefore [[Vector]] interface.
 *
 * ### Main features
 * - **1D-Array like** component accessors `other.z[0]`
 * - **Handy component accessors**  `xx`, `yz`, ...
 * - **Interface with [[Vector3]]** `x`, `y`, `z`, ...
 * - **Algebra** of matrices and vectors, `add`, `prodv`, `pow`, ...
 * - **Rotation** matrices, `rot`, `rotX`, ...
 * - **Many generators** `diag`, `sym`, `scalar`, ...
 *
 * Not all the operations have been detailed here
 * to learn more about provided operations see [[Matrix]].
 *
 * ## Getting Started
 *
 * A matrix is 1D-array of number stored in a column-major form, each components of the column are ordered
 * from up to down.
 *
 * ### Components accessors
 * In order to access the components of the matrix use the syntax `m.ij` where :
 * - `i` can be `x`, `y` or `z` and denotes the row index of the matrix in a descending order
 * - `j` can be `x`, `y` or `z` and denotes the column index of the matrix in a left-to-right order
 *
 * **Note** `m.ij` is equal to `other[3 * j + i]` if we consider `x == 0`, `y == 1` and `z == 2`.
 *
 * You can represent the matrix with theses conventions as :
 *
 * ![Matrix3 shape](media://matrix3_shape.png)
 *
 * #### Example
 * ```js
 * m.xx = 2; // other.x[0] = 2
 * m.yz = 5; // other.y[2] = 5
 * ```
 *
 * ### Interface with Vector3
 * [[Matrix3]] provides an interface with [[Vector3]] by implementing [[Object3]] interface.
 * It allows to construct vectors from rows and columns of the matrix.
 * Reciprocally you can affect rows and columns of the matrix with a `Vector3`.
 *
 * #### Example
 * ```js
 * m.x = new Vector3(2, 0, 2);
 * u = m.y;
 * m.xyz = [u, v, w];
 * ```
 *
 * For more details see [[Object3]].
 *
 * ### Rotation matrix
 * Generate rotation matrix using static methods.
 *
 * #### Example
 * ```js
 * // rotation matrix around x axis with angle +pi/4
 * m = Matrix3.rotX(Math.PI / 4);
 *
 * // rotation matrix around u axis with angle +pi/4
 * n = Matrix3.rot(u, Math.PI / 4);
 *
 * // elliptic rotation matrix around z axis with angle +pi/4
 * q = Matrix3.rotZ(Math.PI / 4, (x) => 5 * Math.cos(x), Math.sin);
 * ```
 *
 * If you want to get deep into rotation features see [[Object3]].
 *
 * You can also directly assign an existent matrix to a rotation matrix.
 *
 * #### Example
 * ```js
 * m.rotX(Math.PI / 3);
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
export default class Matrix3
  implements Matrix<Vector3>, Object3<Vector3>, Object9<number>, Rotation3
{
  dim: Readonly<number> = 9;

  /** first row as vector **/
  x: Vector3;

  /** second row as vector **/
  y: Vector3;

  /** third row as vector **/
  z: Vector3;

  /** rows of the matrix as vectors */
  get xyz(): [Vector3, Vector3, Vector3] {
    return [this.x, this.y, this.z];
  }

  set xyz(rows) {
    this.x[0] = rows[0][0];
    this.y[0] = rows[1][0];
    this.z[0] = rows[2][0];
    this.x[1] = rows[0][1];
    this.y[1] = rows[1][1];
    this.z[1] = rows[2][1];
    this.x[2] = rows[0][2];
    this.y[2] = rows[1][2];
    this.z[2] = rows[2][2];
  }

  /** columns of the matrix as vectors */
  get xyzt(): [Vector3, Vector3, Vector3] {
    return [
      new Vector3(this.x[0], this.y[0], this.z[0]),
      new Vector3(this.x[1], this.y[1], this.z[1]),
      new Vector3(this.x[2], this.y[2], this.z[2]),
    ];
  }

  set xyzt(cols) {
    this.x[0] = cols[0][0];
    this.y[0] = cols[0][1];
    this.z[0] = cols[0][2];
    this.x[1] = cols[1][0];
    this.y[1] = cols[1][1];
    this.z[1] = cols[1][2];
    this.x[2] = cols[2][0];
    this.y[2] = cols[2][1];
    this.z[2] = cols[2][2];
  }

  /** value at row 0, column 0 */
  get xx(): number {
    return this.x[0];
  }

  set xx(newXx) {
    this.x[0] = newXx;
  }

  /** value at row 1, column 0 */
  get yx(): number {
    return this.y[0];
  }

  set yx(newYx) {
    this.y[0] = newYx;
  }

  /** value at row 2, column 0 */
  get zx(): number {
    return this.z[0];
  }

  set zx(newZx) {
    this.z[0] = newZx;
  }

  /** value at row 0, column 1 */
  get xy(): number {
    return this.x[1];
  }

  set xy(newXy) {
    this.x[1] = newXy;
  }

  /** value at row 1, column 1 */
  get yy(): number {
    return this.y[1];
  }

  set yy(newYy) {
    this.y[1] = newYy;
  }

  /** value at row 2, column 1 */
  get zy(): number {
    return this.z[1];
  }

  set zy(newZy) {
    this.z[1] = newZy;
  }

  /** value at row 0, column 2 */
  get xz(): number {
    return this.x[2];
  }

  set xz(newXz) {
    this.x[2] = newXz;
  }

  /** value at row 1, column 2 */
  get yz(): number {
    return this.y[2];
  }

  set yz(newYz) {
    this.y[2] = newYz;
  }

  /** value at row 2, column 2 */
  get zz(): number {
    return this.z[2];
  }

  set zz(newZz) {
    this.z[2] = newZz;
  }

  get mag(): number {
    return mag(this);
  }

  get mag2(): number {
    return mag2(this);
  }

  get cols(): number[][] {
    return [
      [this.x[0], this.y[0], this.z[0]],
      [this.x[1], this.y[1], this.z[1]],
      [this.x[2], this.y[2], this.z[2]],
    ];
  }

  set cols(cols) {
    this.x[0] = cols[0][0];
    this.y[0] = cols[0][1];
    this.z[0] = cols[0][2];
    this.x[1] = cols[1][0];
    this.y[1] = cols[1][1];
    this.z[1] = cols[1][2];
    this.x[2] = cols[2][0];
    this.y[2] = cols[2][1];
    this.z[2] = cols[2][2];
  }

  get rows(): number[][] {
    return [
      [this.x[0], this.x[1], this.x[2]],
      [this.y[0], this.y[1], this.y[2]],
      [this.z[0], this.z[1], this.z[2]],
    ];
  }

  set rows(rows) {
    this.x[0] = rows[0][0];
    this.y[0] = rows[1][0];
    this.z[0] = rows[2][0];
    this.x[1] = rows[0][1];
    this.y[1] = rows[1][1];
    this.z[1] = rows[2][1];
    this.x[2] = rows[0][2];
    this.y[2] = rows[1][2];
    this.z[2] = rows[2][2];
  }

  get trace(): number {
    return this.x[0] + this.y[1] + this.z[2];
  }

  get det(): number {
    const mxx = this.x[0],
      myx = this.y[0],
      mzx = this.z[0],
      mxy = this.x[1],
      myy = this.y[1],
      mzy = this.z[1],
      mxz = this.x[2],
      myz = this.y[2],
      mzz = this.z[2];
    return (
      mxx * (mzz * myy - mzy * myz) +
      myx * (-mzz * mxy + mzy * mxz) +
      mzx * (myz * mxy - myy * mxz)
    );
  }

  /**
   * @brief constructs a matrix by explicitly giving components ordered by rows from left to right
   * @details If you don't specify components then the underlying array is initialized with the default values for `Float64Array`.
   */
  constructor(
    xx: number,
    xy: number,
    xz: number,
    yx: number,
    yy: number,
    yz: number,
    zx: number,
    zy: number,
    zz: number
  ) {
    this.x = new Vector3(xx, xy, xz);
    this.y = new Vector3(yx, yy, yz);
    this.z = new Vector3(zx, zy, zz);
  }

  string(): string {
    return (
      `(${this.x[0]}, ${this.x[1]}, ${this.x[2]})\n` +
      `(${this.y[0]}, ${this.y[1]}, ${this.y[2]})\n` +
      `(${this.z[0]}, ${this.z[1]}, ${this.z[2]})`
    );
  }

  array(): number[] {
    return [...this.x, ...this.y, ...this.z];
  }

  /** explicitly sets all the component of the matrix ordered as rows */
  assign(
    xx: number,
    xy: number,
    xz: number,
    yx: number,
    yy: number,
    yz: number,
    zx: number,
    zy: number,
    zz: number
  ): this {
    this.x[0] = xx;
    this.y[0] = yx;
    this.z[0] = zx;
    this.x[1] = xy;
    this.y[1] = yy;
    this.z[1] = zy;
    this.x[2] = xz;
    this.y[2] = yz;
    this.z[2] = zz;
    return this;
  }

  copy(other: Matrix3): this {
    this.x[0] = other.x[0];
    this.y[0] = other.y[0];
    this.z[0] = other.z[0];
    this.x[1] = other.x[1];
    this.y[1] = other.y[1];
    this.z[1] = other.z[1];
    this.x[2] = other.x[2];
    this.y[2] = other.y[2];
    this.z[2] = other.z[2];
    return this;
  }

  clone(): this {
    return new Matrix3(
      this.x[0],
      this.x[1],
      this.x[2],
      this.y[0],
      this.y[1],
      this.y[2],
      this.z[0],
      this.z[1],
      this.z[2]
    ) as this;
  }

  reset0(): this {
    this.x[0] = 0;
    this.y[0] = 0;
    this.z[0] = 0;
    this.x[1] = 0;
    this.y[1] = 0;
    this.z[1] = 0;
    this.x[2] = 0;
    this.y[2] = 0;
    this.z[2] = 0;
    return this;
  }

  /** sets matrix to identity */
  reset1(): this {
    this.x[0] = 1;
    this.y[0] = 0;
    this.z[0] = 0;
    this.x[1] = 0;
    this.y[1] = 1;
    this.z[1] = 0;
    this.x[2] = 0;
    this.y[2] = 0;
    this.z[2] = 1;
    return this;
  }

  random(): this {
    this.x[0] = Math.random();
    this.y[0] = Math.random();
    this.z[0] = Math.random();
    this.x[1] = Math.random();
    this.y[1] = Math.random();
    this.z[1] = Math.random();
    this.x[2] = Math.random();
    this.y[2] = Math.random();
    this.z[2] = Math.random();
    return this;
  }

  floor(): this {
    this.x[0] = Math.floor(this.x[0]);
    this.y[0] = Math.floor(this.y[0]);
    this.z[0] = Math.floor(this.z[0]);
    this.x[1] = Math.floor(this.x[1]);
    this.y[1] = Math.floor(this.y[1]);
    this.z[1] = Math.floor(this.z[1]);
    this.x[2] = Math.floor(this.x[2]);
    this.y[2] = Math.floor(this.y[2]);
    this.z[2] = Math.floor(this.z[2]);
    return this;
  }

  ceil(): this {
    this.x[0] = Math.ceil(this.x[0]);
    this.y[0] = Math.ceil(this.y[0]);
    this.z[0] = Math.ceil(this.z[0]);
    this.x[1] = Math.ceil(this.x[1]);
    this.y[1] = Math.ceil(this.y[1]);
    this.z[1] = Math.ceil(this.z[1]);
    this.x[2] = Math.ceil(this.x[2]);
    this.y[2] = Math.ceil(this.y[2]);
    this.z[2] = Math.ceil(this.z[2]);
    return this;
  }

  round(): this {
    this.x[0] = Math.round(this.x[0]);
    this.y[0] = Math.round(this.y[0]);
    this.z[0] = Math.round(this.z[0]);
    this.x[1] = Math.round(this.x[1]);
    this.y[1] = Math.round(this.y[1]);
    this.z[1] = Math.round(this.z[1]);
    this.x[2] = Math.round(this.x[2]);
    this.y[2] = Math.round(this.y[2]);
    this.z[2] = Math.round(this.z[2]);
    return this;
  }

  abs(): this {
    this.x[0] = Math.abs(this.x[0]);
    this.y[0] = Math.abs(this.y[0]);
    this.z[0] = Math.abs(this.z[0]);
    this.x[1] = Math.abs(this.x[1]);
    this.y[1] = Math.abs(this.y[1]);
    this.z[1] = Math.abs(this.z[1]);
    this.x[2] = Math.abs(this.x[2]);
    this.y[2] = Math.abs(this.y[2]);
    this.z[2] = Math.abs(this.z[2]);
    return this;
  }

  trunc(decimals: number): this {
    const pow10 = Math.pow(10, decimals);
    this.x[0] = Math.round(this.x[0] * pow10) / pow10;
    this.y[0] = Math.round(this.y[0] * pow10) / pow10;
    this.z[0] = Math.round(this.z[0] * pow10) / pow10;
    this.x[1] = Math.round(this.x[1] * pow10) / pow10;
    this.y[1] = Math.round(this.y[1] * pow10) / pow10;
    this.z[1] = Math.round(this.z[1] * pow10) / pow10;
    this.x[2] = Math.round(this.x[2] * pow10) / pow10;
    this.y[2] = Math.round(this.y[2] * pow10) / pow10;
    this.z[2] = Math.round(this.z[2] * pow10) / pow10;
    return undefined;
  }

  max(other: Matrix3): this {
    this.x[0] = Math.max(this.x[0], other.x[0]);
    this.y[0] = Math.max(this.x[0], other.y[0]);
    this.z[0] = Math.max(this.x[0], other.z[0]);
    this.x[1] = Math.max(this.x[0], other.x[1]);
    this.y[1] = Math.max(this.x[0], other.y[1]);
    this.z[1] = Math.max(this.x[0], other.z[1]);
    this.x[2] = Math.max(this.x[0], other.x[2]);
    this.y[2] = Math.max(this.x[0], other.y[2]);
    this.z[2] = Math.max(this.x[0], other.z[2]);
    return this;
  }

  min(other: Matrix3): this {
    this.x[0] = Math.min(this.x[0], other.x[0]);
    this.y[0] = Math.min(this.x[0], other.y[0]);
    this.z[0] = Math.min(this.x[0], other.z[0]);
    this.x[1] = Math.min(this.x[0], other.x[1]);
    this.y[1] = Math.min(this.x[0], other.y[1]);
    this.z[1] = Math.min(this.x[0], other.z[1]);
    this.x[2] = Math.min(this.x[0], other.x[2]);
    this.y[2] = Math.min(this.x[0], other.y[2]);
    this.z[2] = Math.min(this.x[0], other.z[2]);
    return this;
  }

  fill(s: number): this {
    this.x[0] = s;
    this.y[0] = s;
    this.z[0] = s;
    this.x[1] = s;
    this.y[1] = s;
    this.z[1] = s;
    this.x[2] = s;
    this.y[2] = s;
    this.z[2] = s;
    return this;
  }

  norm(): this {
    const s = mag(this);
    this.x[0] /= s;
    this.y[0] /= s;
    this.z[0] /= s;
    this.x[1] /= s;
    this.y[1] /= s;
    this.z[1] /= s;
    this.x[2] /= s;
    this.y[2] /= s;
    this.z[2] /= s;
    return this;
  }

  add(other: Matrix3): this {
    this.x[0] += other.x[0];
    this.y[0] += other.y[0];
    this.z[0] += other.z[0];
    this.x[1] += other.x[1];
    this.y[1] += other.y[1];
    this.z[1] += other.z[1];
    this.x[2] += other.x[2];
    this.y[2] += other.y[2];
    this.z[2] += other.z[2];
    return this;
  }

  sub(other: Matrix3): this {
    this.x[0] -= other.x[0];
    this.y[0] -= other.y[0];
    this.z[0] -= other.z[0];
    this.x[1] -= other.x[1];
    this.y[1] -= other.y[1];
    this.z[1] -= other.z[1];
    this.x[2] -= other.x[2];
    this.y[2] -= other.y[2];
    this.z[2] -= other.z[2];
    return this;
  }

  neg(): this {
    this.x[0] *= -1;
    this.y[0] *= -1;
    this.z[0] *= -1;
    this.x[1] *= -1;
    this.y[1] *= -1;
    this.z[1] *= -1;
    this.x[2] *= -1;
    this.y[2] *= -1;
    this.z[2] *= -1;
    return this;
  }

  mul(s: number): this {
    this.x[0] *= s;
    this.y[0] *= s;
    this.z[0] *= s;
    this.x[1] *= s;
    this.y[1] *= s;
    this.z[1] *= s;
    this.x[2] *= s;
    this.y[2] *= s;
    this.z[2] *= s;
    return this;
  }

  div(s: number): this {
    this.x[0] /= s;
    this.y[0] /= s;
    this.z[0] /= s;
    this.x[1] /= s;
    this.y[1] /= s;
    this.z[1] /= s;
    this.x[2] /= s;
    this.y[2] /= s;
    this.z[2] /= s;
    return this;
  }

  comb(s: number, other: Matrix3): this {
    this.x[0] += s * other.x[0];
    this.y[0] += s * other.y[0];
    this.z[0] += s * other.z[0];
    this.x[1] += s * other.x[1];
    this.y[1] += s * other.y[1];
    this.z[1] += s * other.z[1];
    this.x[2] += s * other.x[2];
    this.y[2] += s * other.y[2];
    this.z[2] += s * other.z[2];
    return this;
  }

  lerp(other: Matrix3, t: number): this {
    this.x[0] += (other.x[0] - this.x[0]) * t;
    this.y[0] += (other.y[0] - this.y[0]) * t;
    this.z[0] += (other.z[0] - this.z[0]) * t;
    this.x[1] += (other.x[1] - this.x[1]) * t;
    this.y[1] += (other.y[1] - this.y[1]) * t;
    this.z[1] += (other.z[1] - this.z[1]) * t;
    this.x[2] += (other.x[2] - this.x[2]) * t;
    this.y[2] += (other.y[2] - this.y[2]) * t;
    this.z[2] += (other.z[2] - this.z[2]) * t;
    return this;
  }

  herp(other: Matrix3, a: Matrix3, b: Matrix3, s: number): this {
    const s2 = s * s,
      t0 = s2 * (2 * s - 3) + 1,
      t1 = s2 * (s - 2) + s,
      t2 = s2 * (s - 1),
      t3 = s2 * (3 - 2 * s);
    this.x[0] = this.x[0] * t0 + a.x[0] * t1 + b.x[0] * t2 + other.x[0] * t3;
    this.y[0] = this.y[0] * t0 + a.y[0] * t1 + b.y[0] * t2 + other.y[0] * t3;
    this.z[0] = this.z[0] * t0 + a.z[0] * t1 + b.z[0] * t2 + other.z[0] * t3;
    this.x[1] = this.x[1] * t0 + a.x[1] * t1 + b.x[1] * t2 + other.x[1] * t3;
    this.y[1] = this.y[1] * t0 + a.y[1] * t1 + b.y[1] * t2 + other.y[1] * t3;
    this.z[1] = this.z[1] * t0 + a.z[1] * t1 + b.z[1] * t2 + other.z[1] * t3;
    this.x[2] = this.x[2] * t0 + a.x[2] * t1 + b.x[2] * t2 + other.x[2] * t3;
    this.y[2] = this.y[2] * t0 + a.y[2] * t1 + b.y[2] * t2 + other.y[2] * t3;
    this.z[2] = this.z[2] * t0 + a.z[2] * t1 + b.z[2] * t2 + other.z[2] * t3;
    return this;
  }

  berp(other: Matrix3, a: Matrix3, b: Matrix3, s: number): this {
    const s2 = s * s,
      inv = 1 - s,
      inv2 = inv * inv,
      t0 = inv2 * inv,
      t1 = 3 * s * inv2,
      t2 = 3 * s2 * inv,
      t3 = s2 * s;
    this.x[0] = this.x[0] * t0 + a.x[0] * t1 + b.x[0] * t2 + other.x[0] * t3;
    this.y[0] = this.y[0] * t0 + a.y[0] * t1 + b.y[0] * t2 + other.y[0] * t3;
    this.z[0] = this.z[0] * t0 + a.z[0] * t1 + b.z[0] * t2 + other.z[0] * t3;
    this.x[1] = this.x[1] * t0 + a.x[1] * t1 + b.x[1] * t2 + other.x[1] * t3;
    this.y[1] = this.y[1] * t0 + a.y[1] * t1 + b.y[1] * t2 + other.y[1] * t3;
    this.z[1] = this.z[1] * t0 + a.z[1] * t1 + b.z[1] * t2 + other.z[1] * t3;
    this.x[2] = this.x[2] * t0 + a.x[2] * t1 + b.x[2] * t2 + other.x[2] * t3;
    this.y[2] = this.y[2] * t0 + a.y[2] * t1 + b.y[2] * t2 + other.y[2] * t3;
    this.z[2] = this.z[2] * t0 + a.z[2] * t1 + b.z[2] * t2 + other.z[2] * t3;
    return this;
  }

  der(ds: number, other: Matrix3): this {
    this.x[0] = (this.x[0] - other.x[0]) / ds;
    this.y[0] = (this.y[0] - other.y[0]) / ds;
    this.z[0] = (this.z[0] - other.z[0]) / ds;
    this.x[1] = (this.x[1] - other.x[1]) / ds;
    this.y[1] = (this.y[1] - other.y[1]) / ds;
    this.z[1] = (this.z[1] - other.z[1]) / ds;
    this.x[2] = (this.x[2] - other.x[2]) / ds;
    this.y[2] = (this.y[2] - other.y[2]) / ds;
    this.z[2] = (this.z[2] - other.z[2]) / ds;
    return undefined;
  }

  prod(other: Matrix3): this {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];
    const mxx = other.x[0],
      myx = other.y[0],
      mzx = other.z[0],
      mxy = other.x[1],
      myy = other.y[1],
      mzy = other.z[1],
      mxz = other.x[2],
      myz = other.y[2],
      mzz = other.z[2];
    this.x[0] = mxx * xx + myx * xy + mzx * xz;
    this.y[0] = mxx * yx + myx * yy + mzx * yz;
    this.z[0] = mxx * zx + myx * zy + mzx * zz;
    this.x[1] = mxy * xx + myy * xy + mzy * xz;
    this.y[1] = mxy * yx + myy * yy + mzy * yz;
    this.z[1] = mxy * zx + myy * zy + mzy * zz;
    this.x[2] = mxz * xx + myz * xy + mzz * xz;
    this.y[2] = mxz * yx + myz * yy + mzz * yz;
    this.z[2] = mxz * zx + myz * zy + mzz * zz;
    return this;
  }

  inv(): this {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];
    const dyx = zz * yy - zy * yz;
    const dyy = -zz * xy + zy * xz;
    const dyz = yz * xy - yy * xz;

    let det = xx * dyx + yx * dyy + zx * dyz;

    if (!det) {
      return undefined;
    }

    det = 1.0 / det;
    this.x[0] = dyx * det;
    this.y[0] = (-zz * yx + zx * yz) * det;
    this.z[0] = (zy * yx - zx * yy) * det;
    this.x[1] = dyy * det;
    this.y[1] = (zz * xx - zx * xz) * det;
    this.z[1] = (-zy * xx + zx * xy) * det;
    this.x[2] = dyz * det;
    this.y[2] = (-yz * xx + yx * xz) * det;
    this.z[2] = (yy * xx - yx * xy) * det;
    return this;
  }

  dot(other: Matrix3): number {
    const sxx = this.x[0] * other.x[0],
      syx = this.y[0] * other.y[0],
      szx = this.z[0] * other.z[0],
      sxy = this.x[1] * other.x[1],
      syy = this.y[1] * other.y[1],
      szy = this.z[1] * other.z[1],
      sxz = this.x[2] * other.x[2],
      syz = this.y[2] * other.y[2],
      szz = this.z[2] * other.z[2];
    return sxx + syx + szx + sxy + syy + szy + sxz + syz + szz;
  }

  dist(other: Matrix3): number {
    return Math.sqrt(this.dist2(other));
  }

  dist1(other: Matrix3): number {
    const dxx = Math.abs(this.x[0] - other.x[0]),
      dyx = Math.abs(this.y[0] - other.y[0]),
      dzx = Math.abs(this.z[0] - other.z[0]),
      dxy = Math.abs(this.x[1] - other.x[1]),
      dyy = Math.abs(this.y[1] - other.y[1]),
      dzy = Math.abs(this.z[1] - other.z[1]),
      dxz = Math.abs(this.x[2] - other.x[2]),
      dyz = Math.abs(this.y[2] - other.y[2]),
      dzz = Math.abs(this.z[2] - other.z[2]);
    return dxx + dyx + dzx + dxy + dyy + dzy + dxz + dyz + dzz;
  }

  dist2(other: Matrix3): number {
    const dxx = this.x[0] - other.x[0],
      dyx = this.y[0] - other.y[0],
      dzx = this.z[0] - other.z[0],
      dxy = this.x[1] - other.x[1],
      dyy = this.y[1] - other.y[1],
      dzy = this.z[1] - other.z[1],
      dxz = this.x[2] - other.x[2],
      dyz = this.y[2] - other.y[2],
      dzz = this.z[2] - other.z[2];
    const dxx2 = dxx * dxx,
      dyx2 = dyx * dyx,
      dzx2 = dzx * dzx,
      dxy2 = dxy * dxy,
      dyy2 = dyy * dyy,
      dzy2 = dzy * dzy,
      dxz2 = dxz * dxz,
      dyz2 = dyz * dyz,
      dzz2 = dzz * dzz;
    return dxx2 + dyx2 + dzx2 + dxy2 + dyy2 + dzy2 + dxz2 + dyz2 + dzz2;
  }

  exact(other: Matrix3): boolean {
    return (
      this.x[0] === other.x[0] &&
      this.x[1] === other.x[1] &&
      this.x[2] === other.x[2] &&
      this.y[0] === other.y[0] &&
      this.y[1] === other.y[1] &&
      this.y[2] === other.y[2] &&
      this.z[0] === other.z[0] &&
      this.z[1] === other.z[1] &&
      this.z[2] === other.z[2]
    );
  }

  equal1(other: Matrix3): boolean {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];
    const mxx = other.x[0],
      myx = other.y[0],
      mzx = other.z[0],
      mxy = other.x[1],
      myy = other.y[1],
      mzy = other.z[1],
      mxz = other.x[2],
      myz = other.y[2],
      mzz = other.z[2];

    // noinspection JSSuspiciousNameCombination
    return (
      Math.abs(xx - mxx) <= epsilon &&
      Math.abs(yx - myx) <= epsilon &&
      Math.abs(zx - mzx) <= epsilon &&
      Math.abs(xy - mxy) <= epsilon &&
      Math.abs(yy - myy) <= epsilon &&
      Math.abs(zy - mzy) <= epsilon &&
      Math.abs(xz - mxz) <= epsilon &&
      Math.abs(yz - myz) <= epsilon &&
      Math.abs(zz - mzz) <= epsilon
    );
  }

  equal2(other: Matrix3): boolean {
    return this.dist2(other) < epsilon2;
  }

  nil(): boolean {
    return (
      this.x[0] === 0 &&
      this.x[1] === 0 &&
      this.x[2] === 0 &&
      this.y[0] === 0 &&
      this.y[1] === 0 &&
      this.y[2] === 0 &&
      this.z[0] === 0 &&
      this.z[1] === 0 &&
      this.z[2] === 0
    );
  }

  zero1(): boolean {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];
    return (
      xx <= epsilon * Math.max(1.0, xx) &&
      yx <= epsilon * Math.max(1.0, yx) &&
      zx <= epsilon * Math.max(1.0, zx) &&
      xx <= epsilon * Math.max(1.0, xy) &&
      yx <= epsilon * Math.max(1.0, yy) &&
      zx <= epsilon * Math.max(1.0, zy) &&
      xx <= epsilon * Math.max(1.0, xz) &&
      yx <= epsilon * Math.max(1.0, yz) &&
      zx <= epsilon * Math.max(1.0, zz)
    );
  }

  zero2(): boolean {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];

    return (
      xx * xx +
        yx * yx +
        zx * zx +
        xy * xy +
        yy * yy +
        zy * zy +
        xz * xz +
        yz * yz +
        zz * zz <
      epsilon2
    );
  }

  row(i: number): number[] {
    switch (i) {
      case 0:
        return [this.x[0], this.x[1], this.x[2]];
      case 1:
        return [this.y[0], this.y[1], this.y[2]];
      case 2:
        return [this.z[0], this.z[1], this.z[2]];
      default:
        return [this.x[0], this.x[1], this.x[2]];
    }
  }

  col(j: number): number[] {
    return [this.x[j], this.y[j], this.z[j]];
  }

  prodv(other: Vector3): Vector3 {
    let ox = other[0],
      oy = other[1],
      uz = other[2];
    other[0] = this.x[0] * ox + this.x[1] * oy + this.x[2] * uz;
    other[1] = this.y[0] * ox + this.y[1] * oy + this.y[2] * uz;
    other[2] = this.z[0] * ox + this.z[1] * oy + this.z[2] * uz;
    return other;
  }

  trans(): this {
    const mxy = this.y[0],
      mxz = this.z[0],
      myz = this.z[1];
    this.y[0] = this.x[1];
    this.z[0] = this.x[2];
    this.x[1] = mxy;
    this.z[1] = this.y[2];
    this.x[2] = mxz;
    this.y[2] = myz;
    return this;
  }

  private rpow(exp: number) {
    if (exp > 1) {
      const copy = this.clone();
      this.prod(copy);
      if (exp % 2 === 0) {
        this.rpow(exp / 2);
      } else if (exp % 2 === 1) {
        this.rpow((exp - 1) / 2);
        this.prod(copy);
      }
    }
  }

  pow(exp: number): this {
    if (exp < 0) this.inv();
    if (exp === 0) this.assign(1, 0, 0, 0, 1, 0, 0, 0, 1);
    this.rpow(Math.abs(exp));
    return this;
  }

  adj(): this {
    const xx = this.x[0],
      yx = this.y[0],
      zx = this.z[0],
      xy = this.x[1],
      yy = this.y[1],
      zy = this.z[1],
      xz = this.x[2],
      yz = this.y[2],
      zz = this.z[2];
    this.x[0] = yy * zz - zy * yz;
    this.y[0] = zx * yz - yx * zz;
    this.z[0] = yx * zy - zx * yy;
    this.x[1] = zy * xz - xy * zz;
    this.y[1] = xx * zz - zx * xz;
    this.z[1] = zx * xy - xx * zy;
    this.x[2] = xy * yz - yy * xz;
    this.y[2] = yx * xz - xx * yz;
    this.z[2] = xx * yy - yx * xy;
    return this;
  }

  frob(): number {
    return Math.sqrt(
      Math.pow(this.x[0], 2) +
        Math.pow(this.y[0], 2) +
        Math.pow(this.z[0], 2) +
        Math.pow(this.x[1], 2) +
        Math.pow(this.y[1], 2) +
        Math.pow(this.z[1], 2) +
        Math.pow(this.x[2], 2) +
        Math.pow(this.y[2], 2) +
        Math.pow(this.z[2], 2)
    );
  }

  /** See [[Object3]] for more details */
  rotX(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta);
    this.x[0] = 1;
    this.x[1] = 0;
    this.x[2] = 0;
    this.y[0] = 0;
    this.y[1] = c;
    this.y[2] = -s;
    this.z[0] = 0;
    this.z[1] = s;
    this.z[2] = c;
    return this;
  }

  /** See [[Object3]] for more details */
  rotY(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta);
    this.x[0] = c;
    this.x[1] = 0;
    this.x[2] = s;
    this.y[0] = 0;
    this.y[1] = 1;
    this.y[2] = 0;
    this.z[0] = -s;
    this.z[1] = 0;
    this.z[2] = c;
    return this;
  }

  /** See [[Object3]] for more details */
  rotZ(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta);
    this.x[0] = c;
    this.x[1] = -s;
    this.x[2] = 0;
    this.y[0] = s;
    this.y[1] = c;
    this.y[2] = 0;
    this.z[0] = 0;
    this.z[1] = 0;
    this.z[2] = 1;
    return this;
  }

  /** See [[Object3]] for more details */
  rot(other: Vector3, theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta),
      k = 1 - c;
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const koxy = k * ox * oy,
      koxz = k * ox * uz,
      koyz = k * oy * uz;
    this.x[0] = k * ox * ox + c;
    this.x[1] = koxy - uz * s;
    this.x[2] = koxz + oy * s;
    this.y[0] = koxy + uz * s;
    this.y[1] = k * oy * oy + c;
    this.y[2] = koyz - ox * s;
    this.z[0] = koxz - oy * s;
    this.z[1] = koyz + ox * s;
    this.z[2] = k * uz * uz + c;
    return this;
  }

  static get dim(): number {
    return 9;
  }

  static get zeros(): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  static get ones(): Matrix3 {
    return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
  }

  /**
   * @brief identity matrix
   * @details Diagonal matrix filled with `1`.
   */
  static get eye(): Matrix3 {
    return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  /**
   * @brief scalar matrix
   * @details Diagonal matrix filled with a single value.
   * @param s scalar value
   */
  static scalar(s: number): Matrix3 {
    return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
  }

  /**
   * @brief diagonal matrix
   * @details Diagonal matrix filled with values.
   */
  static diag(xx: number, yy: number, zz: number): Matrix3 {
    return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
  }

  /**
   * @brief symmetric matrix
   * @details Fill the matrix by giving values on diagonal and sub diagonals.
   */
  static sym(
    xx: number,
    yy: number,
    zz: number,
    xy: number,
    yz: number,
    xz = 0
  ): Matrix3 {
    return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
  }

  /**
   * @brief antisymmetric matrix with non zero diagonal
   * @details Fill the matrix by giving values on diagonal and sub diagonals.
   */
  static asym(
    xx: number,
    yy: number,
    zz: number,
    xy: number,
    yz: number,
    xz = 0
  ): Matrix3 {
    return new Matrix3(xx, xy, xz, -xy, yy, yz, -xz, -yz, zz);
  }

  /**
   * @brief standard basis matrix
   * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
   */
  static e(i: number, j: number): Matrix3 {
    const eij = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    switch (j) {
      case 0:
        eij.x[i] = 1;
        break;
      case 1:
        eij.y[i] = 1;
        break;
      case 2:
        eij.y[i] = 1;
        break;
    }
    return eij;
  }

  /** rotation matrix of axis `x`. See [[Object3]] for mor details. */
  static rotX(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).rotX(theta, cos, sin);
  }

  /** rotation matrix of axis `y`. See [[Object3]] for mor details. */
  static rotY(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).rotY(theta, cos, sin);
  }

  /** rotation matrix of axis `z`. See [[Object3]] for mor details. */
  static rotZ(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).rotZ(theta, cos, sin);
  }

  /** rotation matrix of axis `u`. See [[Object3]] for mor details. */
  static rot(
    axis: Vector3,
    theta: number,
    cos = Math.cos,
    sin = Math.sin
  ): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).rot(axis, theta, cos, sin);
  }

  /**
   * @brief affine transformation of the vector `m * v + u`
   * @details The result of the operation is stored on `v`.
   * @param m matrix of the transformation
   * @param u translation of the transformation
   * @param v vector parameter of the transformation
   * @returns reference to `v`
   */
  static affine(m: Matrix3, u: Vector3, v: Vector3): Vector3 {
    const vx = v[0],
      vy = v[1],
      vz = v[2];

    v[0] = m.x[0] * vx + u.x * vy + m.x[2] * vz + m.x[0];
    v[1] = m.y[0] * vx + u.y * vy + m.y[2] * vz + m.y[0];
    v[2] = m.z[0] * vx + u.z * vy + m.z[2] * vz + m.z[0];
    return v;
  }

  /**
   * @brief tensor product of two vectors `u * vt`
   * @details matrix such that `m.ij = u.i * u.j`
   * @param u left operand
   * @param v right operand
   */
  static tensor(u: Vector3, v = u): Matrix3 {
    return new Matrix3(
      u[0] * v[0],
      u[0] * v[1],
      u[0] * v[2],
      u[1] * v[0],
      u[1] * v[1],
      u[1] * v[2],
      u[2] * v[0],
      u[2] * v[1],
      u[2] * v[2]
    );
  }

  /** matrix from given 1D array containing the components of the matrix ordered as rows */
  static array(arr: number[]): Matrix3 {
    return new Matrix3(
      arr[0],
      arr[1],
      arr[2],
      arr[3],
      arr[4],
      arr[5],
      arr[6],
      arr[7],
      arr[8]
    );
  }

  /** matrix from 2D array of number ordered such that `arr[i]` is the i-th row of the matrix */
  static rows(arr: number[][]): Matrix3 {
    return new Matrix3(
      arr[0][0],
      arr[0][1],
      arr[0][2],
      arr[1][0],
      arr[1][1],
      arr[1][2],
      arr[2][0],
      arr[2][1],
      arr[2][2]
    );
  }

  /** matrix from 2D array of number ordered such that `arr[j]` is the j-th column of the matrix */
  static cols(arr: number[][]): Matrix3 {
    return new Matrix3(
      arr[0][0],
      arr[1][0],
      arr[2][0],
      arr[0][1],
      arr[1][1],
      arr[2][1],
      arr[0][2],
      arr[1][2],
      arr[2][2]
    );
  }

  /** matrix from [[Vector3]] objects as rows */
  static xyz(arr: [Vector3, Vector3, Vector3]): Matrix3 {
    return new Matrix3(
      arr[0][0],
      arr[0][1],
      arr[0][2],
      arr[1][0],
      arr[1][1],
      arr[1][2],
      arr[2][0],
      arr[2][1],
      arr[2][2]
    );
  }
}

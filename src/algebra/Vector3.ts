import { Vector } from ".";
import { epsilon, epsilon2, gaussian, Object3, Rotation3 } from "../common/";

/**
 *
 * ## Brief
 * [[Vector3]] represents 3D vectors as a set of three numerical components. It implements [[Vector]] interface.
 *
 * ### Main features
 * - **Array like** access `other[0]`, `other[1]`, ...
 * - **Algebra** `add`, `mul`, `neg`
 * - **Geometry** `angle`, `cross`, `dist`, `rot`, ...
 * - **Coordinates system** accessors `x`, `y`, `z`, `r`, `theta`, `lat`, `lon` ...
 * - **Basis generators** like `ex`, `er(u)`, `e(k)`, ...
 *
 * ## Getting Started
 *
 * [[Vector3]] objects are made of an array of three cartesian coordinates in an arbitrary basis `[x, y, z]`.
 * They can be considered the following column vector :
 *
 * ![Vector3 shape](media://vector3_shape.png)
 *
 * ### Coordinates systems
 *
 * Before explaining any code lets start by understanding a little diagram.
 *
 * ![Coordinates system](media://coordinates_diagram.png)
 *
 * This diagram represents 3D space provided with an orthonormal basis, we see that `u` can be
 * decomposed in three different coordinates systems :
 * - cartesian coordinates `(x, y, z)`
 * - cylindrical coordinates `(rxy, theta, z)`
 * - spherical coordinates  `(r, theta, phi)`
 *
 * **Note** θ and Φ are respectively denoted `theta` and `phi` in the framework
 *
 * The diagram specifies which convention are chosen for the coordinates systems provided.
 *
 * You can use the coordinates accessors to get and set the value of the coordinates.
 *
 * #### Example
 * ```js
 * let u = Vector3.ones; // u = (1, 1, 1)
 * u.r; // +sqrt(3)
 * u.x = 1; // 1
 * u.theta; // +pi/4
 * u.xyz; // [1, 1, 1]
 * u.r = 1; // u = 1/sqrt(3) * (1, 1, 1)
 * ```
 *
 *
 * ### Geometrical features
 * Perform rotations, compute angles, cross product, ...
 *
 * #### Example
 * ```js
 * let u = Vector3.ones, ex = Vector3.ex; // (1, 1, 1) (1, 0, 0)
 * u.angle(ex); // +pi/4
 * ex.cross(ex); // (0, 0, 0)
 * ex.rotZ(Math.PI / 2); // ex becomes ey
 * ```
 *
 * If you want to get deep into rotation features see [[Object3]].
 *
 * ### Standard basis
 *
 * Represent the standard basis of 3D space made of :
 * - `ex = (1, 0, 0)`
 * - `ey = (0, 1, 0)`
 * - `ez = (0, 0, 1)`
 *
 * You can represent the basis `(ex, ey, ez)` on the following diagram :
 *
 * ![Cartesian system](media://cartesian_diagram.png)
 *
 * `ex`, `ey` and `ez` often respectively represents `left`, `up` and `forward` directions in computer graphics.
 *
 * Anyway the first notation seems more general because math equations often use it without necessarily referring to these particular directions.
 *
 * For example `ex`, `ey`, `ez` as respectively `right`, `forward`, `up` directions is often used in mechanics.
 *

 *
 * **Note** Here we have drawn `ex`, `ey` and `ez` as respectively `right`, `forward`, `up`.
 *
 * You can then generate vectors of this standard basis
 * #### Example
 * ```js
 * let ex = Vector3.ex, ey = Vector3.ey, ez = Vector3.ez;
 * ```
 *
 * ### Spherical and cylindrical basis
 *
 * The spherical basis vectors at `u` is represented bellow.
 * ![Spherical system](media://local_basis_diagram.png)
 *
 * **Note** All the vector of a local basis are orthogonal to each other and of norm 1.
 *
 * You can generate or compute a local basis vector of the two coordinates systems.
 * #### Example
 * ```js
 * let er = Vector3.er(u), etheta = Vector3.etheta(u);
 * w = w.erxy(Vector3.ones) // w = 1/sqrt(2) * (1, 1, 0);
 * ```
 *
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
export default class Vector3
  extends Float64Array
  implements Vector, Object3<number>, Rotation3
{
  dim: Readonly<number> = 3;

  /** first cartesian coordinate */
  get x(): number {
    return this[0];
  }

  set x(newX) {
    this[0] = newX;
  }

  /** second cartesian coordinate */
  get y(): number {
    return this[1];
  }

  set y(newY) {
    this[1] = newY;
  }

  /** third cartesian coordinate */
  get z(): number {
    return this[2];
  }

  set z(newZ) {
    this[2] = newZ;
  }

  /** cartesian coordinates of the vector */
  get xyz(): [number, number, number] {
    return [this[0], this[1], this[2]];
  }

  set xyz(coordinates) {
    this.assign(...coordinates);
  }

  /** length of the vector */
  get mag(): number {
    const x = this[0],
      y = this[1],
      z = this[2];
    return Math.sqrt(x * x + y * y + z * z);
  }

  /** squared length of the vector */
  get mag2(): number {
    const x = this[0],
      y = this[1],
      z = this[2];
    return x * x + y * y + z * z;
  }

  /** first spherical coordinate, length of the vector */
  get r(): number {
    return this.mag;
  }

  set r(newR) {
    const s = newR / this.mag;
    this[0] *= s;
    this[1] *= s;
    this[2] *= s;
  }

  /** second cylindrical and spherical coordinate, counterclockwise angle formed with `ex` in radians */
  get theta(): number {
    return Math.atan2(this[1], this[0]);
  }

  set theta(newTheta) {
    this.rthph = [this.mag, newTheta, this.phi];
  }

  /** third spherical coordinate, clockwise angle formed with  `ez` in radians */
  get phi(): number {
    return Math.atan2(this[0] * this[0] + this[1] * this[1], this[2]);
  }

  set phi(newPhi) {
    this.rthph = [this.mag, this.theta, newPhi];
  }

  /** first cylindrical coordinate, length of the projection of the vector on the plane formed with `ex`, `ey` */
  get rxy(): number {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
  }

  set rxy(newRxy) {
    this.rthz = [newRxy, this.theta, this[2]];
  }

  /** latitude of the vector in radians */
  get lat(): number {
    return Math.PI / 2 - this.phi;
  }

  set lat(newLat) {
    this.rthph = [this.mag, this.theta, Math.PI / 2 - newLat];
  }

  /** longitude of the vector in radians */
  get lon(): number {
    const theta = this.theta;
    return theta <= Math.PI ? theta : theta - 2 * Math.PI;
  }

  set lon(newLon) {
    this.rthph = [
      this.mag,
      newLon >= 0 ? newLon : newLon + 2 * Math.PI,
      this.phi,
    ];
  }

  /** cylindrical coordinates of the vector*/
  get rthz(): [number, number, number] {
    return [this.rxy, this.theta, this[2]];
  }

  set rthz(coordinates: [number, number, number]) {
    const rxy = coordinates[0],
      theta = coordinates[1];
    this[0] = rxy * Math.cos(theta);
    this[1] = rxy * Math.sin(theta);
    this[2] = coordinates[2];
  }

  /** spherical coordinates of the vector */
  get rthph(): [number, number, number] {
    return [this.mag, this.theta, this.phi];
  }

  set rthph(coordinates: [number, number, number]) {
    const r = coordinates[0],
      theta = coordinates[1],
      phi = coordinates[2];
    const s = Math.sin(phi);
    this[0] = r * s * Math.cos(theta);
    this[1] = r * s * Math.sin(theta);
    this[2] = r * Math.cos(phi);
  }

  /**
   * @brief Constructs a vector with cartesian coordinates. `
   * @details If you don't specify components then the underlying array is initialized with the default values for `Float64Array`.
   **/
  constructor(x: number, y: number, z: number) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  string(): string {
    return `(${this[0]}, ${this[1]}, ${this[2]})`;
  }

  array(): number[] {
    return [...this];
  }

  assign(x: number, y: number, z: number): this {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }

  copy(other: Vector3): this {
    this[0] = other[0];
    this[1] = other[1];
    this[2] = other[2];
    return this;
  }

  clone(): this {
    return new Vector3(this[0], this[1], this[2]) as this;
  }

  /** sets vector to zeros */
  reset0(): this {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    return this;
  }

  /** sets vector to ones */
  reset1(): this {
    this[0] = 1;
    this[1] = 1;
    this[2] = 1;
    return this;
  }

  random(): this {
    this[0] = Math.random();
    this[1] = Math.random();
    this[2] = Math.random();
    return this;
  }

  floor(): this {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    return this;
  }

  ceil(): this {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    return this;
  }

  round(): this {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    this[2] = Math.round(this[2]);
    return this;
  }

  trunc(decimals: number): this {
    const pow10 = Math.pow(10, decimals);
    this[0] = Math.round(this[0] * pow10) / pow10;
    this[1] = Math.round(this[1] * pow10) / pow10;
    this[2] = Math.round(this[2] * pow10) / pow10;
    return this;
  }

  abs(): this {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    return this;
  }

  min(other: Vector3): this {
    this[0] = Math.min(this[0], other[0]);
    this[1] = Math.min(this[1], other[1]);
    this[2] = Math.min(this[2], other[2]);
    return this;
  }

  max(other: Vector3): this {
    this[0] = Math.max(this[0], other[0]);
    this[1] = Math.max(this[1], other[1]);
    this[2] = Math.max(this[2], other[2]);
    return this;
  }

  fill(s: number): this {
    this[0] = s;
    this[1] = s;
    this[2] = s;
    return this;
  }

  norm(): this {
    const s = this.mag || Number.POSITIVE_INFINITY;
    this[0] /= s;
    this[1] /= s;
    this[2] /= s;
    return this;
  }

  add(other: Vector3): this {
    this[0] += other[0];
    this[1] += other[1];
    this[2] += other[2];
    return this;
  }

  sub(other: Vector3): this {
    this[0] -= other[0];
    this[1] -= other[1];
    this[2] -= other[2];
    return this;
  }

  neg(): this {
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }

  mul(s: number): this {
    this[0] *= s;
    this[1] *= s;
    this[2] *= s;
    return this;
  }

  div(s: number): this {
    this[0] /= s;
    this[1] /= s;
    this[2] /= s;
    return this;
  }

  comb(s: number, other: Vector3): this {
    this[0] += s * other[0];
    this[1] += s * other[1];
    this[2] += s * other[2];
    return this;
  }

  lerp(other: Vector3, s: number): this {
    this[0] += (other[0] - this[0]) * s;
    this[1] += (other[1] - this[1]) * s;
    this[2] += (other[2] - this[2]) * s;
    return this;
  }

  herp(other: Vector3, a: Vector3, b: Vector3, s: number): this {
    const s2 = s * s,
      t0 = s2 * (2 * s - 3) + 1,
      t1 = s2 * (s - 2) + s,
      t2 = s2 * (s - 1),
      t3 = s2 * (3 - 2 * s);
    this[0] = this[0] * t0 + a[0] * t1 + b[0] * t2 + other[0] * t3;
    this[1] = this[1] * t0 + a[1] * t1 + b[1] * t2 + other[1] * t3;
    this[2] = this[2] * t0 + a[2] * t1 + b[2] * t2 + other[2] * t3;
    return this;
  }

  berp(other: Vector3, a: Vector3, b: Vector3, s: number): this {
    const s2 = s * s,
      inv = 1 - s,
      inv2 = inv * inv,
      t0 = inv2 * inv,
      t1 = 3 * s * inv2,
      t2 = 3 * s2 * inv,
      t3 = s2 * s;
    this[0] = this[0] * t0 + a[0] * t1 + b[0] * t2 + other[0] * t3;
    this[1] = this[1] * t0 + a[1] * t1 + b[1] * t2 + other[1] * t3;
    this[2] = this[2] * t0 + a[2] * t1 + b[2] * t2 + other[2] * t3;
    return this;
  }

  der(ds: number, other: Vector3): this {
    this[0] = (this[0] - other[0]) / ds;
    this[1] = (this[1] - other[1]) / ds;
    this[2] = (this[2] - other[2]) / ds;
    return this;
  }

  /** Hadamard product of two vectors*/
  prod(other: Vector3): this {
    this[0] *= other[0];
    this[1] *= other[1];
    this[2] *= other[2];
    return this;
  }

  inv(): this {
    this[0] **= -1;
    this[1] **= -1;
    this[2] **= -1;
    return this;
  }

  dot(other: Vector3): number {
    return this[0] * other[0] + this[1] * other[1] + this[2] * other[2];
  }

  dist(other: Vector3): number {
    return Math.sqrt(this.dist2(other));
  }

  dist1(other: Vector3): number {
    const dx = Math.abs(this[0] - other[0]),
      dy = Math.abs(this[1] - other[1]),
      dz = Math.abs(this[2] - other[2]);
    return dx + dy + dz;
  }

  dist2(other: Vector3): number {
    const dx = this[0] - other[0],
      dy = this[1] - other[1],
      dz = this[2] - other[2];
    return dx * dx + dy * dy + dz * dz;
  }

  exact(other: Vector3): boolean {
    return this[0] === other[0] && this[1] === other[1] && this[2] === other[2];
  }

  equal1(other: Vector3): boolean {
    const x = this[0],
      y = this[1],
      z = this[2],
      ox = other[0],
      oy = other[1],
      uz = other[2];

    // noinspection JSSuspiciousNameCombination
    return (
      Math.abs(x - ox) < epsilon &&
      Math.abs(y - oy) < epsilon &&
      Math.abs(z - uz) < epsilon
    );
  }

  equal2(other: Vector3): boolean {
    return this.dist2(other) < epsilon2;
  }

  nil(): boolean {
    return this[0] === 0 && this[1] === 0 && this[2] === 0;
  }

  zero1(): boolean {
    const x = Math.abs(this[0]),
      y = Math.abs(this[1]),
      z = Math.abs(this[2]);

    // noinspection JSSuspiciousNameCombination
    return (
      x <= epsilon * Math.max(1.0, x) &&
      y <= epsilon * Math.max(1.0, y) &&
      z <= epsilon * Math.max(1.0, z)
    );
  }

  zero2(): boolean {
    const x = this[0],
      y = this[1],
      z = this[2];
    return x * x + y * y + z * z < epsilon2;
  }

  /** See [[Object3]] for more details */
  rotX(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta),
      y = this[1],
      z = this[2];
    this[1] = y * c - z * s;
    this[2] = y * s + z * c;
    return this;
  }

  /** See [[Object3]] for more details */
  rotY(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = -sin(theta),
      x = this[0],
      z = this[2];
    this[0] = x * c + z * s;
    this[2] = x * s - z * c;
    return this;
  }

  /** See [[Object3]] for more details */
  rotZ(theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta),
      x = this[0],
      y = this[1];
    this[0] = x * c - y * s;
    this[1] = x * s + y * c;
    return this;
  }

  /** See [[Object3]] for more details */
  rot(other: Vector3, theta: number, cos = Math.cos, sin = Math.sin): this {
    const c = cos(theta),
      s = sin(theta),
      k = 1 - c;
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const koxy = k * ox * oy,
      koxz = k * ox * uz,
      koyz = k * oy * uz;
    this[0] = (k * ox * ox + c) * x + (koxy - uz * s) * y + (koxz + oy * s) * z;
    this[1] = (koxy + uz * s) * x + (k * oy * oy + c) * y + (koyz - ox * s) * z;
    this[2] = (koxz - oy * s) * x + (koyz + ox * s) * y + (k * uz * uz + c) * z;
    return this;
  }

  /** cross product of two vector `u x v` */
  cross(other: Vector3): this {
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    this[0] = y * uz - z * oy;
    this[1] = z * ox - x * uz;
    this[2] = x * oy - y * ox;
    return this;
  }

  /** area of the parallelepiped formed with the two vectors */
  area(other: Vector3): number {
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const ax = y * uz - z * oy,
      ay = z * ox - x * uz,
      az = x * oy - y * ox;

    return Math.sqrt(ax * ax + ay * ay + az * az);
  }

  /** unsigned angle between two vectors in radians */
  angle(other: Vector3): number {
    return Math.acos(this.cos(other));
  }

  /** cosine of the angle between two vector */
  cos(other: Vector3): number {
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const um = Math.sqrt(ox * ox + oy * oy + uz * uz),
      m = Math.sqrt(x * x + y * y + z * z);

    return (x * ox + y * oy + z * uz) / (um * m);
  }

  /** sine of the angle between two vector */
  sin(other: Vector3): number {
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const um = Math.sqrt(ox * ox + oy * oy + uz * uz),
      m = Math.sqrt(x * x + y * y + z * z);
    const ax = y * uz - z * oy,
      ay = z * ox - x * uz,
      az = x * oy - y * ox;

    return Math.sqrt(ax * ax + ay * ay + az * az) / (um * m);
  }

  /**
   * @brief tangent of the angle between two vector
   * @param u other vector
   * @returns value of the tangent
   */
  tan(other: Vector3) {
    const x = this[0],
      y = this[1],
      z = this[2];
    const ox = other[0],
      oy = other[1],
      uz = other[2];
    const ax = y * uz - z * oy,
      ay = z * ox - x * uz,
      az = x * oy - y * ox;

    return Math.sqrt(ax * ax + ay * ay + az * az) / (x * ox + y * oy + z * uz);
  }

  er(other: Vector3): this {
    const theta = Math.atan2(other[1], other[0]),
      phi = Math.atan2(other[0] * other[0] + other[1] * other[1], other[2]),
      s = Math.sin(phi);

    this[0] = s * Math.cos(theta);
    this[1] = s * Math.sin(theta);
    this[2] = Math.cos(phi);
    return this;
  }

  erxy(other: Vector3): this {
    const ox = other[0],
      oy = other[1],
      urxy = Math.sqrt(ox * ox + oy * oy) || Number.POSITIVE_INFINITY;
    this[0] = ox / urxy;
    this[1] = oy / urxy;
    this[2] = 0;
    return this;
  }

  etheta(other: Vector3): this {
    const theta = Math.atan2(other[1], other[0]);
    this[0] = -Math.sin(theta);
    this[1] = Math.cos(theta);
    this[2] = 0;
    return this;
  }

  ephi(other: Vector3): this {
    const theta = Math.atan2(other[1], other[0]),
      phi = Math.atan2(other[0] * other[0] + other[1] * other[1], other[2]),
      c = Math.cos(phi);
    this[0] = c * Math.cos(theta);
    this[1] = c * Math.sin(theta);
    this[2] = -Math.sin(phi);
    return this;
  }

  /**
   * @brief random vector following normal law
   * @details If `yd` and `zd` are unspecified then `xd` will represent the standard deviation for all axis.
   * @param xm average value of `x`
   * @param ym average value of `y`
   * @param zm average value of `z`
   * @param xd standard deviation along `x` axis
   * @param yd standard deviation along `y` axis
   * @param zd standard deviation along `z` axis
   */
  gaussian(
    xm: number,
    ym: number,
    zm: number,
    xd: number,
    yd = xd,
    zd = xd
  ): this {
    this[0] = gaussian(xm, xd);
    this[1] = gaussian(ym, yd);
    this[2] = gaussian(zm, zd);
    return this;
  }

  static get dim(): number {
    return 3;
  }

  /** vector filled with `0` */
  static get zeros(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  /** vector filled with `1` */
  static get ones(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  /** vector filled with `s` */
  static scalar(s: number): Vector3 {
    return new Vector3(s, s, s);
  }

  /** vector filled with uniform random values.  See [[random]] for more details. */
  static random(): Vector3 {
    return new Vector3(Math.random(), Math.random(), Math.random());
  }

  /** vector with coordinates following gaussian law. See [[Vector3.gaussian]] for more details. */
  static gaussian(
    xm: number,
    ym: number,
    zm: number,
    xd: number,
    yd = xd,
    zd = xd
  ): Vector3 {
    return new Vector3(gaussian(xm, xd), gaussian(ym, yd), gaussian(zm, zd));
  }

  /** vector with given cylindrical coordinates. See [[this.rthz]] for more details. */
  static rthz(rxy: number, theta: number, z: number): Vector3 {
    return new Vector3(rxy * Math.cos(theta), rxy * Math.sin(theta), z);
  }

  /** vector with given spherical coordinates. See [[rthph]] for more details. */
  static rthph(r: number, theta: number, phi: number): Vector3 {
    const s = r * Math.sin(phi);
    return new Vector3(
      s * Math.cos(theta),
      s * Math.sin(theta),
      r * Math.cos(phi)
    );
  }

  static get ex(): Vector3 {
    /** first vector of standard basis `(1, 0, 0)`*/
    return new Vector3(1, 0, 0);
  }

  /** opposite of the first vector of standard basis `(-1, 0, 0)`*/
  static get exn(): Vector3 {
    return new Vector3(-1, 0, 0);
  }

  /** second vector of standard basis `(0, 1, 0)`*/
  static get ey(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  /** opposite of the second vector of standard basis `(0, -1, 0)`*/
  static get eyn(): Vector3 {
    return new Vector3(0, -1, 0);
  }

  /** third vector of standard basis `(0, 0, 1)`*/
  static get ez(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  /** third vector of standard basis `(0, 0, -1)` */
  static get ezn(): Vector3 {
    return new Vector3(0, 0, -1);
  }

  /**
   * @brief standard basis vector
   * @details `e(0) == ex`, `e(1) == ey`, `e(2) == ez`.
   * @param k {number} order of the vector in basis
   */
  static e(k: number): Vector3 {
    const ek = new Vector3(0, 0, 0);
    ek[k] = 1;
    return ek;
  }

  /**
   * @brief opposite of standard basis vector
   * @details `en(0) == exn`, `en(1) == eyn`, `en(2) == ezn`.
   * @param k {number} order of the vector in basis
   */
  static en(k: number): Vector3 {
    const ek = new Vector3(0, 0, 0);
    ek[k] = -1;
    return ek;
  }

  /**
   * @brief radial vector of spherical basis
   * @param u position of local basis
   */
  static er(other: Vector3): Vector3 {
    return new Vector3(0, 0, 0).er(other);
  }

  /**
   * @brief radial vector of cylindrical basis
   * @param u position of local basis
   */
  static erxy(other: Vector3): Vector3 {
    return new Vector3(0, 0, 0).erxy(other);
  }

  /**
   * @brief prograde vector of spherical basis
   * @details Prograde vector is perpendicular to the radial vector and oriented in the positive `theta` direction.
   * This vector also correspond to the prograde vector of cylindrical basis.
   * @param u position of local basis
   */
  static etheta(other: Vector3): Vector3 {
    return new Vector3(0, 0, 0).etheta(other);
  }

  /**
   * @brief normal vector of spherical basis
   * @details Normal vector is perpendicular to the radial vector and oriented in the positive `phi` direction.
   * @param u position of local basis
   */
  static ephi(other: Vector3): Vector3 {
    return new Vector3(0, 0, 0).ephi(other);
  }

  /** vector from coordinates of array in the form `[x, y, z, ...]` */
  static array(arr: number[]): Vector3 {
    return new Vector3(arr[0], arr[1], arr[2]);
  }
}

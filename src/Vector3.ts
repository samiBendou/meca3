import {Vector} from "./Algebra";

/**
 * @brief 3D Vectors
 * @details Usual 3D space numeric space vectors stored as cartesian coordinates.
 *
 * - Perform **vector space operations** between vectors such as addition or scalar multiplication.
 *
 * - Compute the angle between two vector, the cross product and many other **geometrical operations**.
 *
 * - Use cylindrical `r`, `theta`, `z` and spherical `rxy`, `theta`, `phi` coordinates
 * with provided **setters and getters**.
 *
 */
export default class Vector3 implements Vector {

    /** first cartesian coordinate **/
    x: number;

    /** second cartesian coordinate **/
    y: number;

    /** third cartesian coordinate **/
    z: number;

    /** construct with cartesian coordinates **/
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.xyz = [x, y, z];
    }

    /** first spherical coordinate, length of the vector **/
    get r() {
        return Math.sqrt(this.scal(this));
    }

    set r(newR) {
        this.rthph = [newR, this.theta, this.phi];
    }

    /** second cylindrical and spherical coordinate, counterclockwise angle formed with `ex` in radians **/
    get theta() {
        return Math.atan2(this.y, this.x);
    }

    set theta(newTheta) {
        this.rthph = [this.r, newTheta, this.phi];
    }

    /** third spherical coordinate, angle formed with  `ez` in radians **/
    get phi() {
        return Math.atan2(this.rxy, this.z);
    }

    set phi(newPhi) {
        this.rthph = [this.r, this.theta, newPhi];
    }

    /** first cylindrical coordinate, length of the projection of the vector on the plane formed with `ex`, `ey` **/
    get rxy() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set rxy(newRxy) {
        this.rthz = [newRxy, this.theta, this.z];
    }

    /** latitude of the vector in radians **/
    get lat() {
        return Math.PI / 2 - this.phi;
    }

    set lat(newLat) {
        this.rthph = [this.r, this.theta, Math.PI / 2 - newLat];
    }

    /** longitude of the vector in radians **/
    get lon() {
        return this.theta <= Math.PI ? this.theta : this.theta - 2 * Math.PI;
    }

    set lon(newLat) {
        this.rthph = [this.r, newLat >= 0 ? newLat : newLat + 2 * Math.PI, this.phi];
    }

    /** cartesian coordinates of the vector **/
    get xyz() {
        return [this.x, this.y, this.z];
    }

    set xyz(coordinates: [number, number, number]) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    }

    /** cylindrical coordinates of the vector**/
    get rthz() {
        return [this.rxy, this.theta, this.z];
    }

    set rthz(coordinates: [number, number, number]) {
        this.x = coordinates[0] * Math.cos(coordinates[1]);
        this.y = coordinates[0] * Math.sin(coordinates[1]);
        this.z = coordinates[2];
    }

    /** spherical coordinates of the vector **/
    get rthph() {
        return [this.r, this.theta, this.phi];
    }

    set rthph(coordinates: [number, number, number]) {
        this.x = coordinates[0] * Math.sin(coordinates[2]) * Math.cos(coordinates[1]);
        this.y = coordinates[0] * Math.sin(coordinates[2]) * Math.sin(coordinates[1]);
        this.z = coordinates[0] * Math.cos(coordinates[2]);
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    fill(s: number) {
        this.x = s;
        this.y = s;
        this.z = s;
        return this;
    }

    fillc(s: number) {
        return this.copy().fill(s);
    }

    add(u: Vector3) {
        this.x += u.x;
        this.y += u.y;
        this.z += u.z;
        return this;
    }

    addc(u: Vector3) {
        return this.copy().add(u);
    }

    sub(u: Vector3) {
        this.x -= u.x;
        this.y -= u.y;
        this.z -= u.z;
        return this;
    }

    subc(u: Vector3) {
        return this.copy().sub(u);
    }

    opp() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    oppc() {
        return this.copy().opp();
    }

    mul(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    mulc(s: number) {
        return this.copy().mul(s);
    }

    div(s: number) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    divc(s: number) {
        return this.copy().div(s);
    }

    scal(u: Vector3) {
        return this.x * u.x + this.y * u.y + this.z * u.z;
    }

    /**
     * @brief cross product of two vector
     * @param u vector to multiply
     * @returns reference to `this`
     */
    cross(u: Vector3) {
        this.xyz = [
            this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x
        ];
        return this;
    }

    crossc(u: Vector3) {
        return this.copy().cross(u);
    }

    prod(u: Vector3) {
        return this.cross(u);
    }

    prodc(u: Vector3) {
        return this.crossc(u)
    }

    dist(u: Vector3) {
        return this.copy().sub(u).r;
    }

    /**
     * @brief angle between two vector
     * @param u other vector
     * @returns value of the angle in radians
     */
    angle(u: Vector3) {
        return Math.atan(this.tan(u));
    }

    /**
     * @brief cosine of the angle between two vector
     * @param u other vector
     * @returns value of the cosine
     */
    cos(u: Vector3) {
        return (!this.isZero() && !u.isZero()) ? this.scal(u) / (this.r * u.r) : 1;
    }

    /**
     * @brief sine of the angle between two vector
     * @param u other vector
     * @returns value of the sine
     */
    sin(u: Vector3) {
        return (!this.isZero() && !u.isZero()) ? this.copy().cross(u).r / (this.r * u.r) : 0;
    }

    /**
     * @brief tangent of the angle between two vector
     * @param u other vector
     * @returns value of the tangent
     */
    tan(u: Vector3) {
        return this.sin(u) / this.cos(u);
    }

    /**
     * @brief equality between two vectors
     * @details distance based equality
     * @param u other vector
     * @returns `true` if vectors are equal
     */
    isEqual(u: Vector3) {
        return Math.abs(this.dist(u)) < Number.EPSILON;
    }

    /**
     * @returns `true` if vector is filled with zeros
     */
    isZero() {
        return this.r < Number.EPSILON;
    }

    toString() {
        return `(${this.x.toExponential(2)} ${this.y.toExponential(2)} ${this.z.toExponential(2)})`;
    }

    /**
     * @brief transform vector to array
     * @returns value of the vector
     */
    to1D() {
        return this.xyz;
    }

    /**
     * @returns vector filled with `0`
     */
    static get zeros() {
        return new Vector3();
    }

    /**
     * @returns vector filled with `1`
     */
    static get ones() {
        return Vector3.scal(1);
    }

    /**
     * @brief scalar vector
     * @param s scalar value
     * @returns vector filled with `s`
     */
    static scal(s: number) {
        return new Vector3(s, s, s);
    }

    /**
     * @returns first vector of canonical basis
     */
    static get ex() {
        return Vector3.e(0);
    }

    /**
     * @returns second vector of canonical basis
     */
    static get ey() {
        return Vector3.e(1);
    }

    /**
     * @returns third vector of canonical basis
     */
    static get ez() {
        return Vector3.e(2);
    }

    /**
     * @brief canonical basis
     * @details The basis is ordered as `e(0) == ex`, `e(1) == ey`, `e(2) == ez`.
     * @param k {number} order of the vector in basis
     * @returns value of the canonical vector
     */
    static e(k: number) {
        return new Vector3(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    }

    /**
     * @brief radial vector of spherical basis
     * @param u position of local basis from origin
     * @returns value of the radial vector
     */
    static er(u: Vector3) {
        return new Vector3(
            Math.sin(u.phi) * Math.cos(u.theta),
            Math.sin(u.phi) * Math.sin(u.theta),
            Math.cos(u.phi)
        );
    }

    /**
     * @brief prograde vector of spherical basis
     * @details Prograde vector is perpendicular to the radial vector and oriented in the positive `theta` direction.
     * Note that this vector also correspond to the prograde vector of cylindrical basis.
     * @param u position of local basis from origin
     * @returns value of the prograde vector
     */
    static etheta(u: Vector3) {
        return new Vector3(
            -Math.sin(u.theta),
            Math.cos(u.theta),
            0
        );
    }

    /**
     * @brief normal vector of spherical basis
     * @details Normal vector is perpendicular to the radial vector and oriented in the positive `phi` direction.
     * @param u position of local basis from origin
     * @returns value of the normal vector
     */
    static ephi(u: Vector3) {
        return new Vector3(
            Math.cos(u.phi) * Math.cos(u.theta),
            Math.cos(u.phi) * Math.sin(u.theta),
            -Math.sin(u.phi)
        );
    }

    /**
     * @brief derivative of an array of vector with given steps
     * @details Representing discrete derivative of the array of Vector3.
     * If the original array is of _size `N`, than the derivative is of _size `N - 1`.
     *
     * The derivative is approximated according using the given steps between
     * each value and using lower bound approximation.
     *
     * @param vectors array of `Vector3` to process
     * @param dt array of numbers representing steps between Vector3
     * @returns array of `Vector` representing the value of the derivative
     */
    static derivative(vectors: Vector3[], dt: number[] | number = 1) {
        const steps = (typeof dt == "number") ? Array(vectors.length).fill(dt) : dt;
        const der = new Array(vectors.length - 1);
        for (let i = 0; i < vectors.length - 1; i++) {
            der[i] = vectors[i + 1].copy().sub(vectors[i]).div(steps[i]);
        }
        return der;
    }

    /**
     * @brief create a vector with given array
     * @details The transformation is performed such that `x` is at index 0, `y` at 1 and `z` at 2.
     * @param arr array containing cartesian coordinates
     * @returns new instance of vector
     */
    static from1D(arr: number[]) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

    /**
     * @brief create a vector with given cylindrical coordinates
     * @returns new instance of vector
     */
    static cylindrical(rxy: number, theta: number, z: number) {
        const u = new Vector3();
        u.rthz = [rxy, theta, z];
        return u;
    }

    /**
     * @brief create a vector with given spherical coordinates
     * @returns new instance of vector
     */
    static spherical(r: number, theta: number, phi: number) {
        const u = new Vector3();
        u.rthph = [r, theta, phi];
        return u;
    }
}
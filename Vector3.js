/**
 * @class Vector3
 * @author samiBendou
 * @brief vectors in 3D space
 * @details `Vector3` class represents vectors in 3D space.
 *
 * Construct a `Vector3` **cartesian coordinates** `x`, `y`, `z`.
 *
 * #### Features
 *
 * - Perform **vector space operations** between vectors such as addition or scalar multiplication.
 *
 * - Compute the angle between two vector, the cross product and many other **geometrical operations**.
 *
 * - Use cylindrical `r`, `theta`, `z` and spherical `rxy`, `theta`, `phi` coordinates
 * with provided **setters and getters**.
 *
 * @property x {number} x cartesian coordinate
 * @property y {number} y cartesian coordinate
 * @property z {number} z cartesian coordinate
 * @property r {number} r spherical coordinate
 * @property rxy {number} r cylindrical coordinate
 * @property theta {number} counterclockwise angle formed with `ex` in radians
 * @property phi {number} angle formed with  `ez` in radians
 */
class Vector3 {

    constructor(x, y, z) {
        this.setXYZ(x, y, z);
    }

    get r() {
        return Math.sqrt(this.scal(this));
    }

    set r(newR) {
        this.setRThetaPhi(newR, this.theta, this.phi);
    }

    get theta() {
        return Math.atan2(this.y, this.x);
    }

    set theta(newTheta) {
        this.setRThetaPhi(this.r, newTheta, this.phi);
    }

    get phi() {
        return Math.atan2(this.rxy, this.z);
    }

    set phi(newPhi) {
        this.setRThetaPhi(this.r, this.theta, newPhi);
    }

    get rxy() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set rxy(newRxy) {
        this.setRThetaZ(newRxy, this.theta, this.z);
    }

    get lat() {
        return Math.PI / 2 - this.phi;
    }

    set lat(newLat) {
        this.setRThetaPhi(this.r, this.theta, Math.PI / 2 - newLat);
    }

    get lon() {
        return this.theta <= Math.PI ? this.theta : this.theta - 2 * Math.PI;
    }

    set lon(newLat) {
        this.setRThetaPhi(this.r, newLat >= 0 ? newLat : newLat + 2 * Math.PI, this.phi);
    }

    /**
     * @brief sets cartesian coordinate of a vector
     * @property x {number} x cartesian coordinate
     * @property y {number} y cartesian coordinate
     * @property z {number} z cartesian coordinate
     * @returns {Vector3} reference to `this`
     */
    setXYZ(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * @brief sets cylindrical coordinates
     * @details Transforms cylindrical coordinates to cartesian coordinates.
     * @returns {Vector3} reference to `this`
     */
    setRThetaZ(rxy, theta, z) {
        this.x = rxy * Math.cos(theta);
        this.y = rxy * Math.sin(theta);
        this.z = z;
        return this;
    }

    /**
     * @brief sets spherical coordinates
     * @details Transforms spherical coordinates to cartesian coordinates.
     * @returns {Vector3} reference to `this`
     */
    setRThetaPhi(r, theta, phi) {
        this.x = r * Math.sin(phi) * Math.cos(theta);
        this.y = r * Math.sin(phi) * Math.sin(theta);
        this.z = r * Math.cos(phi);
        return this;
    }

    /**
     * @brief fills the vector with a single value
     * @param s {number} value used to fill
     * @returns {Vector3} reference to `this`
     */
    fill(s) {
        this.x = s;
        this.y = s;
        this.z = s;
        return this;
    }

    fillc(s) {
        return this.copy().fill(s);
    }

    /**
     * @brief addition between two vectors
     * @param u {Vector3} vector to add
     * @returns {Vector3} reference to `this`
     */
    add(u) {
        this.x += u.x;
        this.y += u.y;
        this.z += u.z;
        return this;
    }

    addc(u) {
        return this.copy().add(u);
    }

    /**
     * @brief subtraction between two vectors
     * @param u {Vector3} vector to subtract
     * @returns {Vector3} reference to `this`
     */
    sub(u) {
        this.x -= u.x;
        this.y -= u.y;
        this.z -= u.z;
        return this;
    }

    subc(u) {
        return this.copy().sub(u);
    }

    /**
     * @brief opposite of the vector
     * @returns {Vector3} reference to `this`
     */
    opp() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    oppc() {
        return this.copy().opp();
    }

    /**
     * @brief scalar multiplication of the vector
     * @param s {number} scalar to multiply
     * @returns {Vector3} reference to `this`
     */
    mul(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    mulc(s) {
        return this.copy().mul(s);
    }

    /**
     * @brief scalar division of the vector
     * @param s {number} scalar to divide
     * @returns {Vector3} reference to `this`
     */
    div(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    divc(s) {
        return this.copy().div(s);
    }

    /**
     * @brief scalar product of two vector
     * @param u {Vector3} vector to multiply
     * @returns {number} value of scalar multiplication
     */
    scal(u) {
        return this.x * u.x + this.y * u.y + this.z * u.z;
    }

    /**
     * @brief cross product of two vector
     * @param u {Vector3} vector to multiply
     * @returns {Vector3} reference to `this`
     */
    cross(u) {
        this.setXYZ(
            this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x
        );
        return this;
    }

    crossc(u) {
        return this.copy().cross(u);
    }

    /**
     * @brief distance between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the distance
     */
    dist(u) {
        return this.copy().sub(u).r;
    }

    /**
     * @brief angle between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the angle in radians
     */
    angle(u) {
        return Math.atan(this.tan(u));
    }

    /**
     * @brief cosine of the angle between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the cosine
     */
    cos(u) {
        return (!this.isZero() && !u.isZero()) ? this.scal(u) / (this.r * u.r) : 1;
    }

    /**
     * @brief sine of the angle between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the sine
     */
    sin(u) {
        return (!this.isZero() && !u.isZero()) ? this.copy().cross(u).r / (this.r * u.r) : 0;
    }

    /**
     * @brief tangent of the angle between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the tangent
     */
    tan(u) {
        return this.sin(u) / this.cos(u);
    }

    /**
     * @brief clone a vector
     * @returns {Vector3} new instance of cloned vector
     */
    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * @brief equality between two vectors
     * @details distance based equality
     * @param u {Vector3} other vector
     * @returns {boolean} `true` if vectors are equal
     */
    isEqual(u) {
        return Math.abs(this.dist(u)) < Number.EPSILON;
    }

    /**
     * @returns {boolean} `true` if vector is filled with zeros
     */
    isZero() {
        return this.r < Number.EPSILON;
    }

    toString() {
        return `(${this.x.toExponential(2)} ${this.y.toExponential(2)} ${this.z.toExponential(2)})`;
    }

    /**
     * @brief transform vector to array
     * @details The transformation is performed such that `x` is at index 0, `y` at 1 and `z` at 2
     * @returns {Array} value of the vector
     */
    to1D() {
        return [this.x, this.y, this.z];
    }

    /**
     * @returns {Vector3} vector filled with `0`
     */
    static get zeros() {
        return new Vector3();
    }

    /**
     * @returns {Vector3} vector filled with `1`
     */
    static get ones() {
        return Vector3.scal(1);
    }

    /**
     * @brief scalar vector
     * @param s {number} scalar value
     * @returns {Vector3} vector filled with `s`
     */
    static scal(s) {
        return new Vector3(s, s, s);
    }

    /**
     * @returns {Vector3} `ex = {x = 1, y = 0, z = 0}`
     */
    static get ex() {
        return Vector3.e(0);
    }

    /**
     * @returns {Vector3} `ey = {x = 0, y = 1, z = 0}`
     */
    static get ey() {
        return Vector3.e(1);
    }

    /**
     * @returns {Vector3} `ez = {x = 0, y = 0, z = 1}`
     */
    static get ez() {
        return Vector3.e(2);
    }

    /**
     * @brief canonical basis
     * @details The basis is ordered as `e(0) == ex`, `e(1) == ey`, `e(2) == ez`.
     * @param k {number} order of the vector in basis
     * @returns {Vector3} value of the canonical vector
     */
    static e(k) {
        return new Vector3(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    }

    /**
     * @brief radial vector of spherical basis
     * @param u {Vector3} position of local basis from origin
     * @returns {Vector3} value of the radial vector
     */
    static er(u) {
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
     * @param u {Vector3} position of local basis from origin
     * @returns {Vector3} value of the prograde vector
     */
    static etheta(u) {
        return new Vector3(
            -Math.sin(u.theta),
            Math.cos(u.theta),
            0
        );
    }

    /**
     * @brief normal vector of spherical basis
     * @details Normal vector is perpendicular to the radial vector and oriented in the positive `phi` direction.
     * @param u {Vector3} position of local basis from origin
     * @returns {Vector3} value of the normal vector
     */
    static ephi(u) {
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
     * @param vectors {Array} array of `Vector3` to process
     * @param dt {Array|number=} array of numbers representing steps between Vector3
     * @returns {Array} array of `Vector` representing the value of the derivative
     */
    static derivative(vectors, dt = 1) {
        let steps = (typeof dt == "number") ? Array(vectors.length).fill(dt) : dt;
        let der = new Array(vectors.length - 1);
        for (let i = 0; i < vectors.length - 1; i++) {
            der[i] = vectors[i + 1].copy().sub(vectors[i]).div(steps[i]);
        }
        return der;
    }

    /**
     * @brief create a vector with given array
     * @details The transformation is performed such that `x` is at index 0, `y` at 1 and `z` at 2.
     * @param arr {Array} array containing cartesian coordinates
     * @returns {Vector3} new instance of vector
     */
    static from1D(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

    /**
     * @brief create a vector with given cylindrical coordinates
     * @returns {Vector3} new instance of vector
     */
    static cylindrical(rxy, theta, z) {
        return new Vector3().setRThetaZ(rxy, theta, z);
    }

    /**
     * @brief create a vector with given spherical coordinates
     * @returns {Vector3} new instance of vector
     */
    static spherical(r, theta, phi) {
        return new Vector3().setRThetaPhi(r, theta, phi);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Vector3;
else
    window.Vector3 = Vector3;
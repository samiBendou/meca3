/**
 * @class Vector3
 * @date 2019-05-09
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
 * - **Chain operations** with an **object syntax** eg. `u.add(v)`, eg. `u.add(v).mul(s)`.
 *
 * - Use cylindrical `r`, `theta`, `z` and spherical `rxy`, `theta`, `phi` coordinates
 * with provided **setters and getters**.
 *
 * - Create vectors using **generators** in a Matlab-style syntax such as `ones`, `zeros`, ...
 *
 * @property x {number} x cartesian coordinate
 * @property y {number} y cartesian coordinate
 * @property z {number} z cartesian coordinate
 * @property r {number} r spherical coordinate
 * @property rxy {number} r cylindrical coordinate
 * @property theta {number} angle formed with `ex` in radians
 * @property phi {number} angle formed with  `ez` in radians
 */
class Vector3 {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
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
        return this.x * this.x + this.y * this.y;
    }

    /**
     * @brief sets spherical coordinates
     * @details Transforms spherical coordinates to cartesian coordinates.
     */
    setRThetaPhi(r, theta, phi) {
        this.x = r * Math.sin(phi) * Math.cos(theta);
        this.y = r * Math.sin(phi) * Math.sin(theta);
        this.z = r * Math.cos(phi);
    }

    /**
     * @brief fills the vector with a single value
     * @param s {number} value used to fill
     */
    fill(s) {
        this.x = s;
        this.y = s;
        this.z = s;
    }

    /**
     * @brief addition between two vectors
     * @param u {Vector3} vector to add
     * @returns {Vector3} reference to this
     */
    add(u) {
        this.x += u.x;
        this.y += u.y;
        this.z += u.z;
        return this;
    }

    /**
     * @brief subtraction between two vectors
     * @param u {Vector3} vector to subtract
     * @returns {Vector3} reference to this
     */
    sub(u) {
        this.x -= u.x;
        this.y -= u.y;
        this.z -= u.z;
        return this;
    }

    /**
     * @brief opposite of the vector
     * @returns {Vector3} reference to this
     */
    get opp() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * @brief scalar multiplication of the vector
     * @param s {number} scalar to multiply
     * @returns {Vector3} reference to this
     */
    mul(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    /**
     * @brief scalar division of the vector
     * @param s {number} scalar to divide
     * @returns {Vector3} reference to this
     */
    div(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
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
     * @returns {Vector3} value of cross product
     */
    cross(u) {
        return new Vector3(this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x);
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
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.scal(u) / (this.r * u.r) : 1;
    }

    /**
     * @brief sine of the angle between two vector
     * @param u {Vector3} other vector
     * @returns {number} value of the sine
     */
    sin(u) {
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.cross(u).r / (this.r * u.r) : 0;
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
     * @return {Vector3} new instance of cloned vector
     */
    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * @brief equality between two vectors
     * @details distance based equality
     * @param u {Vector3} other vector
     * @return {boolean} `true` if vectors are equal
     */
    isEqual(u) {
        return Math.abs(this.dist(u)) < Number.EPSILON;
    }

    /**
     * @return {boolean} `true` if vector is filled with zeros
     */
    isZero() {
        return this.r < Number.EPSILON;
    }

    toString() {
        return "(" + this.x.toFixed(2) + " " + this.y.toFixed(2) + " " + this.z.toFixed(2) + ")";
    }

    /**
     * @brief transform vector to array
     * @details The transformation is performed such that `x` is at index 0, `y` at 1 and `z` at 2
     * @return {Array} value of the vector
     */
    toArray() {
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
     * @brief sums vectors in array
     * @param vectors {Array} array of `Vector3`
     * @returns {Vector3} value of the sum
     */
    static sum(vectors) {
        return vectors.reduce(function (prev, cur) {
            return prev.copy().add(cur);
        });
    }

    /**
     * @brief linear combination of vectors in array
     * @param scalars {Array} array of numbers
     * @param vectors {Array} array of `Vector3`
     * @returns {Vector3} value of linear combination
     */
    static comb(scalars, vectors) {
        return vectors.reduce(function (prev, cur, index) {
            return prev.copy().mul(scalars[index - 1]).add(cur.copy().mul(scalars[index]));
        });
    }

    /**
     * @brief derivative of an array of vector with given steps
     * @details Representing discrete derivative of the array of Vector3.
     * If the original array is of size `N`, than the derivative is of size `N - 1`.
     *
     * The derivative is approximated according using the given steps between
     * each value and using lower bound approximation.
     *
     * @param vectors {Array} array of `Vector3` to process
     * @param steps {Array} array of numbers representing steps between Vector3
     * @returns {Array} array of `Vector` representing the value of the derivative
     */
    static der(vectors, steps) {
        let der = new Array(vectors.length - 1);
        for (let i = 1; i < vectors.length; i++) {
            der[i - 1] = vectors[i].copy().sub(vectors[i - 1]).div(steps[i - 1]);
        }
        return der;
    }


    /**
     * @brief create a vector with given array
     * @details The transformation is performed such that `x` is at index 0, `y` at 1 and `z` at 2.
     * @param arr {Array} array containing cartesian coordinates
     * @returns {Vector3} new instance of vector
     */
    static fromArray(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Vector3;
else
    window.Vector3 = Vector3;
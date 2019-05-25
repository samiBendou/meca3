/**
 * @class Vector3
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Representation of 3D vectors
 * @details The 3D vectors are stored by components using cartesian coordinates (x, y, z).
 *
 * Vector3 class allows to perform vector space operations between vectors (u + v, s * u).
 * Operations are performed using a object-syntax eg. u.add(v), they e be chained eg. u.add(v).mul(s).
 *
 * Vector3 class provides setters and getters for cylindrical (r, theta, z)
 * and spherical coordinates (r, theta, phi).
 *
 * Vector3 class is designed to provide many features related to geometry such
 * as the angle of between two vector, the cross product.
 *
 * The Vector3 class provides vectors generator in a numpy-style syntax such as ones, zeros, ...
 *
 * We denote the canonical basis of 3D euclidean space ex, ey, ez such that :
 * - ex = (1, 0, 0), - ey = (0, 1, 0), - ez = (0, 0, 1)
 *
 * @property r {number} length of this vector, also the r spherical coordinate
 * @property theta {number} angle between ex and this vector in radians
 * @property phi {number} angle between ez and this vector in radians
 * @property rxy {number} length of the projection of this vector on the (ex, ey) plan
 */
class Vector3 {
    /**
     * @brief Construct a Vector3 using cartesian coordinates
     * @param x {number} x coordinate
     * @param y {number} y coordinate
     * @param z {number} z coordinate
     */
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
     * @details Transforms spherical coordinates to cartesian coordinates
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
     * @brief Addition between two vectors
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
     * @brief Subtraction between two vectors
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
     * @brief Opposite of the vector
     * @returns {Vector3} reference to this
     */
    get opp() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * @brief Scalar multiplication of the vector
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
     * @brief Scalar division of the vector
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
     * @brief Scalar product of two vector
     * @param u {Vector3} Vector to multiply
     * @returns {number} value of scalar multiplication
     */
    scal(u) {
        return this.x * u.x + this.y * u.y + this.z * u.z;
    }

    /**
     * @brief Cross product of two vector
     * @param u {Vector3} Vector to multiply
     * @returns {Vector3} value of cross product
     */
    cross(u) {
        return new Vector3(this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x);
    }

    /**
     * @brief Distance between two vector
     * @param u {Vector3} Other vector
     * @returns {number} value of the distance
     */
    dist(u) {
        return this.copy().sub(u).r;
    }

    /**
     * @brief Angle between two vector
     * @param u {Vector3} Other vector
     * @returns {number} value of the angle in radians
     */
    angle(u) {
        return Math.atan(this.tan(u));
    }

    /**
     * @brief Cosine of the angle between two vector
     * @param u {Vector3} Other vector
     * @returns {number} value of the cosine
     */
    cos(u) {
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.scal(u) / (this.r * u.r) : 1;
    }

    /**
     * @brief Sine of the angle between two vector
     * @param u {Vector3} Other vector
     * @returns {number} value of the sine
     */
    sin(u) {
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.cross(u).r / (this.r * u.r) : 0;
    }

    /**
     * @brief Tangent of the angle between two vector
     * @param u {Vector3} Other vector
     * @returns {number} value of the tangent
     */
    tan(u) {
        return this.sin(u) / this.cos(u);
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    isEqual(u) {
        return Math.abs(this.dist(u)) < Number.EPSILON;
    }

    isZero() {
        return this.r < Number.EPSILON;
    }

    toString() {
        return "(" + this.x.toFixed(2) + " " + this.y.toFixed(2) + " " + this.z.toFixed(2) + ")";
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    /**
     * @returns {Vector3} vector filled with 0
     */
    static get zeros() {
        return new Vector3();
    }

    /**
     * @returns {Vector3} vector filled with 1
     */
    static get ones() {
        return Vector3.scal(1);
    }

    /**
     * @brief Scalar vector
     * @param s {number} scalar value
     * @returns {Vector3} vector filled with s
     */
    static scal(s) {
        return new Vector3(s, s, s);
    }

    /**
     * @returns {Vector3} (1 0 0)
     */
    static get ex() {
        return Vector3.e(0);
    }

    /**
     * @returns {Vector3} (0 1 0)
     */
    static get ey() {
        return Vector3.e(1);
    }

    /**
     * @returns {Vector3} (0 0 1)
     */
    static get ez() {
        return Vector3.e(2);
    }

    /**
     * @brief Canonical basis
     * @details The basis is ordered as e0 = ex, e1 = ey, e2 = ez
     * @param k
     * @returns {Vector3}
     */
    static e(k) {
        return new Vector3(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    }

    /**
     * @brief Sums vectors in array
     * @param vectors {Array} array of Vector3
     * @returns {Vector3} value of the sum
     */
    static sum(vectors) {
        return vectors.reduce(function (prev, cur) {
            return prev.copy().add(cur);
        });
    }

    /**
     * @brief Linear combination of vectors in array with scalars
     * @param scalars {Array} array of numbers
     * @param vectors {Array} array of Vector3
     * @returns {Vector3} value of linear combination
     */
    static comb(scalars, vectors) {
        return vectors.reduce(function (prev, cur, index) {
            return prev.copy().mul(scalars[index - 1]).add(cur.copy().mul(scalars[index]));
        });
    }

    /**
     * @brief Create a vector with given array
     * @param arr {Array} array containing cartesian coordinates
     * @returns {Vector3} newly created vector
     */
    static fromArray(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

    /**
     * @brief Derivative of an array of vector with given steps
     * @details Representing derivative of the array of Vector3 depending on a variable s
     * such that s0 = 0, smax = sum of the steps
     * If the original array is of size N, than the derivative is of size N - 1
     *
     * @param vectors {Array} array of Vector3 to process
     * @param steps {Array} array of numbers representing steps between Vector3
     * @returns {Array} array representing the value of the derivative
     */
    static der(vectors, steps) {
        let der = new Array(vectors.length - 1);
        for (let i = 1; i < vectors.length; i++) {
            der[i - 1] = vectors[i].copy().sub(vectors[i - 1]).div(steps[i - 1]);
        }
        return der;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Vector3;
else
    window.Vector3 = Vector3;
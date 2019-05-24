/**
 *
 * @type {module.Vector3}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Representation of 3D vectors
 * @details The 3D vectors are stored by components using cartesian coordinates (x, y, z).
 *
 *          Vector3 class allows to perform vector space operations between vectors (u + v, s * u).
 *          Operations are performed using a object-syntax eg. u.add(v), they can be chained eg. u.add(v).mul(s).
 *
 *          Vector3 class provides setters and getters for cylindrical (r, theta, z)
 *          and spherical coordinates (r, theta, phi).
 *
 *          Vector3 class is designed to provide many features related to geometry such
 *          as the angle of between two vector, the cross product.
 *
 *          The Vector3 class provides vectors generator in a numpy-style syntax such as ones, zeros, ...
 *
 *          We denote the canonical basis of 3D euclidean space ex, ey, ez such that :
 *              - ex = (1, 0, 0), - ey = (0, 1, 0), - ez = (0, 0, 1)

 * @property r {number} length of this vector, also the r spherical coordinate
 * @property theta {number} angle between ex and this vector
 * @property phi {number} angle between ez and this vector
 * @property rxy {number} length of the projection of this vector on the (ex, ey) plan
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

    setRThetaPhi(r, theta, phi) {
        this.x = r * Math.sin(phi) * Math.cos(theta);
        this.y = r * Math.sin(phi) * Math.sin(theta);
        this.z = r * Math.cos(phi);
    }

    fill(s) {
        this.x = s;
        this.y = s;
        this.z = s;
    }

    add(u) {
        this.x += u.x;
        this.y += u.y;
        this.z += u.z;
        return this;
    }

    sub(u) {
        this.x -= u.x;
        this.y -= u.y;
        this.z -= u.z;
        return this;
    }

    get opp() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    mul(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    div(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    scal(u) {
        return this.x * u.x + this.y * u.y + this.z * u.z;
    }

    cross(u) {
        return new Vector3(this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x);
    }

    dist(u) {
        return this.copy().sub(u).r;
    }

    angle(u) {
        return Math.atan(this.tan(u));
    }

    cos(u) {
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.scal(u) / (this.r * u.r) : 1;
    }

    sin(u) {
        return (!this.isEqual(0) && !u.isEqual(0)) ? this.cross(u).r / (this.r * u.r) : 0;
    }

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

    static get zeros() {
        return new Vector3();
    }

    static get ones() {
        return Vector3.scal(1);
    }

    static get ex() {
        return Vector3.can(0);
    }

    static get ey() {
        return Vector3.can(1);
    }

    static get ez() {
        return Vector3.can(2);
    }

    static scal(s) {
        return new Vector3(s, s, s);
    }

    static can(k) {
        return new Vector3(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    }

    static sum(vectors) {
        return vectors.reduce(function (prev, cur) {
            return prev.copy().add(cur);
        });
    }

    static comb(scalars, vectors) {
        return vectors.reduce(function (prev, cur, index) {
            return prev.copy().mul(scalars[index - 1]).add(cur.copy().mul(scalars[index]));
        });
    }

    static fromArray(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

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
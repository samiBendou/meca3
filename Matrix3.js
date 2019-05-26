if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    Vector3 = require("./Vector3.js");

/**
 * @class Matrix3
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Representation of 3x3 matrices
 * @details The matrix is stored in memory as an aggregation of three Vector3 rows : x, y, z.
 *
 * Access a component of the matrix using the following syntax : m.i.j where
 * both i and j e be equal to x, y or z. eg m.x.x or m.y.z
 *
 * Matrix3 class extends vector space operations from Vector3 and provide other
 * matrix related algebraical operations.
 *
 * Matrix3 class is designed to provide fast inversion, product and determinant
 * computation.
 *
 * It provides many generators and especially for rotation matrices.
 */
class Matrix3 {

    /**
     * @brief Construct a matrix by explicitly giving components
     * @details The component are ordered as rows, eg. Matrix3(1, 2, 3) fills the first row with (1 2 3)
     */
    constructor(xx = 0, xy = 0, xz = 0,
                yx = 0, yy = 0, yz = 0,
                zx = 0, zy = 0, zz = 0) {

        this.x = new Vector3(xx, xy, xz);
        this.y = new Vector3(yx, yy, yz);
        this.z = new Vector3(zx, zy, zz);
    }

    row(i) {
        let labels = ["x", "y", "z"];
        return this[labels[i]].copy();
    }

    col(j) {
        let labels = ["x", "y", "z"];
        return new Vector3(this.x[labels[j]], this.y[labels[j]], this.z[labels[j]]);
    }

    fill(s) {
        this.x.fill(s);
        this.y.fill(s);
        this.z.fill(s);
        return this;
    }

    add(m) {
        this.x.add(m.x);
        this.y.add(m.y);
        this.z.add(m.z);
        return this;
    }

    sub(m) {
        this.x.sub(m.x);
        this.y.sub(m.y);
        this.z.sub(m.z);
        return this;
    }

    get opp() {
        this.x.opp;
        this.y.opp;
        this.z.opp;
        return this;
    }

    mul(s) {
        this.x.mul(s);
        this.y.mul(s);
        this.z.mul(s);
        return this;
    }

    div(s) {
        this.x.div(s);
        this.y.div(s);
        this.z.div(s);
        return this;
    }

    /**
     * @brief Transpose the matrix
     * @returns {Matrix3} value of the transposed matrix
     */
    get trans() {
        let copy = this.copy();

        copy.x.y = this.y.x;
        copy.x.z = this.z.x;

        copy.y.x = this.x.y;
        copy.y.z = this.z.y;

        copy.z.x = this.x.z;
        copy.z.y = this.y.z;

        return copy;
    }

    /**
     * @brief Product between two matrix
     * @param m {Matrix3} matrix to multiply
     * @returns {Matrix3} value of the product
     */
    prod(m) {
        let mTrs = m.copy().trans;
        let copy = this.copy();

        copy.x.x = this.x.scal(mTrs.x);
        copy.x.y = this.x.scal(mTrs.y);
        copy.x.z = this.x.scal(mTrs.z);

        copy.y.x = this.y.scal(mTrs.x);
        copy.y.y = this.y.scal(mTrs.y);
        copy.y.z = this.y.scal(mTrs.z);

        copy.z.x = this.z.scal(mTrs.x);
        copy.z.y = this.z.scal(mTrs.y);
        copy.z.z = this.z.scal(mTrs.z);

        return copy;
    }

    /**
     * @brief Product between matrix and vector
     * @details Also called linear mapping between matrix and vector
     * @param u {Vector3} vector to multiply
     * @returns {Vector3} value of linear mapping
     */
    map(u) {
        let copy = u.copy();

        copy.x = this.x.scal(u);
        copy.y = this.y.scal(u);
        copy.z = this.z.scal(u);

        return copy;
    }

    /**
     * @brief Determinant of a matrix
     * @returns {number} value of the determinant
     */
    get det() {
        return this.x.x * this.y.y * this.z.z + this.x.y * this.y.z * this.z.x + this.x.z * this.y.x * this.z.y
            - this.x.z * this.y.y * this.z.x - this.x.y * this.y.x * this.z.z - this.x.x * this.y.z * this.z.y;
    }

    /**
     * @brief Inverse of a matrix
     * @details returns a NaN matrix when the determinant is 0
     * @returns {Matrix3} value of the inverse matrix
     */
    get inv() {
        return (new Matrix3(this.y.y * this.z.z - this.y.z * this.z.y,
            this.x.z * this.z.y - this.x.y * this.z.z,
            this.x.y * this.y.z - this.x.z * this.y.y,

            this.y.z * this.z.x - this.y.x * this.z.z,
            this.x.x * this.z.z - this.x.z * this.z.x,
            this.x.z * this.y.x - this.x.x * this.y.z,

            this.y.x * this.z.y - this.y.y * this.z.x,
            this.x.y * this.z.x - this.x.x * this.z.y,
            this.x.x * this.y.y - this.x.y * this.y.x)).div(this.det);
    }

    copy() {
        let copy = new Matrix3();

        copy.x = this.x.copy();
        copy.y = this.y.copy();
        copy.z = this.z.copy();

        return copy;
    }

    isEqual(m) {
        return this.x.isEqual(m.x) && this.y.isEqual(m.y) && this.z.isEqual(m.z);
    }

    isZero() {
        return this.x.isZero() && this.y.isZero() && this.z.isZero();
    }

    toString() {
        return this.x.toString() + "\n" + this.y.toString() + "\n" + this.z.toString();
    }

    toArray() {
        return [this.x.toArray(), this.y.toArray(), this.z.toArray()];
    }

    static get zeros() {
        return new Matrix3();
    }

    static get ones() {
        return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
    }

    /**
     * @brief Identity matrix
     * @details Diagonal matrix filled with 1
     * @returns {Matrix3} value of identity matrix
     */
    static get eye() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief Scalar matrix
     * @details Diagonal matrix filled with a single value
     * @param s {number} scalar value
     * @returns {Matrix3} value of scalar matrix
     */
    static scal(s) {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /**
     * @brief Canonical matrix
     * @details Matrix with 0 everywhere except in i, j position
     * @param i {number} row index of 1
     * @param j {number} column index of 1
     * @returns {Matrix3} value of canonical matrix
     */
    static e(i, j) {
        let labels = ["x", "y", "z"];
        let can = Matrix3.zeros;

        can[labels[i]][labels[j]] = 1;
        return can;
    }

    static sum(matrices) {
        return matrices.reduce(function (prev, cur) {
            return prev.copy().add(cur);
        });
    }

    static comb(scalars, matrices) {
        return matrices.reduce(function (prev, cur, index) {
            return prev.copy().mul(scalars[index - 1]).add(cur.copy().mul(scalars[index]));
        });
    }

    /**
     * @details Product of the matrices in array
     * @details The product is performed in the same order of the elements in the array
     * @param matrices {Array} array of Vector3
     * @returns {Matrix3} value of the product
     */
    static prod(matrices) {
        return matrices.reduce(function (prev, cur) {
            return prev.copy().prod(cur);
        });
    }

    /**
     * @brief rotation matrix of axis (0, ex)
     * @details anticlockwise rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} Value of rotation matrix for specified angle
     */
    static rotX(theta) {
        return new Matrix3(1, 0, 0,
            0, Math.cos(theta), -Math.sin(theta),
            0, Math.sin(theta), Math.cos(theta));
    }

    /**
     * @brief rotation matrix of axis (0, ey)
     * @details anticlockwise rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} Value of rotation matrix for specified angle
     */
    static rotY(theta) {
        return new Matrix3(Math.cos(theta), 0, Math.sin(theta),
            0, 1, 0,
            -Math.sin(theta), 0, Math.cos(theta));
    }

    /**
     * @brief rotation matrix of axis (0, ez)
     * @details anticlockwise rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} Value of rotation matrix for specified angle
     */
    static rotZ(theta) {
        return new Matrix3(Math.cos(theta), -Math.sin(theta), 0,
            Math.sin(theta), Math.cos(theta), 0,
            0, 0, 1);
    }

    /**
     * @brief rotation matrix with specified axis and angle
     * @details anticlockwise rotation
     * @returns {function(number):Matrix3} Value of rotation matrix for specified angle
     */
    static makeRot(axis) {
        //R = P + cos(theta) * (I - P) + sin(theta) * Q

        let id = Matrix3.eye; // antisymmetric representation of u
        let q = Matrix3.zeros;
        let u = axis.copy().div(axis.r); // normalized axis
        let p = Matrix3.tens(u); // projection on rotation axis
        let r = p.copy();

        q.x = u.cross(Vector3.ex);
        q.y = u.cross(Vector3.ey);
        q.z = u.cross(Vector3.ez);
        q = q.trans;

        return function (theta) {
            return r.add(id.sub(p).mul(Math.cos(theta))).add(q.mul(Math.sin(theta)));
        };
    }

    /**
     * @brief Create a matrix with given array
     * @param arr {Array} bi-dimensional array containing rows of the matrix
     * @returns {Matrix3} newly created matrix
     */
    static fromArray(arr) {
        return new Matrix3(arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /**
     * @brief tensor product of a vector against itself
     * @details tensor product is the matrix obtained from two vectors
     * such that mij = ui * vj
     * @param u {Vector3} vector to transform
     * @returns {Matrix3} value of the matrix product
     */
    static tens(u) {
        return new Matrix3(
            u.x * u.x, u.x * u.y, u.x * u.z,
            u.y * u.x, u.y * u.y, u.y * u.z,
            u.z * u.x, u.z * u.y, u.z * u.z,
        );
    }

    /**
     * @brief Creates an affine transformation of the vector
     * @details Generates a Javascript function that returns the affine transform of the vector
     * @param m {Matrix3} matrix of the affine transform
     * @param v {Vector3} vector of the affine transform
     * @returns {function(Vector3): Vector3}
     */
    static makeAffine(m, v) {
        return function (u) {
            return m.map(u).add(v)
        };
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Matrix3;
else
    window.Matrix3 = Matrix3;
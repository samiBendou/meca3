if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    Vector3 = require("./Vector3.js");

/**
 * @class Matrix3
 * @author samiBendou
 * @brief 3x3 matrices
 * @details `Matrix3` class represents dense 3x3 matrices.
 *
 * Components are stored in memory as an aggregation of three Vector3 rows : `x`, `y`, `z`.
 *
 * Access a component of the matrix with the syntax `m.i.j` where `i` and `j` might be equal to `x`, `y` or `z`.
 * eg. `m.x.x`, `m.y.z`, ...
 *
 * Construct a matrix by explicitly giving components.
 * eg. ` new Matrix3(1, 2, 3)` fills the first row `x` with `{x = 1, y = 2, z = 3}`.
 *
 * #### Features
 *
 * - Use extended **vector space operations** and **geometrical operations** from `Vector3`.
 *
 * - Compute  **algebraical operations** such as inversion, product or determinant.
 *
 * - Create matrices using **generators** in a Matlab-style syntax such as `eye`, `ones`, ...
 *
 * - All the generators from `Vector3` are extended to `Matrix3` class.
 *
 * @property x {Vector3} first row
 * @property y {Vector3} second row
 * @property z {Vector3} third row
 */
class Matrix3 {

    constructor(xx, xy, xz,
                yx, yy, yz,
                zx, zy, zz) {
        this.x = new Vector3(xx, xy, xz);
        this.y = new Vector3(yx, yy, yz);
        this.z = new Vector3(zx, zy, zz);
    }

    /**
     * @brief i-th row
     * @param i {number} index of the row to get
     * @return {Vector3} value of the row
     */
    row(i) {
        let labels = ["x", "y", "z"];
        return this[labels[i]].copy();
    }

    /**
     * @brief j-th column
     * @param j {number} index of the column to get
     * @return {Vector3} value of the column
     */
    col(j) {
        let labels = ["x", "y", "z"];
        return new Vector3(this.x[labels[j]], this.y[labels[j]], this.z[labels[j]]);
    }

    /**
     *
     * @brief sets the components of the matrix
     * @returns {Matrix3} reference to `this`
     */
    set(xx = 0, xy = 0, xz = 0,
        yx = 0, yy = 0, yz = 0,
        zx = 0, zy = 0, zz = 0) {
        this.x.setXYZ(xx, xy, xz);
        this.y.setXYZ(yx, yy, yz);
        this.z.setXYZ(zx, zy, zz);
        return this;
    }

    fill(s) {
        this.x.fill(s);
        this.y.fill(s);
        this.z.fill(s);
        return this;
    }

    fillc(s) {
        return this.copy().fill(s);
    }

    add(m) {
        this.x.add(m.x);
        this.y.add(m.y);
        this.z.add(m.z);
        return this;
    }

    addc(m) {
        return this.copy().add(m);
    }

    sub(m) {
        this.x.sub(m.x);
        this.y.sub(m.y);
        this.z.sub(m.z);
        return this;
    }

    subc(m) {
        return this.copy().sub(m);
    }

    opp() {
        this.x.opp();
        this.y.opp();
        this.z.opp();
        return this;
    }

    oppc() {
        return this.copy().opp();
    }

    mul(s) {
        this.x.mul(s);
        this.y.mul(s);
        this.z.mul(s);
        return this;
    }

    mulc(s) {
        return this.copy().mul(s);
    }

    div(s) {
        this.x.div(s);
        this.y.div(s);
        this.z.div(s);
        return this;
    }

    divc(s) {
        return this.copy().div(s);
    }

    /**
     * @brief transpose the matrix
     * @returns {Matrix3} reference to `this`
     */
    trans() {
        this.set(
            this.x.x, this.y.x, this.z.x,
            this.x.y, this.y.y, this.z.y,
            this.x.z, this.y.z, this.z.z
        );
        return this;
    }

    transc() {
        return this.copy().trans();
    }

    /**
     * @brief product between two matrix
     * @param m {Matrix3} matrix to multiply
     * @returns {Matrix3} reference to `this`
     */
    prod(m) {
        let mTrs = m.copy().trans();
        this.set(
            this.x.scal(mTrs.x), this.x.scal(mTrs.y), this.x.scal(mTrs.z),
            this.y.scal(mTrs.x), this.y.scal(mTrs.y), this.y.scal(mTrs.z),
            this.z.scal(mTrs.x), this.z.scal(mTrs.y), this.z.scal(mTrs.z)
        );
        return this;
    }

    prodc(m) {
        return this.copy().prod(m);
    }

    /**
     * @brief product between matrix and vector
     * @details `u` contains the result of the product. Also called linear mapping between matrix and vector.
     * @param u {Vector3} vector to multiply
     * @returns {Vector3} reference to `u`
     */
    map(u) {
        u.setXYZ(this.x.scal(u), this.y.scal(u), this.z.scal(u));
        return u;
    }

    mapc(u) {
        return this.map(u.copy());
    }

    /**
     * @brief determinant of a matrix
     * @returns {number} value of the determinant
     */
    get det() {
        return this.x.x * this.y.y * this.z.z + this.x.y * this.y.z * this.z.x + this.x.z * this.y.x * this.z.y
            - this.x.z * this.y.y * this.z.x - this.x.y * this.y.x * this.z.z - this.x.x * this.y.z * this.z.y;
    }

    /**
     * @brief inverse of a matrix
     * @details returns a `NaN` matrix when the determinant is zero.
     * @returns {Matrix3} reference to this
     */
    inv() {
        let det = this.det;
        this.set(
            this.y.y * this.z.z - this.y.z * this.z.y,
            this.x.z * this.z.y - this.x.y * this.z.z,
            this.x.y * this.y.z - this.x.z * this.y.y,
            this.y.z * this.z.x - this.y.x * this.z.z,
            this.x.x * this.z.z - this.x.z * this.z.x,
            this.x.z * this.y.x - this.x.x * this.y.z,
            this.y.x * this.z.y - this.y.y * this.z.x,
            this.x.y * this.z.x - this.x.x * this.z.y,
            this.x.x * this.y.y - this.x.y * this.y.x
        ).div(det);

        return this;
    }

    invc() {
        return this.copy().inv();
    }

    rpow(exp) {
        if (exp > 1) {
            let copy = this.copy();
            this.prod(copy);
            if (exp % 2 === 0) {
                this.rpow(exp / 2);
            } else if (exp % 2 === 1) {
                this.rpow((exp - 1) / 2);
                this.prod(copy);
            }
        }
    }

    /**
     * @brief exponentiation of a matrix
     * @param exp {number} integer exponent
     * @return {Matrix3} reference to this
     */
    pow(exp) {
        if (exp < 0)
            this.inv();
        if (exp === 0)
            this.set(...Matrix3.eye.to1D());
        this.rpow(Math.abs(exp));
        return this;
    }

    powc(exp) {
        return this.copy().pow(exp);
    }

    copy() {
        return new Matrix3(...this.to1D());
    }

    isEqual(m) {
        return this.x.isEqual(m.x) && this.y.isEqual(m.y) && this.z.isEqual(m.z);
    }

    isZero() {
        return this.x.isZero() && this.y.isZero() && this.z.isZero();
    }

    toString() {
        return `${this.x.toString()}\n${this.y.toString()}\n${this.z.toString()}`;
    }

    /**
     * @brief transform matrix to 2D array
     * @return {Array} bi-dimensional array containing rows of the matrix
     */
    to2D() {
        return [this.x.to1D(), this.y.to1D(), this.z.to1D()];
    }

    /**
     * @brief transform matrix 1D to array
     * @return {Array} array containing the components of the matrix ordered as rows
     */
    to1D() {
        return [...this.x.to1D(), ...this.y.to1D(), ...this.z.to1D()];
    }

    static get zeros() {
        return new Matrix3();
    }

    static get ones() {
        return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
    }

    /**
     * @brief identity matrix
     * @details Diagonal matrix filled with `1`.
     * @returns {Matrix3} value of identity matrix
     */
    static get eye() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief scalar matrix
     * @details Diagonal matrix filled with a single value.
     * @param s {number} scalar value
     * @returns {Matrix3} value of scalar matrix
     */
    static scal(s) {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /**
     * @brief diagonal matrix
     * @return {Matrix3} value of diagonal matrix
     */
    static diag(xx, yy, zz) {
        return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
    }

    /**
     * @brief sym matrix
     * @details Fill the matrix by giving diagonal values. Use this method to generate a tri-diagonal matrix
     * by forgiving the parameter `xz`.
     * @return {Matrix3} value of diagonal matrix
     */
    static sym(xx, yy, zz, xy, yz, xz = 0) {
        return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
    }

    /**
     * @brief canonical matrix
     * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
     * @param i {number} row index of `1`
     * @param j {number} column index of `1`
     * @returns {Matrix3} value of canonical matrix
     */
    static e(i, j) {
        let labels = ["x", "y", "z"];
        let can = Matrix3.zeros;

        can[labels[i]][labels[j]] = 1;
        return can;
    }

    /**
     * @details product of the matrices in array
     * @details The product is performed in the same order as the elements in the array.
     * @param matrices {Array} array of `Vector3`
     * @returns {Matrix3} value of the product
     */
    static prod(matrices) {
        return matrices.reduce((acc, m) => acc.prod(m), Matrix3.eye);
    }

    /**
     * @brief rotation matrix of axis (`0`, `ex`)
     * @details Anticlockwise rotation.
     * @param cos {function(number):number=} `x` metric of the rotation
     * @param sin {function(number):number=} `y` metric of the rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} value of rotation matrix for specified angle
     */
    static rotX(theta, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            1, 0, 0,
            0, cos(theta), -sin(theta),
            0, sin(theta), cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ey`)
     * @details Anticlockwise rotation.
     * @param cos {function(number):number=} `x` metric of the rotation
     * @param sin {function(number):number=} `y` metric of the rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} value of rotation matrix for specified angle
     */
    static rotY(theta, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            cos(theta), 0, sin(theta),
            0, 1, 0,
            -sin(theta), 0, cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ez`)
     * @details Anticlockwise rotation.
     * @param cos {function(number):number=} `x` metric of the rotation
     * @param sin {function(number):number=} `y` metric of the rotation
     * @param theta {number} angle of rotation
     * @returns {Matrix3} value of rotation matrix for specified angle
     */
    static rotZ(theta, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            cos(theta), -sin(theta), 0,
            sin(theta), cos(theta), 0,
            0, 0, 1
        );
    }

    /**
     * @brief rotation matrix with around axis
     * @details Anticlockwise rotation.
     * - Use `a * cosh` as `cos` and `b * sinh` as `sin` to perform a hyperbolic rotation.
     * - Use `a * cos` as `cos` and `b * sin` as `sin` to perform a rotation around an ellipse
     * @param u {Vector3} axis of rotation
     * @param cos {function(number):number=} `x` polar metric of the rotation
     * @param sin {function(number):number=} `y` polar metric of the rotation
     * @returns {function(number):Matrix3} function that generates rotation `Matrix3` for given angle
     */
    static makeRot(u, cos = Math.cos, sin = Math.sin) {
        return (theta) => {
            let k = 1 - cos(theta), c = cos(theta), s = sin(theta);
            return new Matrix3(
                k * u.x ** 2 + c, k * u.x * u.y - u.z * s, k * u.x * u.z + u.y * s,
                k * u.x * u.y + u.z * s, k * u.y ** 2 + c, k * u.y * u.z - u.x * s,
                k * u.x * u.z - u.y * s, k * u.y * u.z + u.x * s, k * u.z ** 2 + c
            );
        }
    }

    /**
     * @brief affine transformation of the vector
     * @param m {Matrix3} matrix of the transformation
     * @param v {Vector3} vector of the transformation
     * @returns {function(Vector3): Vector3} function that computes affine transform for given `Vector3`
     */
    static makeAffine(m, v) {
        return (u) => m.map(u).add(v);
    }

    /**
     * @brief tensor product of two vectors
     * @details Tensor product is the matrix obtained from two vectors such that `m.i.j = u.i * v.j`.
     * @param u {Vector3} first vector to transform
     * @param v {Vector3=} second vector to transform
     * @returns {Matrix3} value of the tensor product
     */
    static tens(u, v) {
        let right = v || u;
        return new Matrix3(
            u.x * right.x, u.x * right.y, u.x * right.z,
            u.y * right.x, u.y * right.y, u.y * right.z,
            u.z * right.x, u.z * right.y, u.z * right.z,
        );
    }

    /**
     * @brief creates a matrix with given 2D array
     *  @details The order of the rows in matrix is the same as in `arr` array
     * @param arr {Array} bi-dimensional array containing rows of the matrix
     * @returns {Matrix3} new instance of matrix
     */
    static from2D(arr) {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /**
     * @brief creates a matrix with given 1D array
     * @details The order of the rows in matrix is the same as in `arr` array
     * @param arr {Array} array containing the components of the matrix ordered as rows
     * @returns {Matrix3} new instance of matrix
     */
    static from1D(arr) {
        return new Matrix3(
            arr[0], arr[1], arr[2],
            arr[3], arr[4], arr[5],
            arr[6], arr[7], arr[8]);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Matrix3;
else
    window.Matrix3 = Matrix3;
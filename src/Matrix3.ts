import {Vector} from "./Algebra";
import Vector3 from "./Vector3";

/**
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
 * - Use **vector space operations** and **geometrical operations**.
 *
 * - Compute  **algebraical operations** such as inversion, product or determinant.
 *
 * - Create matrices using **generators** in a Matlab-style syntax such as `eye`, `ones`, ...
 *
 * - All the generators from `Vector3` are extended to `Matrix3` class.
 */
export default class Matrix3 implements Vector {

    /** first row **/
    x: Vector3;

    /** second row **/
    y: Vector3;

    /** third row **/
    z: Vector3;

    constructor(xx = 0, xy = 0, xz = 0,
                yx = 0, yy = 0, yz = 0,
                zx = 0, zy = 0, zz = 0) {
        this.x = new Vector3(xx, xy, xz);
        this.y = new Vector3(yx, yy, yz);
        this.z = new Vector3(zx, zy, zz);
    }


    /** norm of the matrix from usual inner product**/
    get norm(): number {
        return Math.sqrt(this.scal(this));
    }

    /**
     * @brief i-th row
     * @param i index of the row to get
     * @return value of the row
     */
    row(i: number) {
        return i === 0 ? this.x : undefined || i === 1 ? this.y : undefined || i === 2 ? this.z : undefined;
    }

    /**
     * @brief j-th column
     * @param j index of the column to get
     * @return value of the column
     */
    col(j: number) {
        return new Vector3(this.x.to1D()[j], this.y.to1D()[j], this.z.to1D()[j]);
    }

    /**
     *
     * @brief sets the components of the matrix
     * @returns reference to `this`
     */
    set(xx = 0, xy = 0, xz = 0,
        yx = 0, yy = 0, yz = 0,
        zx = 0, zy = 0, zz = 0) {
        this.x.xyz = [xx, xy, xz];
        this.y.xyz = [yx, yy, yz];
        this.z.xyz = [zx, zy, zz];
        return this;
    }

    copy() {
        return new Matrix3(...this.to1D());
    }

    fill(s: number) {
        this.x.fill(s);
        this.y.fill(s);
        this.z.fill(s);
        return this;
    }

    fillc(s: number) {
        return this.copy().fill(s);
    }

    add(m: Vector) {
        this.x.add(m.x);
        this.y.add(m.y);
        this.z.add(m.z);
        return this;
    }

    addc(m: Vector) {
        return this.copy().add(m);
    }

    sub(m: Vector) {
        this.x.sub(m.x);
        this.y.sub(m.y);
        this.z.sub(m.z);
        return this;
    }

    subc(m: Vector) {
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

    mul(s: number) {
        this.x.mul(s);
        this.y.mul(s);
        this.z.mul(s);
        return this;
    }

    mulc(s: number) {
        return this.copy().mul(s);
    }

    div(s: number) {
        this.x.div(s);
        this.y.div(s);
        this.z.div(s);
        return this;
    }

    divc(s: number) {
        return this.copy().div(s);
    }

    /**
     * @brief transpose the matrix
     * @returns reference to `this`
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
     * @param m matrix to multiply
     * @returns reference to `this`
     */
    prod(m: Vector) {
        const mTrs = m.copy().trans();
        this.set(
            this.x.scal(mTrs.x), this.x.scal(mTrs.y), this.x.scal(mTrs.z),
            this.y.scal(mTrs.x), this.y.scal(mTrs.y), this.y.scal(mTrs.z),
            this.z.scal(mTrs.x), this.z.scal(mTrs.y), this.z.scal(mTrs.z)
        );
        return this;
    }

    prodc(m: Vector) {
        return this.copy().prod(m);
    }

    scal(m: Vector) {
        return this.x.scal(m.x) + this.y.scal(m.y) + this.z.scal(m.z);
    }

    dist(m: Vector) {
        return this.copy().sub(m).norm;
    }

    /**
     * @brief product between matrix and vector
     * @details `u` contains the result of the product. Also called linear mapping between matrix and vector.
     * @param u vector to multiply
     * @returns reference to `u`
     */
    map(u: Vector3) {
        u.xyz = [this.x.scal(u), this.y.scal(u), this.z.scal(u)];
        return u;
    }

    mapc(u: Vector3) {
        return this.map(u.copy());
    }

    /**
     * @brief determinant of a matrix
     * @returns value of the determinant
     */
    get det() {
        return this.x.x * this.y.y * this.z.z + this.x.y * this.y.z * this.z.x + this.x.z * this.y.x * this.z.y
            - this.x.z * this.y.y * this.z.x - this.x.y * this.y.x * this.z.z - this.x.x * this.y.z * this.z.y;
    }

    /**
     * @brief inverse of a matrix
     * @details returns a `NaN` matrix when the determinant is zero.
     * @returns reference to this
     */
    inv() {
        const det = this.det;
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

    rpow(exp: number) {
        if (exp > 1) {
            const copy = this.copy();
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
     * @details if the exponent is negative, exponentiation of the inverse is performed.
     * @param exp integer exponent
     * @return reference to this
     */
    pow(exp: number) {
        if (exp < 0)
            this.inv();
        if (exp === 0)
            this.set(...Matrix3.eye.to1D());
        this.rpow(Math.abs(exp));
        return this;
    }

    powc(exp: number) {
        return this.copy().pow(exp);
    }

    isEqual(m: Matrix3) {
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
     * @return bi-dimensional array containing rows of the matrix
     */
    to2D() {
        return [this.x.to1D(), this.y.to1D(), this.z.to1D()];
    }

    /**
     * @brief transform matrix 1D to array
     * @return array containing the components of the matrix ordered as rows
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
     * @returns value of identity matrix
     */
    static get eye() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief scalar matrix
     * @details Diagonal matrix filled with a single value.
     * @param s scalar value
     * @returns value of scalar matrix
     */
    static scal(s: number) {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /**
     * @brief diagonal matrix
     * @return value of diagonal matrix
     */
    static diag(xx: number, yy: number, zz: number) {
        return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
    }

    /**
     * @brief symmetric matrix
     * @details Fill the matrix by giving diagonal values.
     * @return value of diagonal matrix
     */
    static sym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0) {
        return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
    }

    /**
     * @brief antisymmetric matrix
     * @details Fill the matrix by giving diagonal values.
     * @return value of diagonal matrix
     */
    static asym(xy: number, yz: number, xz = 0) {
        return new Matrix3(0, xy, xz, -xy, 0, yz, -xz, -yz, 0);
    }

    /**
     * @brief canonical matrix
     * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
     * @param i row index of `1`
     * @param j column index of `1`
     * @returns value of canonical matrix
     */
    static e(i: number, j: number) {
        const row = new Vector3(j === 0 ? 1 : 0, j === 1 ? 1 : 0, j === 2 ? 1 : 0);
        const can = Matrix3.zeros;

        can.x = i == 0 ? row : can.x;
        can.y = i == 1 ? row : can.y;
        can.z = i == 2 ? row : can.z;

        return can;
    }

    /**
     * @brief rotation matrix of axis (`0`, `ex`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     * @returns value of rotation matrix for specified angle
     */
    static rotX(theta: number, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            1, 0, 0,
            0, cos(theta), -sin(theta),
            0, sin(theta), cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ey`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     * @returns value of rotation matrix for specified angle
     */
    static rotY(theta: number, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            cos(theta), 0, sin(theta),
            0, 1, 0,
            -sin(theta), 0, cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ez`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     * @returns value of rotation matrix for specified angle
     */
    static rotZ(theta: number, cos = Math.cos, sin = Math.sin) {
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
     * @param u axis of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @returns function that generates rotation `Matrix3` for given angle
     */
    static makeRot(u: Vector3, cos = Math.cos, sin = Math.sin) {
        return (theta: number) => {
            const k = 1 - cos(theta), c = cos(theta), s = sin(theta);
            return new Matrix3(
                k * u.x ** 2 + c, k * u.x * u.y - u.z * s, k * u.x * u.z + u.y * s,
                k * u.x * u.y + u.z * s, k * u.y ** 2 + c, k * u.y * u.z - u.x * s,
                k * u.x * u.z - u.y * s, k * u.y * u.z + u.x * s, k * u.z ** 2 + c
            );
        }
    }

    /**
     * @brief affine transformation of the vector
     * @param m matrix of the transformation
     * @param v vector of the transformation
     * @returns function that computes affine transform a given `Vector3`
     */
    static makeAffine(m: Matrix3, v: Vector3) {
        return (u: Vector3) => m.map(u).add(v);
    }

    /**
     * @brief tensor product of two vectors
     * @details Tensor product is the matrix obtained from two vectors such that `m.i.j = u.i * v.j`.
     * @param u first vector to transform
     * @param v second vector to transform
     * @returns value of the tensor product
     */
    static tens(u: Vector3, v?: Vector3) {
        const right = v || u;
        return new Matrix3(
            u.x * right.x, u.x * right.y, u.x * right.z,
            u.y * right.x, u.y * right.y, u.y * right.z,
            u.z * right.x, u.z * right.y, u.z * right.z,
        );
    }

    /**
     * @brief creates a matrix with given 2D array
     *  @details The order of the rows in matrix is the same as in `arr` array
     * @param arr bi-dimensional array containing rows of the matrix
     * @returns new instance of matrix
     */
    static from2D(arr: number[][]) {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /**
     * @brief creates a matrix with given 1D array
     * @details The order of the rows in matrix is the same as in `arr` array
     * @param arr array containing the components of the matrix ordered as rows
     * @returns new instance of matrix
     */
    static from1D(arr: number[]) {
        return new Matrix3(
            arr[0], arr[1], arr[2],
            arr[3], arr[4], arr[5],
            arr[6], arr[7], arr[8]);
    }
}
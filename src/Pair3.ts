import {Vector3} from "./Vector3";
import {Matrix3} from "./Matrix3";

/**
 * @brief couple of points
 * @details `Pair3` class represents a pair of vector, that are the absolute positions of an _observer_ and a _mobile_.
 *
 * - Perform **geometrical transformation** on the segment joining the two points.
 *
 * - Manipulate **relative coordinates** of the mobile.
 */

export class Pair3 {

    /** absolute coordinates the observer **/
    origin: Vector3;

    /** absolute coordinates of the mobile **/
    position: Vector3;

    constructor(origin = Vector3.zeros, position = Vector3.zeros) {
        this.origin = origin.copy();
        this.position = position.copy();
    }

    /** length of the segment joining the observer and mobile **/
    get length() {
        return this.position.dist(this.origin);
    }

    set length(len) {
        this.relative = this.length > 0 ? this.relative.mul(len / this.length) : Vector3.zeros;
    }

    /** coordinates of the mobile relative to the observer **/
    get relative() {
        return this.position.subc(this.origin);
    }

    set relative(rel) {
        this.position = rel.addc(this.origin);
    }

    /**
     * @brief translation a point pair
     * @param u translation vector
     * @returns reference to `this`
     */
    translate(u: Vector3) {
        this.origin.add(u);
        this.position.add(u);
        return this;
    }

    /**
     * @brief homothetic transformation of a point pair
     * @details Scalar multiplication of the of the two points by the ratio.
     * @param s ratio of transformation
     * @returns reference to `this`
     */
    homothetic(s: number) {
        this.origin.mul(s);
        this.position.mul(s);
        return this;
    }

    /**
     * @brief matrix transformation of the point pair
     * @param m transformation matrix
     * @returns reference to `this`
     */
    transform(m: Matrix3) {
        m.map(this.origin);
        m.map(this.position);
        return this;
    }

    /**
     * @brief affine transformation of the point pair
     * @param m transformation matrix
     * @param v translation vector
     * @returns reference to `this`
     */
    affine(m: Matrix3, v: Vector3) {
        const aff = Matrix3.makeAffine(m, v);
        this.origin = aff(this.origin);
        this.position = aff(this.position);
        return this;
    }

    copy() {
        return new Pair3(this.origin, this.position);
    }

    /**
     * @brief equality between two point pairs
     * @details Verifies if relatives position of mobile are equal.
     * @param om other point pair
     * @return `true` if the point pairs are equal
     */
    isEqual(om: Pair3) {
        return this.relative.isEqual(om.relative);
    }

    isZero() {
        return this.origin.isEqual(this.position);
    }

    toString() {
        return `origin ${this.origin.toString()}\t vector ${this.position.toString()}`;
    }

    /**
     * @brief point pair of length `0`
     * @details The observer can be located everywhere.
     * @param u absolution position of both the observer and mobile
     * @returns new instance of point pair
     */
    static zeros(u = Vector3.zeros) {
        return new Pair3(u, u);
    }

    /**
     * @brief point pair by providing mobile's position only
     * @details Observer's position is set to zero.
     * @param u absolute position of the mobile
     * @returns new instance of point pair
     */
    static vect(u: Vector3) {
        return new Pair3(Vector3.zeros, u);
    }
}
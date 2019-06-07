if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Matrix3 = require("./Matrix3.js");
}

/**
 * @class PointPair
 * @author samiBendou
 * @brief couple of points
 * @details `PointPair` class represents a pair of point, the _observer_ and the _mobile_.
 *
 * Construct a point pair by giving position of the observer and the mobile as `Vector3`.
 *
 * #### Features
 *
 * - Perform **geometrical transformation** on the segment joining the two points.
 *
 * - Manipulate **relative coordinates** of the mobile.
 *
 * @property {Vector3} vector absolute coordinates of the mobile
 * @property {Vector3} origin absolute coordinates the observer
 * @property relative {Vector3} relative coordinates of the mobile
 * @property length {number} length distance between the mobile and the observer
 */

class PointPair {

    constructor(origin = Vector3.zeros, vector = Vector3.zeros) {
        this.origin = origin.copy();
        this.vector = vector.copy();
    }

    get length() {
        return this.vector.dist(this.origin);
    }

    set length(len) {
        this.relative = this.length > 0 ? this.relative.mul(len / this.length) : Vector3.zeros;
    }

    get relative() {
        return this.vector.subc(this.origin);
    }

    set relative(rel) {
        this.vector = rel.addc(this.origin);
    }

    /**
     * @brief translation a point pair
     * @param vector {Vector3} translation vector
     * @returns {PointPair} reference to `this`
     */
    translate(vector) {
        this.origin.add(vector);
        this.vector.add(vector);
        return this;
    }

    /**
     * @brief homothetic transformation of a point pair
     * @details Scalar multiplication of the of the two points by the ratio.
     * @param scalar {number} ratio of transformation
     * @returns {PointPair} reference to `this`
     */
    homothetic(scalar) {
        this.origin.mul(scalar);
        this.vector.mul(scalar);
        return this;
    }

    /**
     * @brief matrix transformation of the point pair
     * @param matrix {Matrix3} transformation matrix
     * @returns {PointPair} reference to `this`
     */
    transform(matrix) {
        matrix.map(this.origin);
        matrix.map(this.vector);
        return this;
    }

    /**
     * @brief affine transformation of the point pair
     * @param matrix {Matrix3} transformation matrix
     * @param vector {Vector3} translation vector
     * @returns {PointPair} reference to `this`
     */
    affine(matrix, vector) {
        let aff = Matrix3.makeAffine(matrix, vector);
        this.origin = aff(this.origin);
        this.vector = aff(this.vector);
        return this;
    }

    copy() {
        return new PointPair(this.origin, this.vector);
    }

    /**
     * @brief equality between two point pairs
     * @details Verifies if relatives position of mobile are equal.
     * @param om {PointPair} other point pair
     * @return {boolean} `true` if the point pairs are equal
     */
    isEqual(om) {
        return this.relative.isEqual(om.relative);
    }

    isZero() {
        return this.origin.isEqual(this.vector);
    }

    toString() {
        return `origin ${this.origin.toString()}\t vector ${this.vector.toString()}`;
    }

    /**
     * @brief point pair of length `0`
     * @details The observer can be located everywhere.
     * @param u {Vector3} absolution position of both the observer and mobile
     * @returns {PointPair} new instance of point pair
     */
    static zeros(u = Vector3.zeros) {
        return new PointPair(u, u);
    }

    /**
     * @brief point pair by providing mobile's position only
     * @details Observer's position is set to zero.
     * @param u {Vector3} absolute position of the mobile
     * @returns {PointPair} new instance of point pair
     */
    static vect(u) {
        return new PointPair(Vector3.zeros, u);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = PointPair;
else
    window.PointPair = PointPair;
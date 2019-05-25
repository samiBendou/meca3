if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Matrix3 = require("./Matrix3.js");
}

/**
 * @class PointPair
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Represents a couple of points
 * @details A PointPair can be represented as a pair of points, the observer and the mobile.
 * Each point is represented by a Vector3.
 *
 * The origin object is the absolute position of the observer of the trajectory.
 * The vector object is the absolute position of the mobile of the trajectory.
 *
 * PointPair class is designed to perform geometrical transformation on the segment joining the two points.
 *
 * PointPair class allows to manipulate relative coordinates of the mobile using the .relative property.
 *
 * @property {Vector3} relative relative coordinates of the mobile
 * @property {number} length distance between the two points.
 * When the length is changed, only the mobile position is changed.
 */
class PointPair {

    /**
     * @brief Construct a PointPair with given mobile and origin
     * @param {Vector3} vector absolute coordinates of the mobile.
     * @param {Vector3} origin absolute coordinates the origin point.
     */
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
        return this.vector.copy().sub(this.origin);
    }

    set relative(rel) {
        this.vector = rel.copy().add(this.origin);
    }

    /**
     * @brief Translate a point pair
     * @param vector {Vector3} translation vector
     * @returns {PointPair} reference to this
     */
    translate(vector) {
        this.origin.add(vector);
        this.vector.add(vector);
        return this;
    }

    /**
     * @brief Homothetic transformation of the point pair
     * @details a homothetic transformation is a scalar multiplication of the
     * of the two points contained in the point pair
     * @param scalar {Vector3} translation vector
     * @returns {PointPair} reference to this
     */
    homothetic(scalar) {
        this.origin.mul(scalar);
        this.vector.mul(scalar);
        return this;
    }

    /**
     * @brief Matrix transformation of the point pair
     * @param matrix {Matrix3}  transformation matrix
     * @returns {PointPair} reference to this
     */
    transform(matrix) {
        this.origin = matrix.map(this.origin);
        this.vector = matrix.map(this.vector);
        return this;
    }

    /**
     * @brief Affine transfoËrmation of the point pair
     * @param matrix {Matrix3} transformation matrix
     * @param vector {Matrix3} translation vector
     * @returns {PointPair} reference to this
     */
    affine(matrix, vector) {
        let aff = Matrix3.makeAffine(matrix, vector);
        this.origin = aff(this.origin);
        this.vector = aff(this.vector);
        return this;
    }

    copy() {
        return new PointPair(this.origin.copy(), this.vector.copy());
    }

    isEqual(om) {
        return this.relative.isEqual(om.relative);
    }

    isZero() {
        return this.origin.isEqual(this.vector);
    }

    toString() {
        return "O" + this.origin.toString() + ", " + "M" + this.vector.toString();
    }

    /**
     * @brief point pair of length 0
     * @param u absolution position of the point pair
     * @returns {PointPair} newly created point pair
     */
    static zeros(u = Vector3.zeros) {
        return new PointPair(u, u);
    }

    /**
     * @brief point pair by providing the mobile only
     * @details origin is set to 0. The point pair represents only a vector
     * @param u {Vector3} absolute position of the mobile
     * @returns {PointPair} newly created point pair
     */
    static vect(u) {
        return new PointPair(Vector3.zeros, u);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = PointPair;
else
    window.PointPair = PointPair;
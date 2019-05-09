const Vector3 = require("./Vector3.mjs");

/**
 *
 * @type {module.PointPair}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Represents a couple of points
 * @details In memory, the points are represented as vectors. this.vector denotes the absolute coordinates
 *          of the extremity point. this.origin denotes the absolute coordinates the origin point.
 *
 *          This class is designed to perform geometrical transformation on the segment joining the two
 *          points
 *
 *          A PointPair can also be represented as a pair observer (origin) and mobile (vector). Therefore
 *          it offers relative coordinates computation features.
 */

module.exports = class PointPair {

    constructor(origin = Vector3.zeros, vector = Vector3.zeros) {
        this.origin = origin.copy();
        this.vector = vector.copy();
    }

    get length() {
        return  this.vector.dist(this.origin);
    }

    set length(len) {
        this.relative = this.length > 0 ?this.relative.mul(len / this.length) : Vector3.zeros;
    } 

    get relative() {
        return this.vector.copy().sub(this.origin);
    }

    set relative(rel) {
        this.vector = rel.copy().add(this.origin);
    }

    translate(vector) {
        this.origin.add(vector);
        this.vector.add(vector);
        return this;
    }

    homothetic(scalar) {
        this.origin.mul(scalar);
        this.vector.mul(scalar);
        return this;
    }

    transform(matrix) {
        this.origin = matrix.map(this.origin);
        this.vector = matrix.map(this.vector);
        return this;
    }

    affine(matrix, vector) {
        this.origin = this.origin.aff(matrix, vector);
        this.vector = this.vector.aff(matrix, vector);
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

    static zeros(u = Vector3.zeros) { return new PointPair(u, u)};
};
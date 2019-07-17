if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PointPair = require("./PointPair.js");
    Vector3 = require("./Vector3.js");
}

/**
 * @class Trajectory
 * @author samiBendou
 * @brief trajectory of a mobile
 * @details `Trajectory` class represents the trajectory of a _mobile_ from the point of view of a moving _observer_.
 *
 * Construct a trajectory by giving an array of _sample_ `PointPair`representing the successive position of the mobile
 * over time.
 *
 * You can also specify the time step between each successive positions.
 *
 * Will we use the notion of _curvilinear abscissa_ defined as real number `s` which can evolve between `0` and `1`
 *
 * #### Features
 *
 * - **Continuous representation** of the trajectory at any given real time by linear interpolation.
 *
 * - **Variable** and **constant time step** modes
 *
 * - Extend all **geometrical transformation** of `PointPair`
 *
 * @property first {PointPair} initial position of the mobile
 * @property last {PointPair} final position of the mobile
 * @property nexto {PointPair} position of the mobile next to last
 * @property length {number} total length of the trajectory
 * @property origins {Array} array of `Vector3` containing all the successive observer positions
 * @property absolute {Array} array of `Vector3` containing all the successive mobile absolute positions
 * @property relative {Array} array of `Vector3` containing all the successive mobile relative positions
 */
class Trajectory {

    constructor(pairs = [], dt = 1) {
        this.pairs = pairs;
        this.dt = (typeof dt == "number") ? Array(Math.max(pairs.length - 1, 0)).fill(dt) : dt;
    }

    get first() {
        return this.pairs[0];
    }

    set first(newFirst) {
        this.pairs[0] = newFirst;
    }

    get last() {
        return this.pairs[this.pairs.length - 1];
    }

    set last(newLast) {
        this.pairs[this.pairs.length - 1] = newLast;
    }

    get nexto() {
        return this.pairs[this.pairs.length - 2];
    }


    set nexto(newLast) {
        this.pairs[this.pairs.length - 2] = newLast;
    }

    get length() {
        let length = 0;
        for (let i = 1; i < this.pairs.length; i++) {
            length += this.pairs[i].relative.dist(this.pairs[i - 1].relative);
        }
        return length;
    }

    get origin() {
        return this.pairs.map((pair) => pair.origin);
    }

    set origin(origins) {
        this.pairs.forEach((pair, index) => {
            pair.origin = origins[index]
        });
    }

    get absolute() {
        return this.pairs.map((pair) => pair.vector);
    }

    set absolute(absolute) {
        this.pairs.forEach((pair, index) => {
            pair.vector = absolute[index]
        });
    }

    get relative() {
        return this.pairs.map((pair) => pair.relative);
    }

    set relative(relative) {
        this.pairs.forEach((pair, index) => {
            pair.relative = relative[index]
        });
    }

    translate(vector) {
        this.pairs.forEach((pair) => {
            pair.translate(vector)
        });
        return this;
    }

    homothetic(scalar) {
        this.pairs.forEach((pair) => {
            pair.homothetic(scalar)
        });
        return this;
    }

    transform(matrix) {
        this.pairs.forEach((pair) => {
            pair.transform(matrix)
        });
        return this;
    }

    affine(matrix, vector) {
        this.pairs.forEach((pair) => {
            pair.affine(matrix, vector)
        });
        return this;
    }

    /**
     * @brief position at curvilinear abscissa
     * @param s {number} curvilinear abscissa
     * @returns {PointPair} value of position at curvilinear abscissa
     */
    at(s) {
        let scale = s * (this.pairs.length - 1);
        let s0 = Math.floor(scale), s1 = (s0 + 1);
        let x0 = this.get(s0).copy(), x1 = this.get(s1).copy();
        return new PointPair(x1.origin.sub(x0.origin).mul(scale - s0).add(x0.origin),
            x1.vector.sub(x0.vector).mul(scale - s0).add(x0.vector));
    }

    /**
     * @brief duration at curvilinear abscissa
     * @details Time elapsed since the beginning of the movement.
     * @param s {number} curvilinear abscissa
     * @returns {number} value of duration at curvilinear abscissa
     */
    t(s) {
        let scale = s * (this.pairs.length - 1);
        let s0 = Math.floor(scale);
        let t = this.duration(s0);
        return s0 < this.dt.length ? t + (scale - s0) * this.dt[s0] : t;
    }

    /**
     * @brief position at integer index
     * @param i {number} number of samples to count
     * @returns {PointPair} position at index `i`
     */
    get(i) {
        return this.pairs[i];
    }

    /**
     * @brief duration at integer index
     * @details Time elapsed since the beginning of the movement.
     * @param i {number=} number of samples to count
     * @returns {number} value of duration at index `i`
     */
    duration(i = this.dt.length) {
        return +(this.dt.slice(0, i).reduce((acc, dt) => acc + dt, 0));
    }

    isEqual(trajectory) {
        if (trajectory.pairs.length !== this.pairs.length)
            return false;
        return this.pairs.reduce((acc, pair, index) => acc && pair.isEqual(trajectory.pairs[index]), true);
    }

    isZero() {
        return this.length < Number.EPSILON;
    }

    /**
     * @brief add a new position to the trajectory
     * @details If you let `dt` undefined, then the method will take the last added step if it exists.
     * @param pair {PointPair} position of the mobile
     * @param dt {number=} time step elapsed since `last` position
     * @returns {Trajectory} reference to `this`
     */
    add(pair, dt) {
        this.dt.push(dt || this.dt[this.dt.length - 1] || 1);
        this.pairs.push(pair);
        return this;
    }

    /**
     * @brief clears the trajectory
     * @details Removes all pairs and steps.
     * @returns {Trajectory} reference to `this`
     */
    clear() {
        this.pairs = [];
        this.dt = [];
        return this;
    }

    toString() {
        return this.pairs.reduce((acc, pair, index) => acc + `(${index}) ${pair.toString()}\n`, "");
    }

    copy() {
        return new Trajectory(this.pairs.slice().map((pair) => pair.copy()), this.dt.slice());
    }

    /**
     * @brief generates an immobile trajectory
     * @details Observer and mobile positions are equal
     * @param u {Vector3}
     * @param size {number} number of elements in trajectory
     * @param dt {Array|number=} time step between each position
     * @returns {Trajectory} new instance of trajectory
     */
    static zeros(u, size, dt) {
        return new Trajectory(Array(size).fill(PointPair.zeros(u)), dt);
    }

    /**
     * @brief trajectory from array of position vectors
     * @details The observer is considered as immobile.
     * @param vectors {Array} successive absolute positions of the mobile as `Vector3`
     * @param dt {Array|number=} time step between each position
     * @param origin {Vector3} observer's position
     * @returns {Trajectory} new instance of trajectory
     */
    static discrete(vectors, dt = 1, origin = Vector3.zeros) {
        return new Trajectory(vectors.map((u) => new PointPair(origin, u)), dt);
    }

    /**
     * @brief linear trajectory
     * @details Computes a linear trajectory starting from the given `origin` with director coefficient `v`.
     * The observer is considered as immobile
     * @param count {Number} number of samples
     * @param dt {number=} sampling step
     * @param v {Vector3} director coefficient
     * @param origin {Vector3} observer's position
     * @return {Trajectory} value of linear trajectory
     */
    static linear(count, dt = 1, v = Vector3.ex, origin = Vector3.zeros) {
        let vectors = new Array(count);
        for (let i = 0; i < count; i++) {
            vectors[i] = v.mulc(dt * i).add(origin);
        }
        return Trajectory.discrete(vectors, dt, origin);
    }

    /**
     * @brief trajectory with given polar metric
     * @details The polar metric is set by giving `cos` and `sin` function. An appropriated rotation `Matrix3` is
     * then created.
     *
     * The trajectory is computed by performing successive infinitesimal rotations of a unit vector around the given `axis`.
     * Then the positions are scaled and translate so the norm of the unit vector is multiplied by `a` and the trajectory
     * has the right origin..
     * @param dt {number=} sampling step
     * @param cos {function(number):number=} `x` polar metric of the rotation
     * @param sin {function(number):number=} `y` polar metric of the rotation
     * @param axis {Vector3} axis of rotation
     * @param origin {Vector3} origin of the circle
     * @return {Trajectory} value of circular trajectory
     */
    static rotational(dt = 1, cos = Math.cos, sin = Math.sin, axis = Vector3.ez, origin = Vector3.zeros) {
        let vectors = [];
        let ez = Vector3.ez;
        let rot = Matrix3.makeRot(axis, cos, sin);
        let position = axis.isEqual(ez) ? Vector3.ex : ez.crossc(axis).div(ez.sin(axis) * axis.r);

        for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI * dt) {
            vectors.push(rot(theta).mapc(position).add(origin));
        }
        return Trajectory.discrete(vectors, dt, origin);
    }

    /**
     * @brief elliptic trajectory
     * @details The observer is considered as immobile
     * @param dt {number=} sampling step
     * @param a {number} major axis
     * @param b {number} minor axis
     * @param axis {Vector3} axis of rotation
     * @param origin {Vector3} origin of the circle
     * @return {Trajectory} value of circular trajectory
     */
    static elliptic(dt = 1, a = 1, b = 1, axis = Vector3.ez, origin = Vector3.zeros) {
        let cos = (theta) => a * Math.cos(theta), sin = (theta) => b * Math.sin(theta);
        return Trajectory.rotational(dt, cos, sin, axis, origin);
    }

    /**
     * @brief circular trajectory
     * @details The observer is considered as immobile
     * @param dt {number=} sampling step
     * @param radius {number} radius of the circle
     * @param axis {Vector3} axis of rotation
     * @param origin {Vector3} origin of the circle
     * @return {Trajectory} value of circular trajectory
     */
    static circular(dt = 1, radius = 1, axis = Vector3.ez, origin = Vector3.zeros) {
        return Trajectory.elliptic(dt, radius, radius, axis, origin);
    }

    /**
     * @brief hyperbolic trajectory
     * @details The observer is considered as immobile
     * @param dt {number=} sampling step
     * @param a {number} major axis
     * @param b {number} minor axis
     * @param axis {Vector3} axis of rotation
     * @param origin {Vector3} origin of the circle
     * @return {Trajectory} value of circular trajectory
     */
    static hyperbolic(dt = 1, a = 1, b = 1, axis = Vector3.ez, origin = Vector3.zeros) {
        let cos = (theta) => a * Math.cosh(theta), sin = (theta) => b * Math.sinh(theta);
        return Trajectory.rotational(dt, cos, sin, axis, origin);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Trajectory;
else
    window.Trajectory = Trajectory;
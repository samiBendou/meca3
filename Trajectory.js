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
 * Will we use the notion of _curvilinear abscissa_ defined as real number `s` which can evolve between `0` and `N` where
 * `N` is the number of `PointPair` composing the trajectory.
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
 * @property absolute {Array} array of `Vector3` containing all the successive mobile positions
 */
class Trajectory {

    constructor(pairs = [], dt = 1) {
        this.pairs = pairs;
        this.dt = (typeof dt == "number") ? Array(pairs.length).fill(dt) : dt;
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
        return this.pairs.map(function (pair) {
            return pair.origin;
        });
    }

    set origin(origins) {
        this.pairs.forEach(function (pair, index) {
            pair.origin = origins[index];
        });
    }

    get absolute() {
        return this.pairs.map(function (pair) {
            return pair.vector;
        });
    }

    set absolute(absolute) {
        this.pairs.forEach(function (pair, index) {
            pair.vector = absolute[index];
        });
    }

    translate(vector) {
        this.pairs.forEach(function (pair) {
            pair.translate(vector)
        });
        return this;
    }

    homothetic(scalar) {
        this.pairs.forEach(function (pair) {
            pair.homothetic(scalar)
        });
        return this;
    }

    transform(matrix) {
        this.pairs.forEach(function (pair) {
            pair.transform(matrix)
        });
        return this;
    }

    affine(matrix, vector) {
        this.pairs.forEach(function (pair) {
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
        let s0 = Math.floor(s), s1 = (s0 + 1);
        let x0 = this.get(s0).copy(), x1 = this.get(s1).copy();
        return new PointPair(x1.origin.sub(x0.origin).mul(s - s0).add(x0.origin),
            x1.vector.sub(x0.vector).mul(s - s0).add(x0.vector));
    }

    /**
     * @brief duration at curvilinear abscissa
     * @details Time elapsed since the beginning of the movement.
     * @param s {number} curvilinear abscissa
     * @returns {number} value of duration at curvilinear abscissa
     */
    t(s) {
        let s0 = Math.floor(s);
        let t = this.duration(s0);
        return s0 < this.dt.length ? t + (s - s0) * this.dt[s0] : t;
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
    duration(i) {
        i = i === undefined ? this.dt.length : i;
        return Number(this.dt.slice(0, i).reduce(function (prev, curr) {
            return prev += curr
        }, 0));
    }

    isEqual(trajectory) {
        if (trajectory.pairs.size !== this.pairs.size) {
            return false;
        }
        return this.pairs.reduce(function (acc, cur, index) {
            return acc && cur.isEqual(trajectory.pairs[index]);
        }, true);
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
        if (dt !== undefined) {
            this.dt.push(dt);
        } else if (this.dt.length > 0) {
            this.dt.push(this.dt[this.dt.length - 1]);
        } else {
            this.dt.push(1);
        }
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
        let str = "";
        this.pairs.forEach(function (pair) {
            str += pair.toString() + "\n";
        });
        return str;
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
     * @param vectors {Array} successive positions of the mobile as `Vector3`
     * @param dt {Array|number=} time step between each position
     * @param origin {Vector3} observer's position
     * @returns {Trajectory} new instance of trajectory
     */
    static discrete(vectors, dt = 1, origin = Vector3.zeros) {
        let pairs = vectors.map(function (u) {
            return new PointPair(origin, u);
        });
        return new Trajectory(pairs, dt);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Trajectory;
else
    window.Trajectory = Trajectory;
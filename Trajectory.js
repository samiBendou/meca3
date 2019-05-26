if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PointPair = require("./PointPair.js");
    Vector3 = require("./Vector3.js");
}

/**
 * @class Trajectory
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Represents the trajectory of a point pair
 * @details The trajectory is stored into memory as an array of PointPair representing the successive positions
 * of a mobile over time. The value of the array must be chronological ordered.
 *
 * Each value of the array denotes the position of both the mobile and the observer at a given time.
 *
 * Trajectory class is designed to perform continuous representation of a trajectory from a discrete set of
 * positions
 *
 * Trajectory class allows to compute the duration and time along the trajectory
 *
 * You have to provide a time dt for the trajectory in order to compute speed and acceleration.
 * The time dt e be variable but if so you have to precise the value of each time dt in an array.
 *
 * @property {PointPair} first initial position in trajectory
 * @property {PointPair} last last position in trajectory
 * @property {PointPair} nexto position next to last in trajectory
 * @property {number} length total length of the trajectory
 * @property {Array} origins array containing all the origins of the positions in trajectory
 * @property {Array} absolute array containing all the absolute position of the positions in trajectory
 */
class Trajectory {

    /**
     * @brief Construct a trajectory with given
     * @details If the specified dt is a number then the trajectory is constructed with a constant dt
     * @params {Array} pairs Array storing position of the object as a PointPair
     * @params {Array|number} dt array storing the time dt between each position
     *
     */
    constructor(pairs = [], step = 1) {
        let steps = (typeof step == "number") ? Array(pairs.length).fill(step) : step;

        this.pairs = pairs;
        this.steps = steps;
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

    get origins() {
        return this.pairs.map(function (pair) {
            return pair.origin;
        });
    }

    set origins(origins) {
        this.pairs.forEach(function (pair, index) {
            pair.origin = origins[index];
        });
        return this;
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
        return this;
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
     * @brief Get position at real index
     * @details The trajectory is made continuous by using linear interpolation between the point pairs in trajectory.
     * The real index is the curvilinear abscissa.
     * @param s {number} curvilinear abscissa, real between 0 and the number of point pairs in trajectory
     * @returns {PointPair} value of position at parameter s
     */
    at(s) {
        let s0 = Math.floor(s), s1 = (s0 + 1);
        let x0 = this.get(s0).copy(), x1 = this.get(s1).copy();
        return new PointPair(x1.origin.sub(x0.origin).mul(s - s0).add(x0.origin),
            x1.vector.sub(x0.vector).mul(s - s0).add(x0.vector));
    }

    /**
     * @brief Get duration at real index
     * @details The time is made continuous by using linear interpolation between the steps in trajectory.
     * The real index is the curvilinear abscissa.
     * @param s {number} curvilinear abscissa, real between 0 and the number of point pairs in trajectory
     * @returns {number} value of duration at parameter s
     */
    t(s) {
        let s0 = Math.floor(s);
        let t = this.duration(s0);
        return s0 < this.steps.length ? t + (s - s0) * this.steps[s0] : t;
    }

    /**
     * @brief Get duration at integer index
     * @details The duration is the partial sum of the steps
     * @param i {number} index of point pair
     * @returns {number} value of duration at index i
     */
    duration(i) {
        i = i === undefined ? this.steps.length : i;
        return this.steps.slice(0, i).reduce(function (prev, curr) {
            return prev += curr
        }, 0);
    }

    /**
     * @brief Get position at integer index
     * @param i {number} index of point pair
     * @returns {PointPair} position at index i
     */
    get(i) {
        return this.pairs[i];
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
     * @brief Add a new point pair to the trajectory
     * @param pair {PointPair} position point pair
     * @param step {number|undefined} time dt elapsed between last position
     * @returns {Trajectory} reference to this
     */
    add(pair, step) {
        if (step !== undefined) {
            this.steps.push(step);
        } else if (this.steps.length > 0) {
            this.steps.push(this.steps[this.steps.length - 1]);
        } else {
            return this;
        }
        this.pairs.push(pair.copy());

        return this;
    }

    /**
     * @brief Clears the trajectory
     * @details Removes all pairs at steps
     * @returns {Trajectory} reference to this
     */
    clear() {
        this.pairs = [];
        this.steps = [];
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
     * @brief Constant origin trajectory from array of position vectors
     * @param vectors {Array} storing position of the object as a Vector3
     * @param step {Array|number} time dt between each position
     * @param origin {Vector3} origin to use all along the trajectory
     * @returns {Trajectory} newly created trajectory
     */
    static discrete(vectors, step = 1, origin = Vector3.zeros) {
        let pairs = vectors.map(function (u) {
            return new PointPair(origin, u);
        });
        return new Trajectory(pairs, step);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Trajectory;
else
    window.Trajectory = Trajectory;
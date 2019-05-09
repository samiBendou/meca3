const PointPair = require("./PointPair.mjs");
const Vector3 = require("./Vector3.mjs");

/**
 *
 * @type {module.Trajectory}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Represents a discrete trajectory
 * @details The trajectory is stored into memory as an array of PointPair.
 *
 *          Each value of the array denotes the position of both the object observed and the
 *          observer of the object at a given time, the value of the array must be chronological ordered.
 *
 *          The origin of each PointPair is the position of the observer of the trajectory in absolute coordinates.
 *
 *          This module is designed to perform relative cinematic computation (position, speed, acceleration), in order
 *          to follow the state of a moving object
 */

module.exports = class Trajectory {

    constructor(pairs = [], steps = []) {
        this.pairs = pairs;
        this.steps = steps;
    }

    get length() {
        var steps = this.steps;
        return this.speeds.reduce(function (prev, cur, index) {
            return prev + cur.r * steps[index];
        }, 0.0);
    }

    get pos() {
        return this.pairs.map(function (pair) { return pair.relative });
    }

    get speeds() {
        return Vector3.der(this.pos, this.steps);
    }

    get accels() {
        return Vector3.der(this.speeds, this.steps);
    }

    get origins() {
        return this.pairs.map(function(pair) {return pair.origin;});
    }

    set origins(origins) {
        this.pairs.forEach(function (pair, index) {pair.origin = origins[index];});
        return this;
    }

    translate(vector) {
        this.pairs.forEach(function (pair) { pair.translate(vector) });
        return this;
    }

    homothety(scalar) {
        this.pairs.forEach(function (pair) { pair.homothetic(scalar) });
        return this;
    }

    transform(matrix) {
        this.pairs.forEach(function (pair) { pair.transform(matrix) });
        return this;
    }

    affine(matrix, vector) {
        this.pairs.forEach(function (pair) { pair.affine(matrix, vector) });
        return this;
    }

    at(t) {
        return this.pairs[t];
    }

    isEqual(trajectory) {
        if(trajectory.pairs.size !== this.pairs.size) {
            return false;
        }
        return this.pairs.reduce(function(acc, cur, index) {
            return acc && cur.isEqual(trajectory.pairs[index]);
        }, true);
    }

    isZero() {
        return this.length < Number.EPSILON;
    }

    add(pair, step) {
        if (step != undefined) {
            this.steps.push(step);
        } else if (this.steps.length > 0) {
            this.steps.push(this.steps[this.steps.length - 1]);
        } else {
            return this;
        }
        this.pairs.push(pair.copy());

        return this;
    }

    clear() {
        this.pairs = [];
        this.steps = [];
        return this;
    }

    toString() {
        var str = "";
        this.pairs.forEach(function (pair) {
            str += pair.toString() + "\n";
        });
        return str;
    }

    static cstStep(pairs, step) {
        var steps = Array(pairs.length).map(function () { return step });
        return new Trajectory(pairs, steps);
    }

    static fromVect(vectors, origin, steps) {
        var steps = (typeof steps == "number") ? Array(vectors.length).map(function () { return steps }) : steps;
        var pairs = vectors.map(function (u) {
            return new PointPair(origin, u);
        });

        return new Trajectory(pairs, steps);
    }
};
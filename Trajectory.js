/**
 *
 * @class {module.Trajectory}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Represents a discrete trajectory
 * @details The trajectory is stored into memory as an array of PointPair representing the successive positions
 *          of a mobile over time. The value of the array must be chronological ordered.
 *
 *          Each value of the array denotes the position of both the mobile and the observer at a given time.
 *          The origin of each PointPair is the position of the observer of the trajectory in absolute coordinates.
 *
 *          This module is designed to perform relative cinematic computation (position, speed, acceleration), in order
 *          to follow the state of a moving object.
 *
 *          You have to provide a time step for the trajectory in order to compute speed and acceleration.
 *          The time step can be variable but if so you have to precise the value of each time step in an array.
 *
 * @property {Array} pairs Array storing position of the object as a PointPair
 * @property {Array} steps Array storing the time step between each position
 */

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PointPair = require("./PointPair.js");
    Vector3 = require("./Vector3.js");
}

class Trajectory {

    constructor(pairs = [], steps = []) {
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
        var steps = this.steps;
        return this.speeds.reduce(function (prev, cur, index) {
            return prev + cur.r * steps[index];
        }, 0.0);
    }

    get pos() {
        return this.pairs.map(function (pair) {
            return pair.relative
        });
    }

    get speeds() {
        return Vector3.der(this.pos, this.steps);
    }

    get accels() {
        return Vector3.der(this.speeds, this.steps);
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

    translate(vector) {
        this.pairs.forEach(function (pair) {
            pair.translate(vector)
        });
        return this;
    }

    homothety(scalar) {
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

    at(s) {
        let s0 = Math.floor(s), s1 = (s0 + 1);
        let x0 = this.get(s0).copy(), x1 = this.get(s1).copy();
        return new PointPair(   x1.origin.sub(x0.origin).mul(s - s0).add(x0.origin),
                                x1.vector.sub(x0.vector).mul(s - s0).add(x0.vector));
    }

    t(s) {
        let s0 = Math.floor(s);
        let t = this.duration(s0);
        return s0 < this.steps.length ? t + (s - s0) * this.steps[s0] : t;
    }

    duration(i) {
        i = i === undefined ? this.steps.length : i;
        return this.steps.slice(0, i).reduce(function(prev, curr) {return prev += curr}, 0);
    }

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
        var steps = Array(pairs.length).fill(step);
        return new Trajectory(pairs, steps);
    }

    static fromVect(vectors, origin, step) {
        var steps = (typeof step == "number") ? Array(vectors.length).fill(step) : step;
        var pairs = vectors.map(function (u) {
            return new PointPair(origin, u);
        });

        return new Trajectory(pairs, steps);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Trajectory;
else
    window.Trajectory = Trajectory;
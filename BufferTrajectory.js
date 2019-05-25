/**
 * @class BufferTrajectory
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Fixed size buffer for Trajectory class
 * @details This trajectory behaves the same as Trajectory class for the most expect that
 *          it stores a fixed number of PointPairs in the pairs array.
 *
 *          When adding a new PointPair, if there is not enough space in the array the point is added at the beginning
 *          of the array and old values are replaced progressively.
 *
 * @property {Number} addIndex Index where to put new values of position. Eg. If the buffer
 *           is of size 3 and only 2 elements have been added addIndex is equal 2.
 */

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PointPair = require("./PointPair.js");
    Trajectory = require("./Trajectory.js");
}


class BufferTrajectory extends Trajectory {

    /**
     * @brief Construct buffer trajectory using buffer trajectory
     * @details bufferize method is used
     * @param size {Number} size Number of samples in the buffer
     * @param trajectory {Trajectory} trajectory to bufferize
     */
    constructor(size, trajectory) {
        super(new Array(size), new Array(size));
        this.size = size;
        this.addIndex = 0;
        if (trajectory !== undefined) {
            this.bufferize(trajectory);
        }
    }

    get first() {
        return this.pairs[this.addIndex];
    }

    set first(newFirst) {
        this.pairs[this.addIndex] = newFirst;
    }

    get last() {
        return this.pairs[this.addIndex > 0 ? this.addIndex - 1 : this.pairs.length - 1];
    }
    set last(newLast) {
        this.pairs[this.addIndex > 0 ? this.addIndex - 1 : this.pairs.length - 1] = newLast;
    }

    get nexto() {
        return this.pairs[this.addIndex > 1 ? this.addIndex - 2 : this.pairs.length - 2 + this.addIndex];
    }

    set nexto(newNexto) {
        this.pairs[this.addIndex > 1 ? this.addIndex - 2 : this.pairs.length - 2 + this.addIndex] = newNexto;
    }

    /**
     * @brief Initialize a buffer trajectory with a trajectory
     * @details The behavior is the following :
     *          - If buffer's size is greater then trajectory size, than the whole
     *          trajectory is added at the beginning of the buffer and the rest is filled with zeros.
     *
     *          - If buffer's size is smaller then trajectory size, than the trajectory is
     *          truncated and only the last elements of the trajectory are added.
     * @param trajectory {Trajectory} trajectory to bufferize
     * @return {BufferTrajectory} reference to this
     */
    bufferize(trajectory) {
        let delta = (trajectory.pairs.length - this.size);
        let end = delta >= 0 ? this.size : trajectory.pairs.length;

        for (let i = 0; i < end; i++) {
            let index = delta >= 0 ? (i + delta) : i;
            this.pairs[i] = trajectory.pairs[index].copy();
            this.steps[i] = trajectory.steps[index];
        }

        for (let i = end; i < this.size; i++) {
            this.pairs[i] = PointPair.zeros();
            this.steps[i] = 0.0;
        }
        this.addIndex = delta >= 0 ? 0 : trajectory.pairs.length;
        return this;
    }

    t(s) {
        let s0 = Math.floor((s + this.addIndex) % this.size);
        let t = this.duration(Math.floor(s));
        return s0 < this.steps.length ? t + (s - Math.floor(s)) * this.steps[s0] : t;
    }

    duration(i) {
        if(i === undefined) {
            return this.steps.reduce(function(prev, curr) {return prev += curr}, 0);
        } else if(i + this.addIndex < this.steps.length) {
            return this.steps.slice(this.addIndex, i + this.addIndex).reduce(function(prev, curr) {return prev += curr}, 0);
        } else {
            let end = (i + this.addIndex) % this.size;
            let sum0 = this.steps.slice(0, end).reduce(function(prev, curr) {return prev += curr}, 0);
            return sum0 + this.steps.slice(this.addIndex, this.size).reduce(function(prev, curr) {return prev += curr}, 0);
        }
    }

    get(i) {
        return this.pairs[(i + this.addIndex) % this.size];
    }

    /**
     * @brief Add a new point pair to the trajectory
     * @details The point pair moves the add index such that when it's greater than the size of the buffer,
     *          it is set to zero. addIndex is incremented each time this function is called.
     * @param pair {PointPair} position point pair
     * @param step {number|undefined} time step elapsed between last position
     * @returns {Trajectory} reference to this
     */
    add(pair, step) {
        if (step !== undefined) {
            this.steps[this.addIndex] = step;
        } else if (this.steps.length > 0) {
            this.steps[this.addIndex] = this.steps[this.steps.length - 1];
        } else {
            return this;
        }
        this.pairs[this.addIndex] = pair;
        this.addIndex = (this.addIndex + 1) % this.size;

        return this;
    }

    clear() {
        this.pairs = new Array(this.size);
        this.steps = new Array(this.steps);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = BufferTrajectory;
else
    window.BufferTrajectory = BufferTrajectory;
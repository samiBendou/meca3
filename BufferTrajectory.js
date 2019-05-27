/**
 * @class BufferTrajectory
 * @author samiBendou
 * @brief fixed size trajectory
 * @details `BufferTrajectory` class inherit from `Trajectory` class.
 *
 * Construct a `BufferTrajectory` by giving the _size_ of the buffer and a base `Trajectory` object.
 *
 * #### Features
 *
 * - **Fixed size** array to represent trajectory
 *
 * - **Insertion by replacement** when buffer is full
 *
 * - Extends all the features from `Trajectory` class
 *
 * @property size {number} number of elements to store in buffer
 * @property addIndex {number} index where to insert new values of position
 */

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PointPair = require("./PointPair.js");
    Trajectory = require("./Trajectory.js");
}


class BufferTrajectory extends Trajectory {

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
     * @brief initialize a buffer trajectory with a `Trajectory
     * @details This method behaves as follows :
     * - If buffer's size is greater then trajectory size, then the whole
     * trajectory is added at the beginning of the buffer and the rest is filled with zeros.
     *
     * - If buffer's size is smaller then trajectory size, then the trajectory is
     * truncated and only the last elements of the trajectory are added.
     *
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
     * @brief add a new point pair to the trajectory
     * @details `addIndex` is incremented each time a point is added.
     *
     * When `addIndex` is greater than the size of the buffer, it is set to zero.
     *
     * The value contained at `addIndex` is replaced when adding new points.
     *
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
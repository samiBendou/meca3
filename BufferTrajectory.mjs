/**
 *
 * @type {module.Trajectory}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Fixed size buffer for Trajectory class
 * @details This trajectory behaves the same as Trajectory class for the most expect that
 *          it stores a fixed number of PointPairs in the pairs array.
 *
 *          When adding a new PointPair, if there is not enough space in the array the point is added at the beginning
 *          of the array and old values are replaced progressively.

 *          A BufferTrajectory can be initialized with a Trajectory :
 *          - If buffer's size is greater then trajectory size, than the whole
 *          trajectory is added at the beginning of the buffer and the rest is filled with zeros.
 *
 *          - If buffer's size is smaller then trajectory size, than the trajectory is
 *          truncated and only the last elements are taken.
 *
 * @property {Number} size Number of samples in buffer trajectory
 * @property {Number} addIndex Index where to put new values of position. Eg. If the buffer
 * is of size 3 and only 2 elements have been added addIndex is equal 2.
 */


const PointPair = require("./PointPair.mjs");
const Trajectory = require("./Trajectory.mjs");

module.exports = class BufferTrajectory extends Trajectory {
    constructor(size, trajectory) {
        super(new Array(size), new Array(size));
        this.size = size;
        this.addIndex = 0;
        if (trajectory !== undefined) {
            this.bufferize(trajectory);
        }
    }

    bufferize(trajectory) {
        var delta = (trajectory.pairs.length - this.size);
        var end = delta >= 0 ? this.size : trajectory.pairs.length;

        for (var i = 0; i < end; i++) {
            var index = delta >= 0 ? (i + delta) : i;
            this.pairs[i] = trajectory.pairs[index].copy();
            this.steps[i] = trajectory.steps[index];
        }

        for (var i = end; i < this.size; i++) {
            this.pairs[i] = PointPair.zeros();
            this.steps[i] = 0.0;
        }
        this.addIndex = delta >= 0 ? 0 : trajectory.pairs.length;
    }

    at(t) {
        return this.pairs[(t + this.addIndex) % this.size];
    }

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
};
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

    constructor(trajectory, size) {
        size = size || (trajectory === undefined ? 2 : trajectory.pairs.length);
        super((new Array(size)).fill(PointPair.zeros()), new Array(size - 1).fill(1));
        this.size = size;
        this.addIndex = 0;
        if (trajectory !== undefined) {
            this.bufferize(trajectory);
        }
    }

    get first() {
        return this.pairs[this.addIndex] || PointPair.zeros();
    }

    set first(newFirst) {
        this.pairs[this.addIndex] = newFirst;
    }

    get last() {
        return this.pairs[this.lastIndex] || PointPair.zeros();
    }
    set last(newLast) {
        this.pairs[this.lastIndex] = newLast;
    }

    get nexto() {
        let index = this.addIndex > 1 ? this.addIndex - 2 : this.pairs.length - 2 + this.addIndex;
        return this.pairs[index] || PointPair.zeros();
    }

    set nexto(newNexto) {
        this.pairs[this.nextoIndex] = newNexto;
    }

    get lastIndex() {
        return this.addIndex > 0 ? this.addIndex - 1 : this.pairs.length - 1;
    }

    get addStepIndex() {
        return this.addIndex > 0 ? this.addIndex - 1 : this.dt.length - 1;
    }

    get lastStepIndex() {
        return this.addIndex > 1 ? this.addIndex - 2 : this.dt.length - 1;
    }

    get nextoIndex() {
        return this.addIndex > 1 ? this.addIndex - 2 : this.pairs.length - 2 + this.addIndex;
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
     * @return {BufferTrajectory} reference to `this`
     */
    bufferize(trajectory) {
        let delta = (trajectory.pairs.length - this.size);
        let end = delta >= 0 ? this.size : trajectory.pairs.length;

        this.pairs[0] = trajectory.pairs[delta >= 0 ? delta : 0].copy();
        for (let i = 1; i < end; i++) {
            let index = delta >= 0 ? (i + delta) : i;
            this.pairs[i] = trajectory.pairs[index].copy();
            this.dt[i - 1] = trajectory.dt[index - 1];
        }

        for (let i = end; i < this.size; i++) {
            this.pairs[i] = PointPair.zeros();
            this.dt[i - 1] = 0;
        }

        this.addIndex = delta >= 0 ? 0 : trajectory.pairs.length;
        return this;
    }

    t(s) {
        let scale = s * (this.size - 1);
        let s0 = Math.floor((scale + this.addIndex)) % this.size;
        let t = this.duration(Math.floor(scale));
        return s0 < this.dt.length ? t + (scale - Math.floor(scale)) * this.dt[Math.max(s0 - 1, 0)] : t;
    }

    step(s) {
        let scale = s * (this.size - 1);
        let s0 = Math.floor((scale + this.addIndex)) % this.size;
        return this.dt[Math.max(s0 - 1, 0)];
    }

    duration(i) {
        let adder = (acc, dt) => acc + dt;
        if(i === undefined) {
            return this.dt.reduce(adder, 0);
        } else if (i + this.addIndex < this.size) {
            return this.dt.slice(this.addIndex, i + this.addIndex).reduce(adder, 0);
        } else {
            let end = (i + this.addIndex) % this.size;
            return this.dt.slice(0, end).reduce(adder, 0) + this.dt.slice(this.addIndex, this.size).reduce(adder, 0);
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
     * @param dt {number=} time step elapsed between last position
     * @returns {Trajectory} reference to `this`
     */
    add(pair, dt) {
        let index = this.addStepIndex;
        if (dt !== undefined) {
            this.dt[index] = dt;
        } else if (this.dt.length > 1) {
            this.dt[index] = this.dt[this.lastStepIndex];
        } else {
            this.dt[index] = 1;
        }

        this.pairs[this.addIndex] = pair;
        this.addIndex = (this.addIndex + 1) % this.size;
        return this;
    }

    clear() {
        this.pairs = new Array(this.size);
        this.dt = new Array(this.dt);
        return this;
    }

    copy() {
        let copy = new BufferTrajectory(super.copy(), this.size);
        copy.addIndex = this.addIndex;
        return copy;
    }

    static zeros(u, size = 2, dt = 1) {
        return new BufferTrajectory(Trajectory.zeros(u, size, dt));
    }

    /**
     * @brief trajectory from array of position vectors or point pairs
     * @details If `positions` is given as `Array` of `Vector3` then the observer is considered as immobile.
     * If `position` is given as `Array` of `PointPair`, then the observer is mobile and you don't have to specify
     * the parameter `origin`.
     * @param positions {Array} successive positions of the mobile
     * @param dt {Array|number=} time step between each position
     * @param origin {Vector3=} observer's position
     * @returns {Trajectory} new instance of trajectory
     */
    static discrete(positions, dt = 1, origin = Vector3.zeros) {
        let pairs = positions;
        if (positions[0] instanceof Vector3) {
            pairs = positions.map((u) => new PointPair(origin, u));
        }
        return new BufferTrajectory(new Trajectory(pairs, dt));
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = BufferTrajectory;
else
    window.BufferTrajectory = BufferTrajectory;
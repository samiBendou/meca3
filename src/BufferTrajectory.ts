import Pair3 from "./Pair3";
import Trajectory from "./Trajectory";
import Vector3 from "./Vector3";

/**
 *
 * @brief fixed size trajectory
 * @details `BufferTrajectory` is a _fixed size_ `Trajectory` that can be updated.
 *
 * - **Fixed size** array to represent trajectory
 *
 * - **Insertion by replacement** when buffer is full
 *
 * - Extends all the features from `Trajectory` class
 */

export default class BufferTrajectory extends Trajectory {

    private _addIndex: number;

    private _size: number;

    /** Construct a `BufferTrajectory` by giving the size of the buffer and a base `Trajectory` object. **/
    constructor(trajectory: Trajectory, size?: number) {
        super();
        this._size = size || (trajectory !== undefined ? trajectory.pairs.length : 2);
        this._addIndex = 0;
        this.clear();
        if (trajectory !== undefined)
            this.bufferize(trajectory);
    }

    /** number of elements to store in buffer **/
    get size() {
        return this._size;
    }

    set size(newSize) {
        this._addIndex = this._addIndex || newSize - 1;
        this._size = newSize;
    }

    get first() {
        return this.pairs[this._addIndex] || Pair3.zeros();
    }

    set first(newFirst) {
        this.pairs[this._addIndex] = newFirst;
    }

    get last() {
        return this.pairs[this.lastIndex] || Pair3.zeros();
    }

    set last(newLast) {
        this.pairs[this.lastIndex] = newLast;
    }

    get nexto() {
        return this.pairs[this.nextoIndex] || Pair3.zeros();
    }

    set nexto(newNexto) {
        this.pairs[this.nextoIndex] = newNexto;
    }

    /** index where new values of position are inserted **/
    get addIndex() {
        return this._addIndex;
    }

    /** index of last position in trajectory **/
    get lastIndex() {
        return this._addIndex > 0 ? this._addIndex - 1 : this.pairs.length - 1;
    }

    /** index where new values of step are inserted **/
    get addStepIndex() {
        return this._addIndex > 0 ? this._addIndex - 1 : this.dt.length - 1;
    }

    /** index of last step in trajectory **/
    get lastStepIndex() {
        return this._addIndex > 1 ? this._addIndex - 2 : this.dt.length - 1;
    }

    /** index of nexto last position in trajectory **/
    get nextoIndex() {
        return this._addIndex > 1 ? this._addIndex - 2 : this.pairs.length - 2 + this._addIndex;
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
     * @param trajectory trajectory to bufferize
     * @return reference to `this`
     */
    bufferize(trajectory: Trajectory) {
        let delta = (trajectory.pairs.length - this._size);
        let end = delta >= 0 ? this._size : trajectory.pairs.length;

        this.pairs = this.pairs.map((pair, index) =>
            index < end ? trajectory.pairs[delta >= 0 ? (index + delta) : index].copy() : Pair3.zeros()
        );
        this.dt = this.dt.map((dt, index) =>
            index < end ? trajectory.dt[delta >= 0 ? (index + delta) : index] : trajectory.dt[0]
        );
        this._addIndex = delta >= 0 ? 0 : trajectory.pairs.length;

        return this;
    }

    t(s: number) {
        let scale = s * (this._size - 1);
        let s0 = Math.floor((scale + this._addIndex)) % this._size;
        let t = this.duration(Math.floor(scale));
        return s0 < this.dt.length ? t + (scale - Math.floor(scale)) * this.dt[Math.max(s0 - 1, 0)] : t;
    }

    duration(i = this._size) {
        let adder = (acc: number, dt: number) => acc + dt;
        let end = i + this._addIndex;
        let sum = this.dt.slice(this._addIndex, Math.min(this._size, end)).reduce(adder, 0);
        return sum + (end > this._size ? this.dt.slice(0, end % this._size).reduce(adder, 0) : 0);
    }

    get(i: number) {
        return this.pairs[(i + this._addIndex) % this._size];
    }

    /**
     * @brief add a new point pair to the trajectory
     * @details `addIndex` is incremented each time a point is added.
     *
     * When `addIndex` is greater than the size of the buffer, it is set to zero.
     *
     * The value contained at `addIndex` is replaced when adding new points.
     *
     * @param pair position point pair
     * @param dt time step elapsed between last position
     * @returns reference to `this`
     */
    add(pair: Pair3, dt?: number) {
        this.pairs[this._addIndex] = pair;
        this.dt[this.addStepIndex] = dt || this.dt[this.lastStepIndex] || 1;
        this._addIndex = (this._addIndex + 1) % this._size;
        return this;
    }

    clear() {
        this.pairs = new Array(this._size).fill(Pair3.zeros());
        this.dt = new Array(this._size - 1).fill(1);
        this._addIndex = 0;
        return this;
    }

    copy() {
        let copy = new BufferTrajectory(super.copy(), this._size);
        copy._addIndex = this._addIndex;
        return copy;
    }

    static zeros(u: Vector3, size = 2, dt: number[] | number = 1) {
        return new BufferTrajectory(Trajectory.zeros(u, size, dt));
    }

    static discrete(positions: Vector3[], dt: number[] | number = 1, origin = Vector3.zeros) {
        let pairs = positions.map((u: Vector3) => new Pair3(origin, u));
        return new BufferTrajectory(new Trajectory(pairs, dt));
    }
}
import Vector3 from "./Vector3";
import Pair3 from "./Pair3";
import Matrix3 from "./Matrix3";

/**
 * @brief trajectory of a mobile
 * @details `Trajectory` class represents the trajectory of a _mobile_ from the point of view of an _observer_.
 *
 * Construct a trajectory by giving an array of _sample_ `Pair3`representing the successive position of the mobile
 * over time.
 *
 * You can also specify the time step between each successive positions.
 *
 * Will we use the notion of _curvilinear abscissa_ defined as real number `s` which can evolve between `0` and `1`.
 * This evolve along the trajectory such that `s === 0` is the initial point of the trajectory and `s === 1` is the
 * last point of the trajectory.
 *
 * - **Continuous representation** of the trajectory at any given real time by linear interpolation.
 *
 * - **Variable** and **constant time step** modes
 *
 * - Extend all **geometrical transformation** of `Pair3`
 *
 */
export default class Trajectory {

    /** array of successive position of mobile from the point of view of observer **/
    pairs: Pair3[];

    /** array of duration between each successive position. Must be of length  `pairs.length - 1`. **/
    dt: number[];

    constructor(pairs: Pair3[] = [], dt: number[] | number = 1) {
        this.pairs = pairs;
        this.dt = (typeof dt == "number") ? Array(Math.max(pairs.length - 1, 0)).fill(dt) : dt;
    }

    /** initial position of the mobile **/
    get first() {
        return this.pairs[0];
    }

    set first(newFirst) {
        this.pairs[0] = newFirst;
    }

    /** final position of the mobile **/
    get last() {
        return this.pairs[this.pairs.length - 1];
    }

    set last(newLast) {
        this.pairs[this.pairs.length - 1] = newLast;
    }

    /** position of the mobile next to last **/
    get nexto() {
        return this.pairs[this.pairs.length - 2];
    }


    set nexto(newLast) {
        this.pairs[this.pairs.length - 2] = newLast;
    }

    /** total length of the trajectory **/
    get length() {
        let length = 0;
        for (let i = 1; i < this.pairs.length; i++) {
            length += this.pairs[i].relative.dist(this.pairs[i - 1].relative);
        }
        return length;
    }

    /** array of `Vector3` containing all the successive observer positions **/
    get origin() {
        return this.pairs.map((pair) => pair.origin);
    }

    set origin(origins) {
        this.pairs.forEach((pair, index) => {
            pair.origin = origins[index]
        });
    }

    /** array of `Vector3` containing all the successive absolute positions of the mobile **/
    get absolute() {
        return this.pairs.map((pair) => pair.position);
    }

    set absolute(absolute) {
        this.pairs.forEach((pair, index) => {
            pair.position = absolute[index]
        });
    }

    /** array of `Vector3` containing all the successive relative positions the mobile **/
    get relative() {
        return this.pairs.map((pair) => pair.relative);
    }

    set relative(relative) {
        this.pairs.forEach((pair, index) => {
            pair.relative = relative[index]
        });
    }

    translate(u: Vector3) {
        this.pairs.forEach((pair) => {
            pair.translate(u)
        });
        return this;
    }

    homothetic(s: number) {
        this.pairs.forEach((pair) => {
            pair.homothetic(s)
        });
        return this;
    }

    transform(m: Matrix3) {
        this.pairs.forEach((pair) => {
            pair.transform(m)
        });
        return this;
    }

    affine(m: Matrix3, v: Vector3) {
        this.pairs.forEach((pair) => {
            pair.affine(m, v)
        });
        return this;
    }

    /**
     * @brief position at curvilinear abscissa
     * @param s curvilinear abscissa
     * @returns value of position at curvilinear abscissa
     */
    at(s: number) {
        const scale = s * (this.pairs.length - 1);
        const s0 = Math.floor(scale), s1 = (s0 + 1);
        const x0 = this.get(s0).copy(), x1 = this.get(s1).copy();
        return new Pair3(x1.origin.sub(x0.origin).mul(scale - s0).add(x0.origin),
            x1.position.sub(x0.position).mul(scale - s0).add(x0.position));
    }

    /**
     * @brief duration at curvilinear abscissa
     * @details Time elapsed since the beginning of the movement.
     * @param s curvilinear abscissa
     * @returns value of duration at curvilinear abscissa
     */
    t(s: number) {
        const scale = s * (this.pairs.length - 1);
        const s0 = Math.floor(scale);
        const t = this.duration(s0);
        return s0 < this.dt.length ? t + (scale - s0) * this.dt[s0] : t;
    }

    /**
     * @brief position at integer index
     * @param i number of samples to count
     * @returns position at index `i`
     */
    get(i: number) {
        return this.pairs[i];
    }

    /**
     * @brief duration at integer index
     * @details Time elapsed since the beginning of the movement.
     * @param i number of samples to count
     * @returns value of duration at index `i`
     */
    duration(i = this.dt.length) {
        return +(this.dt.slice(0, i).reduce((acc, dt) => acc + dt, 0));
    }

    isEqual(trajectory: Trajectory) {
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
     * @param pair position of the mobile
     * @param dt time step elapsed since `last` position
     * @returns reference to `this`
     */
    add(pair: Pair3, dt?: number) {
        this.dt.push(dt || this.dt[this.dt.length - 1] || 1);
        this.pairs.push(pair);
        return this;
    }

    /**
     * @brief clears the trajectory
     * @details Removes all pairs and steps.
     * @returns reference to `this`
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
     * @param u position of observer and mobile
     * @param size number of elements in trajectory
     * @param dt time step between each position
     * @returns new instance of trajectory
     */
    static zeros(u: Vector3, size: number, dt: number[] | number = 1) {
        return new Trajectory(Array(size).fill(Pair3.zeros(u)), dt);
    }

    /**
     * @brief trajectory from array of position vectors
     * @details The observer is considered as immobile.
     * @param positions successive absolute positions of the mobile as `Vector3`
     * @param dt time step between each position
     * @param origin observer's position
     * @returns new instance of trajectory
     */
    static discrete(positions: Vector3[], dt: number[] | number = 1, origin = Vector3.zeros) {
        return new Trajectory(positions.map((u) => new Pair3(origin, u)), dt);
    }

    /**
     * @brief linear trajectory
     * @details Computes a linear trajectory starting from the given `origin` with director coefficient `v`.
     * The observer is considered as immobile
     * @param count number of samples
     * @param dt sampling step
     * @param v director coefficient
     * @param origin observer's position
     * @return value of linear trajectory
     */
    static linear(count: number, dt: number = 1, v = Vector3.ex, origin = Vector3.zeros) {
        const vectors = new Array(count);
        for (let i = 0; i < count; i++) {
            vectors[i] = v.mulc(dt * i).add(origin);
        }
        return Trajectory.discrete(vectors, dt, origin);
    }

    /**
     * @brief trajectory with given metric in the rotation plane
     * @details The metric is set by giving `cos` and `sin` function. It allows to represent more than circular movement
     * but all movement that call be express with a matrix of the same shape as rotation matrix.
     *
     * The trajectory is computed by performing successive infinitesimal rotations of a unit vector around the given `axis`.
     * Then the positions are scaled and translate so the norm of the unit vector is multiplied by `a` and the trajectory
     * has the right origin..
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param axis axis of rotation
     * @param origin origin of the circle
     * @param dt sampling step
     * @return value of circular trajectory
     */
    static rotational(cos = Math.cos, sin = Math.sin, axis = Vector3.ez, origin = Vector3.zeros, dt = 1) {
        const vectors = [];
        const ez = Vector3.ez;
        const rot = Matrix3.makeRot(axis, cos, sin);
        const position = axis.isEqual(ez) ? Vector3.ex : ez.crossc(axis).div(ez.sin(axis) * axis.r);

        for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI * dt) {
            vectors.push(rot(theta).mapc(position).add(origin));
        }
        return Trajectory.discrete(vectors, dt, origin);
    }

    /**
     * @brief elliptic trajectory
     * @details The observer is considered as immobile
     * @param a major axis
     * @param b minor axis
     * @param axis axis of rotation
     * @param origin origin of the circle
     * @param dt sampling step
     * @return value of circular trajectory
     */
    static elliptic(a = 1, b = 1, axis = Vector3.ez, origin = Vector3.zeros, dt = 1) {
        const cos = (theta: number) => a * Math.cos(theta), sin = (theta: number) => b * Math.sin(theta);
        return Trajectory.rotational(cos, sin, axis, origin, dt);
    }

    /**
     * @brief circular trajectory
     * @details The observer is considered as immobile
     * @param radius radius of the circle
     * @param axis axis of rotation
     * @param origin origin of the circle
     * @param dt sampling step
     * @return value of circular trajectory
     */
    static circular(radius = 1, axis = Vector3.ez, origin = Vector3.zeros, dt = 1) {
        return Trajectory.elliptic(radius, radius, axis, origin, dt);
    }

    /**
     * @brief hyperbolic trajectory
     * @details The observer is considered as immobile
     * @param a major axis
     * @param b minor axis
     * @param axis axis of rotation
     * @param origin origin of the circle
     * @param dt sampling step
     * @return value of circular trajectory
     */
    static hyperbolic(a = 1, b = 1, axis = Vector3.ez, origin = Vector3.zeros, dt = 1) {
        const cos = (theta: number) => a * Math.cosh(theta), sin = (theta: number) => b * Math.sinh(theta);
        return Trajectory.rotational(cos, sin, axis, origin, dt);
    }
}
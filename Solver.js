if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Trajectory = require("./Trajectory.js");
    BufferTrajectory = require("./BufferTrajectory.js");
}

/**
 * @class Solver
 * @author samiBendou
 * @brief second order differential equations solver
 * @details `Solver` class allows to solve equations with the form  **d2u/dt2 = f(u, v, t)**.
 *
 * We introduce the following definition :
 * - **u** is the _unknown vector_ function
 * - **v = du/dt0** is the _derivative_ of **u**
 * - **d2u/dt2** denotes the _second order derivative_ of **u**
 * - **f(u, t)** is a _smooth function_ depending only on coordinates of **u** and time **t**
 *
 * Only explicit Euler's method is available for the moment.
 *
 * Construct a solver by giving a solving step **dt0** as `number `and a function **f** as `function`.
 *
 * #### Features
 *
 * - **Step by step solving**. Get the next value of **u** giving the current and previous values of u
 *
 * - **Global solving**. Give the number of steps, **u0** and **v0** and get an array of samples solutions
 *
 * @property {function(Vector3): Vector3} **f** function as Javascript function that takes as parameter a `Vector3` and
 * returns a `Vector3`.
 * @property dt1 {number} current step between solution samples
 * @property dt0 {number} previous step between solution samples
 * @property method {Solver.methods} current step between solution samples
 */

const methods = {
    EULER: function (f, u1, u0, t, dt0, dt1 = dt0) {
        return u1.mulc(2).sub(u0).add(f(u1, t).mul(dt0 * dt1));
    },
    default: "EULER"
};

class Solver {
    constructor(field = () => Vector3.zeros, dt = 1, method = Solver.methods.default) {
        this.field = field;
        this.dt0 = dt;
        this.dt1 = dt;
        this.method = method;
    }

    /**
     * @brief compute one solution step
     * @param u1 {Vector3} current value of unknown vector
     * @param u0 {Vector3} previous value of unknown vector
     * @param t {number} duration since initial instant
     * @param dt {number=} time step for this iteration
     * @param method {string=} method to use for this step
     * @returns {Vector3} value of next solution from ODE
     */
    step(u1, u0, t, dt = this.dt1, method = this.method) {
        this.dt0 = this.dt1;
        this.dt1 = dt;
        return Solver.methods[this.method](this.field, u1, u0, t, this.dt0, this.dt1);
    }

    /**
     * @brief compute one solution step with given trajectory
     * @details Adds an iteration of solution to the trajectory as a `PointPair` object.
     * the position of the observer can be specified of the added `PointPair` but it will
     * not be taken in account in movement computation.
     * if no observer's position is specified then the last one in trajectory is taken.
     * @param trajectory {BufferTrajectory} buffer to store the computed iteration
     * @param dt {number=} time step for this iteration
     * @param origin {Vector3=} origin to set for the solution
     * @param method {string=} method to use for this step
     * @returns {BufferTrajectory} reference to `trajectory`
     */
    buffer(trajectory, dt = this.dt1, origin = trajectory.pairs[trajectory.lastIndex].origin, method = this.method) {
        let next = this.step(trajectory.last.vector, trajectory.nexto.vector, trajectory.duration(), dt, method);
        trajectory.add(new PointPair(origin, next), this.dt0);
        return trajectory;
    }

    /**
     * @brief transform speed and position initial conditions
     * @details Transforms the **u0**, **v0** initial condition into a **u0**, **u1** initial condition.
     * `this.dt0` is modified after the operation.
     * @param u0 {Vector3} initial unknown
     * @param v0 {Vector3} initial derivative of unknown
     * @param dt0 {number=} initial time step
     * @returns {Vector3} solution right after initial instant
     */
    initialTransform(u0, v0, dt0 = this.dt0) {
        let u1 = v0.mulc(dt0).add(u0);
        return u1.add(this.field(u1, 0).mul(dt0 * dt0 / 2));
    }

    /**
     * @brief solve ODE with by giving number of iterations
     * @details `dt0` array must be of _size `count - 1`.
     * @param u0 {Vector3} initial unknown
     * @param v0 {Vector3} initial derivative of unknown
     * @param count {number} number of steps to solve
     * @param dt {Array|number=} time steps between each iteration
     * @param method {string=} solving method to use
     * @returns {Array} array containing successive solutions of ODE as `Vector3`
     */
    solve(u0, v0, count, dt = [], method = Solver.methods.default) {
        let u = new Array(count);

        this.dt0 = typeof dt === "number" ? dt : this.dt0;
        u[0] = u0.copy();
        u[1] = this.initialTransform(u0, v0, dt[0]);
        for (let i = 2; i < count; i++) {
            u[i] = this.step(u[i - 1], u[i - 2], i * this.dt0, dt[i - 1], method);
        }

        return u;
    }

    /**
     * @brief solve ODE by giving duration
     * @param u0 {Vector3} initial unknown
     * @param v0 {Vector3} initial derivative of unknown
     * @param tmax {number} total solving duration
     * @param dt {number=} constant time step iterations
     * @param method {string=} solving method to use
     * @returns {Array} array containing successive solutions of ODE as `Vector3`
     */
    solveMax(u0, v0, tmax, dt = 1, method = Solver.methods.default) {
        return this.solve(u0, v0, Math.floor(tmax / this.dt0), this.dt0, method);
    }

    /**
     * @brief solve ODE with by giving number of iterations
     * @details The observer is considered as immobile.
     * @param u0 {Vector3} initial position of mobile
     * @param v0 {Vector3} initial speed of mobile
     * @param count {number} number of steps to solve
     * @param dt {Array|number=} time steps between each iteration
     * @param origin {Vector3=} observer's position
     * @param method {string=} solving method to use
     * @returns {Trajectory} new instance of trajectory containing the solution
     */
    trajectory(u0, v0, count, dt = [], origin = Vector3.zeros, method = Solver.methods.default) {
        return Trajectory.discrete(this.solve(u0, v0, count, dt, method), dt, origin);
    }

    /**
     * @brief solve ODE with by giving duration
     * @details The observer is considered as immobile.
     * @param u0 {Vector3} initial position of mobile
     * @param v0 {Vector3} initial speed of mobile
     * @param tmax {number} total solving duration
     * @param dt {number=} constant time step iterations
     * @param origin {Vector3=} observer's position
     * @param method {string=} solving method to use
     * @returns {Trajectory} new instance of trajectory containing the solution
     */
    trajectoryMax(u0, v0, tmax, dt = 1, origin = Vector3.zeros, method = Solver.methods.default) {
        return Trajectory.discrete(this.solveMax(u0, v0, tmax, dt, method), dt, origin);
    }
}

Solver.methods = methods;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Solver;
else
    window.Solver = Solver;
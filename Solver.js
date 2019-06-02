if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Trajectory = require("./Trajectory.js");
}

/**
 * @class Solver
 * @author samiBendou
 * @brief second order differential equations solver
 * @details `Solver` class allows to solve equations with the form  **d2u/dt2 = f(u, t)**.
 *
 * We introduce the following definition :
 * - **u** is the _unknown vector_ function
 * - **v = du/dt** is the _derivative_ of **u**
 * - **d2u/dt2** denotes the _second order derivative_ of **u**
 * - **f(u, t)** is a _smooth function_ depending only on coordinates of **u** and time **t**
 *
 * Only explicit Euler's method is available for the moment.
 *
 * Construct a solver by giving a solving step **dt** as `number `and a function **f** as `function`.
 *
 * #### Features
 *
 * - **Step by step solving**. Get the next value of **u** giving the current and previous values of u
 *
 * - **Global solving**. Give the number of steps, **u0** and **v0** and get an array of samples solutions
 *
 * @property {function(Vector3): Vector3} **f** function as Javascript function that takes as parameter a `Vector3` and
 * returns a `Vector3`.
 * @property dt {number} constant step between solution samples
 */

class Solver {

    constructor(field, dt = 1) {
        this.field = field;
        this.dt = dt;
    }

    /**
     * @brief compute one solution step
     * @param cur {Vector3} current value of unknown vector
     * @param prev {Vector3} previous value of unknown vector
     * @param t {number} duration since initial instant
     * @param dt {number=} time step for this iteration
     * @returns {Vector3} value of next solution from ODE
     */
    step(cur, prev, t, dt) {
        this.dt = dt || this.dt;
        let step2 = this.dt * this.dt;
        return cur.copy().mul(2).sub(prev).add(this.field(cur, t).mul(step2));
    }

    /**
     * @brief transform speed and position initial conditions
     * @details Transforms the **u0**, **v0** initial condition into a **u0**, **u1** initial condition.
     * `this.dt` is modified after the operation.
     * @param u0 {Vector3} initial unknown
     * @param v0 {Vector3} initial derivative of unknown
     * @param dt {number=} initial time step
     * @returns {Vector3} solution right after initial instant
     */
    initialTransform(u0, v0, dt) {
        this.dt = dt || this.dt;
        let u1 = v0.copy().mul(this.dt).add(u0);
        return u1.add(this.field(u1, 0).mul(this.dt * this.dt / 2));
    }

    /**
     * @brief solve ODE with `Vector3`
     * @param u0 {Vector3} initial unknown
     * @param v0 {Vector3} initial derivative of unknown
     * @param count {number} number of steps to solve
     * @param dt {Array|number} time steps between each iteration
     * @returns {Array} array containing successive solutions of ODE as `Vector3`
     */
    solve(u0, v0, count, dt = []) {
        let u = new Array(count);

        this.dt = typeof dt === "number" ? dt : this.dt;
        u[0] = u0.copy();
        u[1] = this.initialTransform(u0, v0, dt[0]);
        for (let i = 2; i < count; i++) {
            u[i] = this.step(u[i - 1], u[i - 2], i * this.dt, dt[i - 1]);
        }

        return u;
    }

    /**
     * @brief solve ODE with `PointPair`
     * @details The observer is considered as immobile.
     * @param u0 {Vector3} initial position of mobile
     * @param v0 {Vector3} initial speed of mobile
     * @param count {number} number of steps to solve
     * @param origin {Vector3} observer's position
     * @returns {Trajectory} new instance of trajectory containing the solution
     */
    trajectory(u0, v0, count, origin = Vector3.zeros) {
        return Trajectory.discrete(this.solve(u0, v0, count), this.dt, origin);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Solver;
else
    window.Solver = Solver;
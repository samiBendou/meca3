if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    Vector3 = require("./Vector3.js");
Trajectory = require("./Trajectory.js");

/**
 * @class Solver
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Solve second order differential equation
 * @details Solve equations with the form  d2u/dt2 = f(u, t) where :
 * - u is the unknown vector function also know as state vector
 * - d2u / dt2 denotes the second order derivative of u
 * - f(u, t) is a smooth function depending only on coordinates of u and time t
 * - v = du/dt is the derivative of u
 *
 * This solver is designed to be used in two ways :
 * 1. Step by step solving. Get the next value of u giving the current and previous values of u
 * 2. Trajectory solving. Give the number of steps, u0 and v0 and get an array containing u at each step
 *
 * Only explicit Euler's method is available for the moment.
 *
 * The solver stores the field function used as Javacript function and the time step between each solving step
 * as a real number
 *
 * @property {function} field Javascript function representing the output of the f(., .) function.
 * @property {Number} step Constant time step between two solving instant.
 */
class Solver {
    /**
     * @brief Construct a Solver with a given field and step
     * @param {function} field Javascript function representing the output of the f(., .) function.
     * @param {Number} step Constant time step between two solving instant.
     */
    constructor(field, step = 1) {
        this.field = field;
        this.step = step;
    }

    /**
     * @brief Get the next approximation value of ODE
     * @details Euler's explicit method is used to compute next state
     * @param cur {Vector3} current state vector
     * @param prev {Vector3} previous state vector
     * @param t {number} current duration
     * @returns {Vector3} value of next state vector from ODE
     */
    eulerStep(cur, prev, t) {
        let step2 = this.step * this.step;
        return cur.copy().mul(2).sub(prev).add(this.field(cur, t).mul(step2));
    }

    /**
     * @brief Transform speed and position initial conditions
     * @details Transforms the u0, v0 initial condition into a u0, u1 initial condition
     * for the ODE. This mean that instead of giving initial speed and position,
     * you give initial position and position right after initial instant.
     * @param u0 {Vector3} initial position
     * @param v0 {Vector3} initial speed
     * @returns {Vector3} position right after initial instant
     */
    initialTransform(u0, v0) {
        let u1 = v0.copy().mul(this.step).add(u0);
        return u1.add(this.field(u1, 0).mul(this.step * this.step / 2));
    }

    /**
     * @brief Solve ODE with speed and position initial condition
     * @param u0 {Vector3} initial position
     * @param v0 {Vector3} initial speed
     * @param count {number} number of steps to solve
     * @returns {Array} array containing successive solutions of ODE as Vector3
     */
    solve(u0, v0, count) {
        let u = new Array(count);

        u[0] = u0.copy();
        u[1] = this.initialTransform(u0, v0);
        for (let i = 2; i < count; i++) {
            u[i] = this.eulerStep(u[i - 1], u[i - 2], i * this.step);
        }

        return u;
    }

    /**
     * @brief Solve ODE and get trajectory
     * @details All the vectors will have the same origin
     * @param u0 {Vector3} initial position
     * @param v0 {Vector3} initial speed
     * @param count {number} number of steps to solve
     * @param origin {Vector3} origin to set for all point pairs
     * @returns {Trajectory|BufferTrajectory} reference to `trajectory`
     */
    trajectory(u0, v0, count, origin = Vector3.zeros) {
        return Trajectory.fromVect(this.solve(u0, v0, count), this.step, origin);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Solver;
else
    window.Solver = Solver;
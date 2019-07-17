import Vector3 from "./Vector3";
import Pair3 from "./Pair3";
import Trajectory from "./Trajectory";
import BufferTrajectory from "./BufferTrajectory";

/**
 * @brief second order differential equations solver
 * @details `Solver` class provide a solver for equations of the form  **d2u/dt2 = f(u, t)**.
 *
 * We introduce the following definition :
 * - **u** is the _unknown vector_ time dependant function
 * - **d2u/dt2** denotes the _second order derivative_ of **u**
 * - **f(u, t)** is a _smooth function_ depending only on coordinates of **u** and time **t**
 *
 * Only explicit Euler's method is available for the moment.
 *
 * - **Step by step solving**. Get the next value of **u** giving the current and previous values of u
 *
 * - **Global solving**. Give the number of steps, **u0** and **v0** and get an array of samples solutions
 *
 * - **Use directly with trajectories** to update position according to the last speed and position
 */

const compute: Readonly<((f: (u: Vector3, t: number) => Vector3,
                          u1: Vector3, u0: Vector3,
                          t: number, dt0: number, dt1?: number) => Vector3)[]> =
    [
        // EULER EXPLICIT METHOD
        (f, u1, u0, t, dt0, dt1 = dt0) =>
            u1.mulc(2).sub(u0).add(f(u1, t).mul(dt0 * dt1))
    ];

/** Enumeration of solving method that can be used **/
export enum methods {
    EULER,
}

export default class Solver {

    /** **f** function as arrow function **/
    f: (u?: Vector3, t?: number) => Vector3;

    /** previous step between solution samples **/
    dt0: number;

    /** current step between solution samples **/
    dt1: number;

    /** solving method to use**/
    method: methods;

    /** Construct a solver by giving a solving step **dt0** and a function **f** **/
    constructor(f: (u?: Vector3, t?: number) => Vector3 = () => Vector3.zeros, dt = 1, method = methods.EULER) {
        this.f = f;
        this.dt0 = dt;
        this.dt1 = dt;
        this.method = method;
    }

    /**
     * @brief compute one solution step
     * @param u1 current value of unknown vector
     * @param u0 previous value of unknown vector
     * @param t duration since initial instant
     * @param dt time step for this iteration
     * @param method method to use for this step
     * @returns value of next solution from ODE
     */
    step(u1: Vector3, u0: Vector3, t = 0, dt = this.dt1, method = this.method) {
        this.dt0 = this.dt1;
        this.dt1 = dt;
        return compute[this.method](this.f, u1, u0, t, this.dt0, this.dt1);
    }

    /**
     * @brief compute one solution step with given trajectory
     * @details Adds an iteration of solution to the trajectory as a `Pair3` object.
     * the position of the observer can be specified of the added `Pair3` but it will
     * not be taken in account in movement computation.
     * if no observer's position is specified then the last one in trajectory is taken.
     * @param trajectory buffer to store the computed iteration
     * @param dt time step for this iteration
     * @param method method to use for this step
     * @param origin origin to set for the solution
     * @returns reference to `trajectory`
     */
    buffer(trajectory: BufferTrajectory,
           dt = this.dt1,
           method = this.method,
           origin = trajectory.pairs[trajectory.lastIndex].origin) {
        let next = this.step(trajectory.last.position, trajectory.nexto.position, trajectory.duration(), dt, method);
        trajectory.add(new Pair3(origin, next), this.dt0);
        return trajectory;
    }

    /**
     * @brief transform speed and position initial conditions
     * @details Transforms the **u0**, **v0** initial condition into a **u0**, **u1** initial condition.
     * `this.dt0` is modified after the operation.
     * @param u0 initial unknown
     * @param v0 initial derivative of unknown
     * @param dt0 initial time step
     * @returns solution right after initial instant
     */
    initialTransform(u0: Vector3, v0: Vector3, dt0 = this.dt0) {
        let u1 = v0.mulc(dt0).add(u0);
        return u1.add(this.f(u1, 0).mul(dt0 * dt0 / 2));
    }

    /**
     * @brief solve ODE with by giving number of iterations
     * @details `dt0` array must be of _size `count - 1`.
     * @param u0 initial unknown
     * @param v0 initial derivative of unknown
     * @param count number of steps to solve
     * @param dt time steps between each iteration
     * @param method solving method to use
     * @returns {Array} array containing successive solutions of ODE as `Vector3`
     */
    solve(u0: Vector3, v0: Vector3, count: number, dt = this.dt0, method = methods.EULER) {
        let u = new Array(count);

        this.dt0 = dt;
        u[0] = u0.copy();
        u[1] = this.initialTransform(u0, v0, this.dt0);
        for (let i = 2; i < count; i++) {
            u[i] = this.step(u[i - 1], u[i - 2], i * this.dt0, this.dt1, method);
        }

        return u;
    }

    /**
     * @brief solve ODE by giving duration
     * @param u0 initial unknown
     * @param v0 initial derivative of unknown
     * @param tmax total solving duration
     * @param dt constant time step iterations
     * @param method solving method to use
     * @returns {Array} array containing successive solutions of ODE as `Vector3`
     */
    solveMax(u0: Vector3, v0: Vector3, tmax: number, dt = this.dt0, method = methods.EULER) {
        return this.solve(u0, v0, Math.floor(tmax / this.dt0), this.dt0, method);
    }

    /**
     * @brief solve ODE with by giving number of iterations
     * @details The observer is considered as immobile.
     * @param u0 initial position of mobile
     * @param v0 initial speed of mobile
     * @param count number of steps to solve
     * @param dt time steps between each iteration
     * @param method solving method to use
     * @param origin observer's position
     * @returns new instance of trajectory containing the solution
     */
    trajectory(u0: Vector3, v0: Vector3, count: number, dt = this.dt0, method = methods.EULER, origin = Vector3.zeros) {
        return Trajectory.discrete(this.solve(u0, v0, count, dt, method), dt, origin);
    }

    /**
     * @brief solve ODE with by giving duration
     * @details The observer is considered as immobile.
     * @param u0 initial position of mobile
     * @param v0 initial speed of mobile
     * @param tmax total solving duration
     * @param dt constant time step iterations
     * @param method solving method to use
     * @param origin observer's position
     * @returns new instance of trajectory containing the solution
     */
    trajectoryMax(u0: Vector3, v0: Vector3, tmax: number, dt = 1, method = methods.EULER, origin = Vector3.zeros) {
        return Trajectory.discrete(this.solveMax(u0, v0, tmax, dt, method), dt, origin);
    }
}
import Point from "./Point";
import Solver from "./Solver";
import Vector3 from "./Vector3";

/**
 * @brief trajectory of a mobile
 * @details `Field` class represent a _system_ of material points attracted in a _field_.
 *
 * Set `withMass` to `true property to simulate 2nd Newton law dynamic when constructing the f.
 *
 * - Move all the points with **dependent dynamic** by giving a unique solver
 *
 * - Represent **all the points in the same frame**
 *
 */
export default class Field {

    /** points composing the system **/
    points: Point[];

    /** point used as frame of other points **/
    frame: Point;

    /** Construct a f by giving an array of points a solver and a frame **/
    constructor(points: Point[], solver = new Solver(), frame = points[0], withMass = false) {
        this.points = points;
        this.frame = frame;
        this._setSolvers(solver, withMass);
    }

    /** solver used to update all the points **/
    get solver() {
        return this.points[0].solver;
    }

    set solver(newSolver) {
        this._setSolvers(newSolver, false);
    }

    /** barycenter of the points **/
    get barycenter() {
        let mass = this.points.reduce((acc, point) => acc + point.mass, 0);
        return this.points.reduce((acc, point) => acc.add(point.position.mul(point.mass)), Vector3.zeros).div(mass);
    }

    set barycenter(newCenter) {
        let center = this.barycenter;
        this.points.forEach((point) => {
            point.position = point.position.sub(center).add(newCenter)
        });
    }

    private _setSolvers(solver: Solver, withMass: boolean) {
        this.points.forEach((point) => {
            let f = solver.f;
            point.solver = withMass ? new Solver((u) => f(u).div(point.mass), solver.dt0, solver.method) : solver;
        });
    }

    /**
     * @brief updates the position of all the points
     * @details Solves a step of the ODE of the solver and update position.
     * @param dt time step for this iteration
     * @param origin origin to set for the solution
     * @returns reference to this
     */
    update(dt?: number, origin?: Vector3) {
        this.points = this.points.map((point) => point.copy().update(dt, origin));
        return this;
    }

    /**
     * @brief changes the frame of all the points
     * @details The whole trajectory of each point is changed.
     * @param p point to set as frame of each point
     * @return reference to this
     */
    reframe(p: Point) {
        p = p || Point.zeros();
        this.points.forEach((q) => {
            q.reframe(p)
        });
        return this;
    }
}
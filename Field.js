/**
 * @class Trajectory
 * @author samiBendou
 * @brief trajectory of a mobile
 * @details `Field` class represent a _system_ of material points attracted in a _field_.
 *
 * Construct a field by giving an array of points.
 *
 * #### Features
 *
 * - Move all the points with dependant dynamic by giving a solver
 *
 * - Represent all the points in the same frame
 *
 * @property points {Array} non empty array of `Point` objects composing the system
 * @property solver {Solver} solver used to represent the field
 * @property frame {Point} point used as frame of other points
 * @property bcenter {Point} barycenter of the points
 */
class Field {
    constructor(points, solver, frame) {
        this.points = points;
        this.frame = frame || points[0];
        this.setSolvers(solver || new Solver());
    }

    get solver() {
        return this.points[0].solver;
    }

    set solver(newSolver) {
        this.setSolvers(newSolver);
    }

    setSolvers(solver) {
        this.points.forEach((point) => {
            point.solver = solver
        });
    }

    /**
     * @brief updates the position of all the points
     * @details Solves a step of the ODE of the solver and update position.
     * @param dt {number=} time step for this iteration
     * @param origin {Vector3=} origin to set for the solution
     * @param method {Solver.methods=} method to use for this step
     * @returns {Field} reference to this
     */
    update(dt, origin, method) {
        this.points = this.points.map((point) => point.copy().update(dt, origin, method));
        return this;
    }

    /**
     * @brief changes the frame of all the points
     * @details The whole trajectory of each point is changed.
     * @param p {Point} point to set as frame of each point
     * @return {Field} reference to this
     */
    reframe(p) {
        p = p || Point.zeros();
        this.points.forEach((q) => {
            q.reframe(p)
        });
        return this;
    }

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
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Field;
else
    window.Field = Field;
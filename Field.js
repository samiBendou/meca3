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
 * @property points {Array} array of `Point` objects composing the system
 * @property frame {Point} point used as frame of other points
 * @property bcenter {Point} barycenter of the points
 * @property solver {Solver} solver used to represent the field
 */
class Field {
    constructor(solver, points) {
        this.points = points;
        this.solver = solver;
        this.frame = points[0];
    }

    /**
     * @brief updates the position of all the points
     * @details Solves a step of the ODE of the solver and update position.
     * @returns {Point} reference to this
     */
    update() {
        return;
    }

    /**
     * @brief changes the frame of all the points
     * @details The whole trajectory of each point is changed.
     * @param point {Point} point to set as frame of each point
     * @return {Point} reference to this
     */
    reframe(point) {
        return;
    }
}
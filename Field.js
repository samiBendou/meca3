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
 * @property solver {Solver} solver used to represent the field
 * @property frame {Point} point used as frame of other points
 * @property bcenter {Point} barycenter of the points
 */
class Field {
    constructor(points, solver, frame) {
        this.points = points;
        this.solver = solver;
        this.frame = frame || points[0];
    }

    /**
     * @brief updates the position of all the points
     * @details Solves a step of the ODE of the solver and update position.
     * @returns {Field} reference to this
     */
    update() {
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
        this.points.forEach(function (q) {
            q.reframe(p);
        });
        return this;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Field;
else
    window.Field = Field;
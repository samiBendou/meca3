import {Point} from "./Point";
import {Solver} from "./Solver";
import {Vector3} from "./Vector3";

/**
 * @brief trajectory of a mobile
 * @details `PointSet` class represent a _system_ of points attracted in a _field_.
 *
 * - Move all the points with **dependent dynamic** by giving a unique solver
 *
 * - Represent **all the points in the same frame**. Manipulate the frame
 *
 */

export interface PointSetOptions {
    copy: boolean;
    size: number;
}

export const defaultOptions: Partial<PointSetOptions> = {copy: true, size: 2};

export class PointSet {

    /** points composing the system **/
    points: Point[];

    /** point used as frame of other points **/
    private _frame: Point;

    copy: boolean;

    /** Construct a f by giving an array of points a solver and a frame **/
    constructor(points: Point[], solver = new Solver(), frame = points[0]) {
        this.points = points;
        this._frame = frame;
        this.points.forEach(point => point.solver = solver);
        this.field = solver.field;
    }

    get options() {
        return {copy: this.copy, size: this.points[0].options.size};
    }

    set options(newOptions: Partial<PointSetOptions>) {
        const size = newOptions.size || this.options.size;
        this.copy = newOptions.copy || this.copy;
        this.points.forEach(point => point.trajectory.size = size);
    }

    get frame() {
        return this._frame;
    }

    set frame(newFrame) {
        this._frame = newFrame;
        this.points.forEach(point => point.reframe(newFrame));
    }

    /** solver containing the field function common to each point **/
    get solver() {
        return this.points[0].solver;
    }

    set solver(newSolver) {
        this.points.forEach(point => point.solver = newSolver);
        this.field = newSolver.field;
    }

    /** common solving method **/
    get method() {
        return this.points[0].solver.method;
    }

    set method(newMethod) {
        this.points.forEach(point => point.solver.method = newMethod);
    }

    /** common current time step **/
    get dt() {
        return this.points[0].dt;
    }

    set dt(newDt) {
        this.points.forEach(point => {
            point.solver.dt1 = newDt;
            point.dt = newDt;
        });
    }

    /** common field used to update all the points **/
    get field() {
        return this.points[0].solver.field;
    }

    set field(newField) {
        this.points.forEach(point => point.field = newField);
    }

    /** geometrical center of the points **/
    get center() {
        return this.points.reduce((acc, point) => acc.add(point.position), Vector3.zeros).div(this.points.length);
    }

    set center(newCenter) {
        const center = this.center;
        this.points.forEach(point => point.position = point.position.sub(center).add(newCenter));
    }

    /** barycenter of the points **/
    get barycenter() {
        const mass = this.points.reduce((acc, point) => acc + point.mass, 0) || this.points.length;
        return this.points.reduce((acc, point) => acc.add(point.position.mul(point.mass || 0)), Vector3.zeros).div(mass);
    }

    set barycenter(newCenter) {
        const center = this.barycenter;
        this.points.forEach(point => point.position = point.position.sub(center).add(newCenter));
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
        this.frame = p;
        return this;
    }
}
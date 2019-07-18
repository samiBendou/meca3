import {Vector3} from "./Vector3";
import {Solver} from "./Solver";
import {BufferTrajectory} from "./BufferTrajectory";

/**
 * @brief material point
 * @details `Point` class represents physics _material points_ model in a _frame_.
 *
 * `Points` must be initialized using the `init` method in order to performed trajectory updates.
 *
 * - **Manipulate the trajectory** of the point
 *
 * - **Manipulate speed and position** of the point
 *
 * - **Change frame** of the point
 *
 * - Move point by giving a solver to **generate the trajectory**
 */


export interface PointOptions {
    mass?: number;
    size: number;
}

export class Point {

    static defaultOptions: Partial<PointOptions> = {size: 2};

    /** trajectory of the point **/
    trajectory: BufferTrajectory;

    /** mass of the point **/
    mass?: Readonly<number>;

    /** solver used to update the trajectory **/
    solver: Solver;

    /** Construct a material point by giving a mass and optionally a trajectory **/

    constructor(trajectory: BufferTrajectory, solver = new Solver(), mass?: number) {
        this.trajectory = trajectory;
        this.mass = mass;
        this.solver = solver;

        this.field = solver.field.bind({});
    }

    set options(newOptions: Partial<PointOptions>) {
        this.mass = newOptions.mass || this.mass;
        this.trajectory.size = newOptions.size || this.trajectory.size;
    }

    get options() {
        return {mass: this.mass, size: this.trajectory.size};
    }

    get field() {
        return this.solver.field;
    }

    set field(newField) {
        this.solver.field = (u, t) => this.mass ? newField(u, t).div(this.mass) : newField(u, t);
    }

    /** current relative position **/
    get position() {
        return this.trajectory.last.relative;
    }

    set position(newPosition) {
        this.trajectory.last.relative = newPosition;
    }

    /** current relative speed **/
    get speed() {
        return this.du.div(this.dt);
    }

    set speed(newSpeed) {
        this.init(this.position, newSpeed);
    }

    /** current position differential **/
    get du() {
        return this.trajectory.last.relative.sub(this.trajectory.nexto.relative);
    }

    set du(newDu) {
        this.trajectory.last.relative = this.trajectory.nexto.relative.add(newDu);
    }

    /** current time step **/
    get dt() {
        return this.trajectory.dt[this.trajectory.lastStepIndex];
    }

    set dt(newDt) {
        this.trajectory.dt[this.trajectory.lastStepIndex] = newDt;
    }

    /** `x` coordinate of current relative position **/
    get x() {
        return this.trajectory.last.relative.x;
    }

    set x(newX) {
        this.trajectory.last.position.x = newX + this.trajectory.last.origin.x;
    }

    /** `y` coordinate of current relative position **/
    get y() {
        return this.trajectory.last.relative.y;
    }

    set y(newY) {
        this.trajectory.last.position.y = newY + this.trajectory.last.origin.y;
    }

    /** `z` coordinate of current relative position **/
    get z() {
        return this.trajectory.last.relative.z;
    }

    set z(newZ) {
        this.trajectory.last.position.z = newZ + this.trajectory.last.origin.z;
    }

    /** `r` coordinate of current relative position **/
    get r() {
        return this.trajectory.last.relative.r;
    }

    set r(newR) {
        this.trajectory.last.position.r = newR + this.trajectory.last.origin.r;
    }

    /** `rxy` coordinate of current relative position **/
    get rxy() {
        return this.trajectory.last.relative.rxy;
    }

    set rxy(newRxy) {
        this.trajectory.last.position.rxy = newRxy + this.trajectory.last.origin.rxy;
    }

    /** `theta` coordinate of current relative position **/
    get theta() {
        return this.trajectory.last.relative.theta;
    }

    set theta(newTheta) {
        let relative = this.trajectory.last.relative;
        relative.theta = newTheta;
        this.trajectory.last.relative = relative;
    }

    /** `phi` coordinate of current relative position **/
    get phi() {
        return this.trajectory.last.relative.phi;
    }

    set phi(newPhi) {
        let relative = this.trajectory.last.relative;
        relative.phi = newPhi;
        this.trajectory.last.relative = relative;
    }

    /** latitude relative to the observer **/
    get lat() {
        return this.trajectory.last.relative.lat;
    }

    set lat(newLat) {
        let relative = this.trajectory.last.relative;
        relative.lat = newLat;
        this.trajectory.last.relative = relative;
    }

    /** longitude relative to the observer **/
    get lon() {
        return this.trajectory.last.relative.lon;
    }

    set lon(newLon) {
        let relative = this.trajectory.last.relative;
        relative.lon = newLon;
        this.trajectory.last.relative = relative;
    }

    /** current value of derivative of `x` coordinate **/
    get vx() {
        return (this.trajectory.last.relative.x - this.trajectory.nexto.relative.x) / this.dt;
    }

    /** current value of derivative of `y` coordinate **/
    get vy() {
        return (this.trajectory.last.relative.y - this.trajectory.nexto.relative.y) / this.dt;
    }

    /** current value of derivative of `z` coordinate **/
    get vz() {
        return (this.trajectory.last.relative.z - this.trajectory.nexto.relative.z) / this.dt;
    }

    /** current value of derivative of `t` coordinate **/
    get vr() {
        return (this.trajectory.last.relative.r - this.trajectory.nexto.relative.r) / this.dt;
    }

    /** current value of derivative of `rxy` coordinate **/
    get vrxy() {
        return (this.trajectory.last.relative.rxy - this.trajectory.nexto.relative.rxy) / this.dt;
    }

    /** current value of derivative of `theta` coordinate **/
    get vtheta() {
        return (this.trajectory.last.relative.theta - this.trajectory.nexto.relative.theta) / this.dt;
    }

    /** current value of derivative of `phi` coordinate **/
    get vphi() {
        return (this.trajectory.last.relative.phi - this.trajectory.nexto.relative.phi) / this.dt;
    }

    /**
     * @brief initialize the point with position and speed
     * @param u0 initial position
     * @param v0 initial speed
     * @param f field function used with the solver
     * @param dt0 initial time step
     * @return reference to this
     */
    init(u0 = Vector3.zeros, v0 = Vector3.zeros, f = this.solver.field, dt0 = this.solver.dt0) {
        this.solver.field = f;
        this.solver.dt0 = dt0;
        this.trajectory.nexto.relative = v0.mulc(-dt0).add(u0);
        this.trajectory.last.relative = u0;
        this.trajectory.dt[this.trajectory.lastStepIndex] = dt0;
        return this;
    }

    /**
     * @brief updates the position of the point
     * @details Solves a step of the ODE of the solver and update position.
     * @param dt time step for this iteration
     * @param origin origin to set for the solution
     * @returns reference to this
     */
    update(dt?: number, origin?: Vector3) {
        this.solver.buffer(this.trajectory, dt, origin);
        return this;
    }

    /**
     * @brief changes the frame of the point
     * @details The whole trajectory of the point is changed.
     * @param p point to set as frame
     * @returns reference to this
     */
    reframe(p: Point) {
        this.trajectory.origin = p.trajectory.absolute;
        return this;
    }

    copy() {
        return new Point(this.trajectory.copy(), this.solver, this.mass);
    }

    /**
     * @brief point absolutely located at zero
     * @param options additional behavior for the point
     */
    static origin(options = Point.defaultOptions) {
        return new Point(BufferTrajectory.zeros(Vector3.zeros, options.size), new Solver(), options.mass);
    }

    /**
     * @brief point relatively located at zero
     * @param origin absolute coordinates of the frame of the point
     * @param options additional behavior for the point
     * @returns new instance of point
     */
    static zeros(origin = Vector3.zeros, options = Point.defaultOptions) {
        return new Point(BufferTrajectory.zeros(origin, options.size), new Solver(), options.mass);
    }

    static vect(u: Vector3, origin = Vector3.zeros, options = Point.defaultOptions) {
        return new Point(BufferTrajectory.constant(u, options.size, undefined, origin), new Solver(), options.mass);
    }

    static linear(v = Vector3.ex, dt: number = 1, origin = Vector3.zeros, options = Point.defaultOptions) {
        return new Point(BufferTrajectory.linear(v, options.size, dt, origin), new Solver(), options.mass);
    }
}
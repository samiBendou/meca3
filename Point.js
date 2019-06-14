if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Solver = require("./Solver.js");
    BufferTrajectory = require("./BufferTrajectory.js");
}


/**
 * @class Point
 * @author samiBendou
 * @brief material point
 * @details `Point` class represents physics _material points_ model in a _frame_.
 *
 * Construct a material point by giving a mass and optionally a trajectory
 *
 * #### Features
 *
 * - **Manipulate the trajectory** of the point
 *
 * - **Manipulate speed and position** of the point
 *
 * - **Change frame** of the point
 *
 * - Move point by giving a solver to **generate the trajectory**
 *
 * @property trajectory {BufferTrajectory} trajectory of the point
 * @property mass {number} mass of the point
 * @property position {Vector3} relative current position
 * @property speed {Vector3} relative current speed
 * @property solver {Solver} solver used to generate the trajectory
 *
 * @property du {Vector3} current position step (differential)
 * @property dt {number} current time step (differential)
 * @property x {number} cartesian position
 * @property y {number} cartesian position
 * @property z {number} cartesian position
 * @property r {number} spherical position
 * @property rxy {number} cylindrical position
 * @property theta {number} cylindrical and spherical position
 * @property phi {number} spherical position
 * @property lat {number} latitude position
 * @property lon {number} longitude position
 *
 * @property vx {number} cartesian speed
 * @property vy {number} cartesian speed
 * @property vz {number} cartesian speed
 * @property vr {number} spherical speed
 * @property vrxy {number} cylindrical speed
 * @property vtheta {number} cylindrical and spherical speed
 * @property vphi {number} spherical speed
 */

class Point {
    constructor(trajectory, mass = 0, solver = new Solver()) {
        this.trajectory = trajectory;
        this.mass = mass;
        this.solver = solver;
    }

    get position() {
        return this.trajectory.last.relative;
    }

    set position(newPosition) {
        this.trajectory.last.relative = newPosition;
    }

    get speed() {
        return this.du.div(this.dt);
    }

    set speed(newSpeed) {
        this.init(this.position, newSpeed);
    }

    get du() {
        return this.trajectory.last.relative.sub(this.trajectory.nexto.relative);
    }

    set du(newDu) {
        this.trajectory.last.relative = this.trajectory.nexto.relative.add(newDu);
    }

    get dt() {
        return this.trajectory.dt[this.trajectory.lastStepIndex];
    }

    get x() {
        return this.trajectory.last.relative.x;
    }

    set x(newX) {
        this.trajectory.last.vector.x = newX + this.trajectory.last.origin.x;
    }

    get y() {
        return this.trajectory.last.relative.y;
    }

    set y(newY) {
        this.trajectory.last.vector.y = newY + this.trajectory.last.origin.y;
    }

    get z() {
        return this.trajectory.last.relative.z;
    }

    set z(newZ) {
        this.trajectory.last.vector.z = newZ + this.trajectory.last.origin.z;
    }

    get r() {
        return this.trajectory.last.relative.r;
    }

    set r(newR) {
        this.trajectory.last.vector.r = newR + this.trajectory.last.origin.r;
    }

    get rxy() {
        return this.trajectory.last.relative.rxy;
    }

    set rxy(newRxy) {
        this.trajectory.last.vector.rxy = newRxy + this.trajectory.last.origin.rxy;
    }

    get theta() {
        return this.trajectory.last.relative.theta;
    }

    set theta(newTheta) {
        let relative = this.trajectory.last.relative;
        relative.theta = newTheta;
        this.trajectory.last.relative = relative;
    }

    get phi() {
        return this.trajectory.last.relative.phi;
    }

    set phi(newPhi) {
        let relative = this.trajectory.last.relative;
        relative.phi = newPhi;
        this.trajectory.last.relative = relative;
    }

    get lat() {
        return this.trajectory.last.relative.lat;
    }

    set lat(newLat) {
        let relative = this.trajectory.last.relative;
        relative.lat = newLat;
        this.trajectory.last.relative = relative;
    }

    get lon() {
        return this.trajectory.last.relative.lon;
    }

    set lon(newLon) {
        let relative = this.trajectory.last.relative;
        relative.lon = newLon;
        this.trajectory.last.relative = relative;
    }

    get vx() {
        return (this.trajectory.last.relative.x - this.trajectory.nexto.relative.x) / this.dt;
    }

    get vy() {
        return (this.trajectory.last.relative.y - this.trajectory.nexto.relative.y) / this.dt;
    }

    get vz() {
        return (this.trajectory.last.relative.z - this.trajectory.nexto.relative.z) / this.dt;
    }

    get vr() {
        return (this.trajectory.last.relative.r - this.trajectory.nexto.relative.r) / this.dt;
    }

    get vrxy() {
        return (this.trajectory.last.relative.rxy - this.trajectory.nexto.relative.rxy) / this.dt;
    }

    get vtheta() {
        return (this.trajectory.last.relative.theta - this.trajectory.nexto.relative.theta) / this.dt;
    }

    get vphi() {
        return (this.trajectory.last.relative.phi - this.trajectory.nexto.relative.phi) / this.dt;
    }

    /**
     * @brief initialize the point with position and speed
     * @param u0 {Vector3=} initial position
     * @param v0 {Vector3=} initial speed
     * @param dt0 {number=} initial time step
     * @param field {function=} field used with the solver
     * @return {Point} reference to this
     */
    init(u0 = Vector3.zeros, v0 = Vector3.zeros, dt0 = this.solver.dt0, field = this.solver.field) {
        this.trajectory.nexto.relative = v0.mulc(-dt0).add(u0);
        this.trajectory.last.relative = u0;
        this.trajectory.dt[this.trajectory.lastStepIndex] = dt0;
        return this;
    }

    /**
     * @brief updates the position of the point
     * @details Solves a step of the ODE of the solver and update position.
     * @param dt {number=} time step for this iteration
     * @param origin {Vector3=} origin to set for the solution
     * @param method {Solver.methods=} method to use for this step
     * @returns {Point} reference to this
     */
    update(dt, origin, method) {
        this.solver.buffer(this.trajectory, dt, origin, method);
        return this;
    }

    /**
     * @brief changes the frame of the point
     * @details The whole trajectory of the point is changed.
     * @param p {Point} point to set as frame
     * @returns {Point} reference to this
     */
    reframe(p) {
        this.trajectory.origin = p.trajectory.absolute;
        return this;
    }

    copy() {
        return new Point(this.trajectory.copy(), this.mass, this.solver);
    }

    /**
     * @brief point located at zero
     * @param mass {number=} mass of the point
     * @param frame {Vector3=} absolute coordinates of the frame of the point
     * @param size {number=} size of the trajectory buffer
     * @returns {Point} new instance of point
     */
    static zeros(mass, frame = Vector3.zeros, size = 2) {
        return new Point(BufferTrajectory.zeros(frame, size), mass);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Point;
else
    window.Point = Point;
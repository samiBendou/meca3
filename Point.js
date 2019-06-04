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
 * - Manipulate the trajectory of the point
 *
 * - Get speed and position of the point
 *
 * - Change frame of the point
 *
 * - Move point by giving a solver for the trajectory
 *
 * - Manipulate current relative position and speed in current frame
 *
 * @property mass {number} mass of the point
 * @property trajectory {BufferTrajectory} trajectory of the point
 * @property dt {number} current time step
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
    constructor(mass, trajectory) {
        this.mass = mass;
        this.trajectory = trajectory;
    }

    get dt() {
        return this.trajectory.dt[this.trajectory.addIndex - 1];
    }

    set dt(newDt) {
        this.trajectory.dt[this.trajectory.addIndex - 1] = newDt;
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
     * @brief updates the position of the point
     * @details Solves a step of the ODE of the solver and update position.
     * @param solver {Solver} solver to use to calculate next position
     * @returns {Point} reference to this
     */
    update(solver) {
        return this;
    }

    /**
     * @brief changes the frame of the point
     * @details The whole trajectory of the point is changed.
     * @param point {Point} point to set as frame
     * @returns {Point} reference to this
     */
    reframe(point) {
        return this;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Point;
else
    window.Point = Point;
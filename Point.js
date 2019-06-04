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
 * @property x {Number} cartesian position
 * @property y {Number} cartesian position
 * @property z {Number} cartesian position
 * @property r {Number} spherical position
 * @property rxy {Number} cylindrical position
 * @property theta {Number} cylindrical and spherical position
 * @property phi {Number} spherical position
 * @property lat {Number} latitude position
 * @property lon {Number} longitude position
 *
 * @property vx {Number} cartesian speed
 * @property vy {Number} cartesian speed
 * @property vz {Number} cartesian speed
 * @property vr {Number} spherical speed
 * @property vrxy {Number} cylindrical speed
 * @property vtheta {Number} cylindrical and spherical speed
 * @property vphi {Number} spherical speed
 */

class Point {
    constructor(mass, trajectory) {
        this.mass = mass;
        this.trajectory = trajectory;
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

    }

    set vx(newX) {

    }

    get vy() {

    }

    set vy(newX) {

    }

    get vz() {

    }

    set vz(newX) {

    }

    get vr() {

    }

    set vr(newX) {

    }

    get vrxy() {

    }

    set vrxy(newX) {

    }

    get vtheta() {

    }

    set vtheta(newX) {

    }

    get vphi() {

    }

    set vphi(newX) {

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
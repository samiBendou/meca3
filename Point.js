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
    }

    set x(newX) {
    }

    get y() {
        return;
    }

    set y(newX) {

    }

    get z() {
        return;
    }

    set z(newX) {

    }

    get r() {
        return;
    }

    set r(newX) {

    }

    get rxy() {
        return;
    }

    set rxy(newX) {

    }

    get theta() {
        return;
    }

    set theta(newX) {

    }

    get phi() {
        return;
    }

    set phi(newX) {

    }

    get lat() {
        return;
    }

    set lat(newX) {

    }

    get lon() {
        return;
    }

    set lon(newX) {

    }

    get vx() {
        return;
    }

    set vx(newX) {

    }

    get vy() {
        return;
    }

    set vy(newX) {

    }

    get vz() {
        return;
    }

    set vz(newX) {

    }

    get vr() {
        return;
    }

    set vr(newX) {

    }

    get vrxy() {
        return;
    }

    set vrxy(newX) {

    }

    get vtheta() {
        return;
    }

    set vtheta(newX) {

    }

    get vphi() {
        return;
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
        return;
    }

    /**
     * @brief changes the frame of the point
     * @details The whole trajectory of the point is changed.
     * @param point {Point} point to set as frame
     * @return {Point} reference to this
     */
    reframe(point) {
        return;
    }
}
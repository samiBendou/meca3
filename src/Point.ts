import { Vector3, Vector6 } from "../../space3/src";

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
 */
export default class Point {
  /** mass of the point **/
  mass: number;

  private _position: Vector3;

  private _speed: Vector3;

  private _state: Vector6;

  /** Construct a material point by specifying mass, position and speed **/
  constructor(mass: number, position?: Vector3, speed?: Vector3) {
    this.mass = mass;
    this._position = position ?? Vector3.zeros;
    this._speed = speed ?? Vector3.zeros;
    this._state = new Vector6(...this.position.xyz, ...this.speed.xyz);
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position.copy(newPosition);
    this._state.upper = newPosition.xyz;
  }

  get speed() {
    return this._speed;
  }

  set speed(newPosition) {
    this._speed.copy(newPosition);
    this._state.upper = newPosition.xyz;
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._position.assign(...newState.upper);
    this._speed.assign(...newState.lower);
    this._state.copy(newState);
  }

  /**
   * @brief initialize the point with position and speed
   * @param position initial position
   * @param speed initial speed
   * @return reference to this
   */
  reset(position: Vector3, speed: Vector3): this {
    const state = new Vector6(...position.xyz, ...speed.xyz);
    this._position.copy(position);
    this._speed.copy(speed);
    this._state = state;
    return this;
  }

  translate(translation: Vector6) {
    const posShift = new Vector3(...translation.upper);
    const speedShift = new Vector3(...translation.lower);
    this._position.add(posShift);
    this._speed.add(speedShift);
    this._state.add(translation);
  }
}

import { Vector3, Vector6 } from "../../space3/src";
import List from "../../space3/src/common/List";
import Vectorial from "../../space3/src/common/Vectorial";

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
export default class Point implements Vectorial, List {
  /** mass of the point **/
  mass: number;

  id: string;

  private _state: Vector6;

  /** Construct a material point by specifying mass, position and speed **/
  constructor(id: string, mass: number, position?: Vector3, speed?: Vector3) {
    this.id = id;
    this.mass = mass;
    const _position = position ? position.clone() : Vector3.zeros;
    const _speed = speed ? speed.clone() : Vector3.zeros;
    this._state = new Vector6(..._position.xyz, ..._speed.xyz);
  }
  array(): number[] {
    return this._state.array();
  }

  string(): string {
    return this._state.string();
  }

  assign(...coordinates: number[]): this {
    this._state.assign(
      coordinates[0],
      coordinates[1],
      coordinates[2],
      coordinates[3],
      coordinates[4],
      coordinates[5]
    );
    return this;
  }

  copy(point: this): this {
    this._state.copy(point._state);
    return this;
  }

  clone(): this {
    return new Point(this.id, this.mass, this.position, this.speed) as this;
  }

  get dim() {
    return this._state.dim;
  }

  add(point: this): this {
    this._state.add(point._state);
    return this;
  }

  sub(point: this): this {
    this._state.sub(point._state);
    return this;
  }

  neg(): this {
    this._state.neg();
    return this;
  }

  mul(s: number): this {
    this._state.mul(s);
    return this;
  }

  div(s: number): this {
    this._state.div(s);
    return this;
  }

  comb(s: number, point: this): this {
    this._state.comb(s, point._state);
    return this;
  }

  get position() {
    return this._state.upper;
  }

  set position(newPosition) {
    this._state.upper.copy(newPosition);
  }

  get speed() {
    return this._state.lower;
  }

  set speed(newSpeed) {
    this._state.lower.copy(newSpeed);
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state.copy(newState);
  }

  /**
   * @brief initialize the point with position and speed
   * @param position initial position
   * @param speed initial speed
   * @return reference to this
   */
  reset(position?: Vector3, speed?: Vector3): this {
    this._state.concat(position, speed);
    return this;
  }
}

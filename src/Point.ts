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

  private _position: Vector3;

  private _speed: Vector3;

  private _state: Vector6;

  /** Construct a material point by specifying mass, position and speed **/
  constructor(mass: number, position?: Vector3, speed?: Vector3) {
    this.mass = mass;
    this._position = position ? position.clone() : Vector3.zeros;
    this._speed = speed ? speed.clone() : Vector3.zeros;
    this._state = new Vector6(...this.position.xyz, ...this.speed.xyz);
  }
  array(): number[] {
    return this._state.array();
  }

  string(): string {
    return this._state.string();
  }

  assign(...coordinates: number[]): this {
    this._position.assign(coordinates[0], coordinates[1], coordinates[2]);
    this._speed.assign(coordinates[3], coordinates[4], coordinates[5]);
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
    this.mass = point.mass;
    this._position.copy(point._position);
    this._speed.copy(point._speed);
    this._state.copy(point._state);
    return this;
  }

  clone(): this {
    return new Point(this.mass, this.position, this.speed) as this;
  }

  dim: Readonly<number> = 6;

  add(point: Point): this {
    this._position.add(point._position);
    this._speed.add(point._speed);
    this._state.add(point._state);
    return this;
  }

  sub(point: this): this {
    this._position.sub(point._position);
    this._speed.sub(point._speed);
    this._state.sub(point._state);
    return this;
  }

  neg(): this {
    this._position.neg();
    this._speed.neg();
    this._state.neg();
    return this;
  }

  mul(s: number): this {
    this._position.mul(s);
    this._speed.mul(s);
    this._state.mul(s);
    return this;
  }

  div(s: number): this {
    this._position.div(s);
    this._speed.div(s);
    this._state.div(s);
    return this;
  }

  comb(s: number, point: this): this {
    this._position.comb(s, point._position);
    this._speed.comb(s, point._speed);
    this._state.comb(s, point._state);
    return this;
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
  reset(position?: Vector3, speed?: Vector3): this {
    this._position.copy(position);
    this._speed.copy(speed);
    this._state.upper = position.xyz;
    this._state.lower = speed.xyz;
    return this;
  }
}

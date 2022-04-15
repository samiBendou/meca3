import { Vector3, Vector6 } from "../algebra";
import { BasicCurve, BufferCurve } from "../curves";

export type PointConstructor = {
  id: string;
  mass: number;
  state: Vector6;
  trajectoryLength: number;
};

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

  id: string;

  private _state: Vector6;

  private _trajectory: BufferCurve<Vector3>;

  /** Construct a material point by specifying mass, position and speed **/
  constructor(
    id: string,
    mass: number,
    state: Vector6,
    trajectory: BufferCurve<Vector3>
  ) {
    this.id = id;
    this.mass = mass;
    this._state = state;
    this._trajectory = trajectory;
  }

  update(state: Vector6) {
    this.state.copy(state);
    this.trajectory.push(state.upper);
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
    return new Point(
      this.id,
      this.mass,
      this.state.clone(),
      new BufferCurve(this.trajectory.vertices.map((v) => v.clone()))
    ) as this;
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

  get trajectory() {
    return this._trajectory;
  }

  static makePoint(data: PointConstructor): Point {
    return new Point(
      data.id,
      data.mass,
      data.state,
      BufferCurve.bufferize(
        BasicCurve.constant(data.trajectoryLength, data.state.upper)
      )
    );
  }
}

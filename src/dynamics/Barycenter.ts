import { Vector3, Vector6 } from "../algebra";
import { BufferCurve } from "../curves";
import Point from "./Point";

export default class Barycenter {
  /** mass of the point **/
  mass: number;

  id: string;

  private _state: Vector6;

  private _momentum: Vector6;

  private _trajectory: BufferCurve<Vector3>;

  constructor(id: string, points: Point[]) {
    if (points.length === 0) {
      throw Error("There must be at least one point to compute the barycenter");
    }
    this.id = id;
    this._state = points[0].state.clone();
    this._momentum = points[0].state.clone();
    this._trajectory = new BufferCurve(
      points[0].trajectory.vertices.map((p) => p.clone())
    );
    this.update(points);
  }

  update(points: Point[]) {
    this._state.reset0();
    this.mass = points.reduce((acc, point) => acc + point.mass, 0);
    points.forEach((point) => {
      this._momentum.copy(point.state).mul(point.mass);
      this._state.add(this._momentum);
    });
    this._momentum.copy(this._state);
    this._state.div(this.mass);
    this._trajectory.push(this._state.upper);
  }

  get momentum() {
    return this._momentum.lower;
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
}

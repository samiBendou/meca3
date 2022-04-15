import { Vector3, Vector6, VectorField } from "../../space3/src";
import Point from "./Point";

type Acceleration = (current: Point, time?: number) => Vector3;

export default class PointDynamics {
  private _field: VectorField<Point>;

  private _acceleration: Vector3;

  private _point: Point;

  constructor(acceleration: Acceleration) {
    this._acceleration = Vector3.zeros;
    this._point = Point.makePoint({
      id: "_point",
      mass: 0,
      state: Vector6.zeros,
      trajectoryLength: 0,
    });
    this._field = (p: Point, t: number) => {
      this._acceleration.reset0();
      this._acceleration = acceleration(p, t);
      this._point.position = p.speed;
      this._point.speed = this._acceleration;
      return this._point;
    };
  }

  get field(): VectorField<Point> {
    return this._field;
  }
}

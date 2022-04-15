import { Vector3, Vector6 } from "../../space3/src";
import { InteractionField } from "../../space3/src/InteractionSolver";
import Point from "./Point";

type Acceleration = (current: Point, other?: Point, time?: number) => Vector3;

export default class SystemDynamics {
  private _field: InteractionField<Point>;

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
    this._field = (p: Point, pts: Point[], t: number) => {
      this._point.copy(p);
      this._acceleration.reset0();
      this._acceleration = pts.reduce((acc, point) => {
        return acc.add(acceleration(p, point, t));
      }, this._acceleration);

      this._point.position = this._point.speed;
      this._point.speed = this._acceleration;
      return this._point;
    };
  }

  get field(): InteractionField<Point> {
    return this._field;
  }
}

import { Vector3, Vector6 } from "../algebra";
import { InteractionField } from "../solvers/InteractionSolver";
import Point from "./Point";

export type SystemAcceleration = (
  current: Point,
  other?: Point,
  time?: number
) => Vector3;

export default class SystemDynamics {
  private _field: InteractionField<Point>;

  private _acceleration: Vector3;

  private _point: Point;

  constructor(acceleration: SystemAcceleration) {
    this._acceleration = Vector3.zeros;
    this._point = Point.makePoint({
      id: "_point",
      mass: 0,
      state: Vector6.zeros,
      trajectoryLength: 0,
    });
    this._field = (p: Point, pts: Point[], t: number) => {
      this._acceleration.reset0();
      pts.forEach((point) => {
        this._acceleration.add(acceleration(p, point, t));
      });

      this._point.position = p.speed;
      this._point.speed = this._acceleration;
      return this._point;
    };
  }

  get field(): InteractionField<Point> {
    return this._field;
  }
}

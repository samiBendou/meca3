import { Vector3 } from "../../space3/src";
import InteractionSolver, {
  InteractionField,
} from "../../space3/src/InteractionSolver";
import Point from "./Point";

type Acceleration = (current: Point, other?: Point, time?: number) => Vector3;

export default class Field {
  points: Point[];

  solver: InteractionSolver<Point>;

  private _field: InteractionField<Point>;

  private _acceleration: Vector3;

  private _point: Point;

  constructor(points: Point[], acceleration: Acceleration) {
    this.points = points;

    this._acceleration = Vector3.zeros;
    this._point = points[0].clone();

    this._field = (p: Point, pts: Point[], t: number) => {
      this._point.copy(p);
      this._acceleration.reset0();
      this._acceleration = pts.reduce((acc, point) => {
        return acc.add(acceleration(this._point, point, t));
      }, this._acceleration);

      this._point.position = this._point.speed;
      this._point.speed = this._acceleration;
      return this._point;
    };
  }

  update(solver: InteractionSolver<Point>): this {
    const states = solver.u1;
    this.points.forEach((point, idx) => {
      point.copy(states[idx]);
    });
    return this;
  }

  get field(): InteractionField<Point> {
    return this._field;
  }
}

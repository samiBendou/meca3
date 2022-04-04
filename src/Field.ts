import { Solver, Vector3, VectorField } from "../../space3/src";
import Point from "./Point";

type AccelerationField = (
  current: Point,
  other?: Point,
  time?: number
) => Vector3;

export default class Field {
  points: Point[];

  private _field: VectorField<Point>;

  private _pointBuffer: Point;

  private _accelerationBuffer: Vector3;

  private _solvers: Solver<Point>[];

  constructor(points: Point[], field: AccelerationField, dt?: number) {
    this.points = points;

    this._pointBuffer = new Point(0);
    this._accelerationBuffer = Vector3.zeros;

    this._field = (p?: Point, t?: number) => {
      this._accelerationBuffer.reset0();
      this._accelerationBuffer = this.points.reduce((acc, point) => {
        this._pointBuffer.copy(p);
        return acc.add(field(this._pointBuffer, point, t));
      }, this._accelerationBuffer);

      p.position = this._pointBuffer.speed;
      p.speed = this._accelerationBuffer;
      return p;
    };

    this._solvers = this.points.map(
      (point) => new Solver(this._field, dt, point)
    );
  }

  /**
   * @brief updates the position of all the points
   * @details Solves a step of the ODE of the solver and update position.
   * @param dt time step for this iteration
   * @returns reference to this
   */
  update(dt?: number): this {
    const states = this.points.map((point, idx) =>
      this._solvers[idx].step(point, dt)
    );
    this.points.forEach((point, idx) => {
      point.copy(states[idx]);
    });

    return this;
  }
}

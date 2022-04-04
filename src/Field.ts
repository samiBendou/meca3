import { Solver, Vector3, VectorField } from "../../space3/src";
import Point from "./Point";

type AccelerationField = (
  acceleration: Vector3,
  point: Point,
  time?: number
) => Vector3;

export default class Field {
  points: Point[];
  private field: VectorField<Point>;
  private pointBuffer: Point;
  private accelerationBuffer: Vector3;
  private solvers: Solver<Point>[];
  constructor(points: Point[], field: AccelerationField, dt?: number) {
    this.points = points;

    this.pointBuffer = new Point(0);
    this.accelerationBuffer = Vector3.zeros;

    this.field = (p?: Point, t?: number) => {
      this.accelerationBuffer.xyz = [0, 0, 0];
      this.pointBuffer.copy(p);
      this.accelerationBuffer = field(
        this.accelerationBuffer,
        this.pointBuffer,
        t
      );
      p.position = this.pointBuffer.speed;
      p.speed = this.accelerationBuffer;
      return p;
    };

    this.solvers = this.points.map(
      (point) => new Solver(this.field, dt, point)
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
      this.solvers[idx].step(point, dt)
    );
    this.points.forEach((point, idx) => {
      point.copy(states[idx]);
    });

    return this;
  }
}

import { Solver, Vector3, Vector6, VectorField } from "../../space3/src";
import Point from "./Point";

type AccelerationField = (
  acceleration: Vector3,
  position: Vector3,
  speed: Vector3,
  time?: number
) => Vector3;

export default class Field<T extends Point> {
  points: T[];
  frame: Vector6;
  private field: VectorField<Vector6>;
  private positionBuffer: Vector3;
  private speedBuffer: Vector3;
  private accelerationBuffer: Vector3;
  private solvers: Solver<Vector6>[];
  constructor(
    points: T[],
    field: AccelerationField,
    dt?: number,
    framePosition?: Vector3,
    frameSpeed?: Vector3
  ) {
    this.points = points;

    this.frame = Vector6.zeros;
    this.frame.upper = framePosition?.xyz ?? Vector3.zeros.xyz;
    this.frame.lower = frameSpeed?.xyz ?? Vector3.zeros.xyz;

    this.accelerationBuffer = Vector3.zeros;
    this.positionBuffer = Vector3.zeros;
    this.speedBuffer = Vector3.zeros;
    this.field = (u?: Vector6, t?: number) => {
      this.positionBuffer.xyz = u.upper;
      this.speedBuffer.xyz = u.lower;
      this.accelerationBuffer.xyz = [0, 0, 0];
      this.accelerationBuffer = field(
        this.accelerationBuffer,
        this.positionBuffer,
        this.speedBuffer,
        t
      );
      u.upper = this.speedBuffer.xyz;
      u.lower = this.accelerationBuffer.xyz;
      return u;
    };

    this.solvers = this.points.map(
      (point) => new Solver(this.field, dt, point.state)
    );
  }

  /** barycenter of the points **/
  get barycenter() {
    let mass = this.points.reduce((acc, point) => acc + point.mass, 0);
    return this.points
      .reduce(
        (acc, point) => acc.add(point.position.mul(point.mass)),
        Vector3.zeros
      )
      .div(mass);
  }

  set barycenter(newCenter) {
    let center = this.barycenter;
    this.points.forEach((point) => {
      point.position = point.position.sub(center).add(newCenter);
    });
  }

  /**
   * @brief updates the position of all the points
   * @details Solves a step of the ODE of the solver and update position.
   * @param dt time step for this iteration
   * @param origin origin to set for the solution
   * @returns reference to this
   */
  update(dt?: number): this {
    const states = this.points.map((point, idx) =>
      this.solvers[idx].step(point.state, dt)
    );
    this.points.forEach((point, idx) => {
      point.state = states[idx];
    });
    return this;
  }

  /**
   * @brief changes the frame of all the points
   * @details The whole trajectory of each point is changed.
   * @param frame point to set as frame of each point
   * @return reference to this
   */
  reframe(frame: Vector6): this {
    const translation = frame.subc(this.frame);
    this.points.forEach((point) => {
      point.translate(translation);
    });
    return this;
  }
}

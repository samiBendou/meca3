import { Solver, Vector3, Vector6 } from "../../space3/src";
import Point from "./Point";

type InteractionField<T extends Point> = (
  points?: T[]
) => ((u?: Vector6, t?: number) => Vector6)[];

export default class Field<T extends Point> {
  points: T[];
  solvers: Solver<Vector6>[];
  frame: Vector6;
  field: InteractionField<T>;

  constructor(
    points: T[],
    field: InteractionField<T>,
    frame: Vector6,
    dt?: number
  ) {
    this.field = field;
    this.points = points;
    const f = field(this.points);
    this.solvers = this.points.map(
      (point, idx) => new Solver(f[idx], dt, point.trajectory.last)
    );
    this.frame = frame;
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
    const state = this.points.map((point, idx) =>
      this.solvers[idx].step(point.trajectory.last, dt)
    );
    this.points.forEach((point, idx) => {
      point.trajectory.push(state[idx]);
      point.position.assign(...state[idx].upper);
      point.speed.assign(...state[idx].lower);
    });
    // const field = this.field(this.points);
    // this.solvers.forEach((solver, idx) => {
    //   solver.f = field[idx];
    // });
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
    const posShift = new Vector3(...translation.upper);
    const speedShift = new Vector3(...translation.lower);
    this.points.forEach((point) => {
      point.trajectory.translate(translation);
      point.position.add(posShift);
      point.speed.add(speedShift);
    });
    return this;
  }
}

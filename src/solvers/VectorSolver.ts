import { List, Vectorial } from "../common/";
import Solver from "./Solver";
import Timer from "./Timer";

export type VectorField<T> = (u: T, t: number) => T;

export default class VectorSolver<T extends Vectorial & List>
  implements Solver<T, VectorField<T>>
{
  /** time dependant vector field **f** */
  field: VectorField<T>;

  timer: Timer;

  /** buffer value, stores the value of the last value of the solution */
  private _u1: T;
  private _u0: T;

  constructor(u: T, field: VectorField<T>, timer: Timer) {
    this.field = field;
    this.timer = timer;

    this._u0 = u.clone();
    this._u1 = u.clone();
  }

  step(): T {
    this._u0.copy(this._u1);
    this.timer.step((dt, t) => {
      this._u1.comb(dt, this.field(this._u1, t));
    });
    return this._u1;
  }

  advance(duration: number): T {
    this._u0.copy(this._u1);
    this.timer.advance(duration, (dt, t) => {
      this._u1.comb(dt, this.field(this._u1, t));
    });
    return this._u1;
  }

  iterate(iterations: number): T {
    this._u0.copy(this._u1);
    this.timer.iterate(iterations, (dt, t) => {
      this._u1.comb(dt, this.field(this._u1, t));
    });
    return this._u1;
  }

  get u1() {
    return this._u1;
  }

  get u0() {
    return this._u0;
  }

  set u0(u: T) {
    this.u0.copy(u);
    this.u1.copy(u);
  }
}

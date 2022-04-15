import { List, Vectorial } from "../common/";
import Timer from "./Timer";

export type InteractionField<T> = (one: T, all: T[], t: number) => T;

export default class InteractionSolver<T extends Vectorial & List> {
  /** time dependant vector field **f** */
  field: InteractionField<T>;
  timer: Timer;

  /** buffer value, stores the value of the last value of the solution */
  private _u1: T[];
  private _u0: T[];

  constructor(u0: T[], field: InteractionField<T>, timer: Timer) {
    this.field = field;
    this.timer = timer;

    this._u0 = u0.map((initial: T) => initial.clone());
    this._u1 = u0.map((initial: T) => initial.clone());
  }

  forEach(action: (x0: T, x1: T, u0: T[], u1: T[], idx: number) => void): void {
    for (let idx = 0; idx < this._u0.length; idx++) {
      action(this._u0[idx], this._u1[idx], this._u0, this._u1, idx);
    }
  }

  forEach0(action: (x0: T, u0: T[], idx: number) => void): void {
    for (let idx = 0; idx < this._u0.length; idx++) {
      action(this._u0[idx], this._u0, idx);
    }
  }

  forEach1(action: (x1: T, u1: T[], idx: number) => void): void {
    for (let idx = 0; idx < this._u1.length; idx++) {
      action(this._u1[idx], this._u1, idx);
    }
  }

  step(): T[] {
    this.forEach((x0, x1) => {
      x0.copy(x1);
    });
    this.timer.step((dt, t) => {
      this.forEach1((x1, u1) => {
        x1.comb(dt, this.field(x1, u1, t));
      });
    });
    return this._u1;
  }

  advance(duration: number): T[] {
    this.forEach((x0, x1) => {
      x0.copy(x1);
    });
    this.timer.advance(duration, (dt, t) => {
      this.forEach1((x1, u1) => {
        x1.comb(dt, this.field(x1, u1, t));
      });
    });
    return this._u1;
  }

  iterate(iterations: number): T[] {
    this.forEach((x0, x1) => {
      x0.copy(x1);
    });
    this.timer.iterate(iterations, (dt, t) => {
      this.forEach1((x1, u1) => {
        x1.comb(dt, this.field(x1, u1, t));
      });
    });
    return this._u1;
  }

  get u1() {
    return this._u1;
  }

  get u0() {
    return this._u0;
  }

  set u0(u: T[]) {
    this.forEach((x0, x1, _u0, _u1, idx) => {
      x0.copy(u[idx]);
      x1.copy(u[idx]);
    });
  }
}

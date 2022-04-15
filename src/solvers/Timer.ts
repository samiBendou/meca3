type TimerAction = (dt: number, t: number, idx: number) => void;

export default class Timer {
  dt: number;

  private _t1: number;
  private _t0: number;

  private _idx1: number;
  private _idx0: number;

  constructor(dt: number, t: number = 0) {
    this.dt = dt;

    this._t0 = t;
    this._t1 = t;

    this._idx0 = Math.floor(t / dt);
    this._idx1 = Math.floor(t / dt);
  }

  step(action: TimerAction) {
    action(this.dt, this._t1, this._idx1);
    this._t1 += this.dt;
    this._idx1++;
  }

  advance(duration: number, action: TimerAction) {
    const iterations = duration / this.dt;
    this._t0 = this._t1;
    this._idx0 = this._idx1;
    for (; this._idx1 < iterations + this._idx0; this._idx1++) {
      action(this.dt, this._t1, this._idx1);
      this._t1 = this._idx1 * this.dt + this._t0;
    }
    this._t1 = this._t0 + duration;
  }

  iterate(iterations: number, action: TimerAction) {
    this._t0 = this._t1;
    this._idx0 = this._idx1;
    for (; this._idx1 < iterations + this._idx0; this._idx1++) {
      action(this.dt, this._t1, this._idx1);
      this._t1 = this._idx1 * this.dt + this._t0;
    }
    this._t1 = this._t0 + iterations * this.dt;
  }

  get t1() {
    return this._t1;
  }

  get t0() {
    return this._t0;
  }

  set t0(t: number) {
    this._t0 = t;
    this._t1 = t;

    this._idx0 = Math.floor(t / this.dt);
    this._idx1 = Math.floor(t / this.dt);
  }

  get idx1() {
    return this._idx1;
  }

  get idx0() {
    return this._idx0;
  }

  set idx0(idx: number) {
    this._t0 = idx * this.dt;
    this._t1 = idx * this.dt;

    this._idx0 = idx;
    this._idx1 = idx;
  }
}

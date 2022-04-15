import { List, Vectorial } from "../common/";
import Timer from "./Timer";

export type VectorField<T> = (u: T, t: number) => T;

/**
 * ## Brief
 * [[Solver]] is a tool class to represent ordinary differential equation between vector-valued functions
 *
 * ### Main features
 * - First, second and third order non-linear solving
 * - Bufferization of result for best performance
 *
 * ## Getting started
 * A solver is an object that models an ode between any object of type [[Vector]]. The equation has the following form
 *
 * ![ODE](media://ode.png)
 *
 * Where `u` is an unknown vector valued function and `f` a smooth time dependant vector field.
 *
 * ### Initialize a solver
 * Solver objects are initialized with the value of the initial condition `initial`, the function `f` and the time step `dt`
 * Therefore to initialize a solver, simply choose values of theses parameters that models your problem.
 *
 * #### Example
 * ```js
 * let f = u => u; // equation du/dt = u first order linear equation
 * let dt = 0.1; // time step
 * let initial = new Vector3(1, 0, 0); // initial condition
 * let solver = new Solver(f, dt, initial),
 * console.log(solver.dt) // prints 0.1
 * ```
 *
 * ### Solve equations
 * Once you've initialized the solver, you can start compute solutions of your equation. There is two ways to do that :
 * - Compute values step-by-step
 * - Compute value after a maximum duration
 *
 * ```js
 * let u = solver.step();
 * let v = solver.solve(tmax);
 * ```
 *
 * You can change initial condition and time step each time you call `step` and `solve` methods.
 *
 * ```js
 * let initial = Vector3(2, 3, 7);
 * let dt = 0.1;
 * let u = solver.step(initial, dt);
 * ```
 *
 * **Note** currently only Euler's explicit method is provided.
 *
 * ### Time dependant equations
 *
 * Time dependant equations uses the member `t` to count time from the last initialisation/reset of the solver.
 * Each time an equation is solved, `t` is set to it's final value after solving. If you want to reset the value of `t`,
 * call the `reset` method.
 *
 */
export default class VectorSolver<T extends Vectorial & List> {
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

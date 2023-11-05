import Timer from "./Timer";

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
export default interface Solver<T, U> {
  u0: T;
  readonly u1: T;

  timer: Timer;
  field: U;

  step(): T;
  advance(duration: number): T;
  iterate(iterations: number): T;
}

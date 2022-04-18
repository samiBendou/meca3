import Timer from "./Timer";

export default interface Solver<T, U> {
  u0: T;
  readonly u1: T;

  timer: Timer;
  field: U;

  step(): T;
  advance(duration: number): T;
  iterate(iterations: number): T;
}

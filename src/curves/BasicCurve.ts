import { Vector } from "../algebra";
import { Curve, mapArray, Matrix } from "../common/";

export default class BasicCurve<T extends Vector> implements Curve<T> {
  /** position vectors representing the curve */
  vertices: T[];

  /** explicitly construct a curve by giving, vertices, origins and time step(s) */
  constructor(vertices: T[] = []) {
    this.vertices = vertices;
  }

  get(i: number): T {
    return this.vertices[i];
  }
  set(i: number, position: T): this {
    this.vertices[i].copy(position);
    return this;
  }

  get first() {
    return this.vertices[0];
  }

  set first(newFirst) {
    this.vertices[0].copy(newFirst);
  }

  get last() {
    return this.vertices[this.vertices.length - 1];
  }

  set last(newLast) {
    this.vertices[this.vertices.length - 1].copy(newLast);
  }

  /** position vector of the curve next to last **/
  get nexto() {
    return this.vertices[this.vertices.length - 2];
  }

  set nexto(newLast) {
    this.vertices[this.vertices.length - 2].copy(newLast);
  }

  push(position: T): this {
    this.vertices.push(position.clone());
    return this;
  }

  pop(): T {
    return this.vertices.pop();
  }

  clear(): this {
    this.vertices = [];
    return this;
  }

  translate(u: T) {
    this.vertices.forEach((position) => {
      position.add(u);
    });
    return this;
  }

  transform<U extends Matrix<T>>(m: U) {
    this.vertices.forEach((position) => {
      m.prodv(position);
    });
    return this;
  }

  affine<U extends Matrix<T>>(m: U, v: T) {
    this.vertices.forEach((position) => {
      m.prodv(position).add(v);
    });
    return this;
  }

  indexAt(x: number = 1): [number, number, number] {
    const scale = x * (this.vertices.length - 1),
      i0 = Math.floor(scale),
      i1 = Math.min(this.vertices.length - 1, i0 + 1);
    return [i0, i1, scale - i0];
  }

  positionAt(x: number = 1): T {
    const [i0, i1, dx] = this.indexAt(x);
    return (this.vertices[i0].clone() as T).lerp(this.vertices[i1], dx) as T;
  }

  lengthAt(x: number = 1): number {
    const [i0, i1, dx] = this.indexAt(x);
    let length = 0;
    for (let i = 1; i <= i0; i++) {
      length += this.vertices[i].dist(this.vertices[i - 1]);
    }

    return length + this.vertices[i1].dist(this.vertices[i0]) * dx;
  }

  /**
   * @brief generates a constant curve ie. a point.
   * @details The position is constant and the step is non zero
   * @param u position of the point
   * @param n number of samples
   * @param dt time step
   */
  static constant<T extends Vector>(n: number, u: T) {
    const vectors = mapArray(n, () => u.clone());
    return new BasicCurve<T>(vectors);
  }

  /**
   * @brief generates a curve that is the graph of a function.
   * @details Samples the function `f` from `f(a)` to `f(b)` with constant time step
   * @param f vector valued function that depends only on time.
   * @param t0 starting point to evaluate `f`
   * @param t1 ending point to evaluate `f`
   * @param dt constant time step to sample `f`
   */
  static graph<T extends Vector>(
    f: (t: number) => T,
    dt: number,
    t0: number,
    t1: number
  ) {
    const vectors = mapArray((t1 - t0) / dt, (idx) => f(idx * dt + t0));
    return new BasicCurve<T>(vectors);
  }

  /**
   * @brief linear trajectory
   * @details Computes a linear trajectory starting from the given `b` with director coefficient `a`.
   * The observer is considered as immobile
   * @param count number of samples
   * @param dt sampling step
   * @param a director coefficient
   * @param b offset from origin
   * @return value of linear trajectory
   */
  static linear<T extends Vector>(n: number, dt: number, a: T, b: T) {
    const vectors = mapArray(n, (idx) => (b.clone() as T).comb(idx * dt, a));
    return new BasicCurve<T>(vectors);
  }

  static transformational<T extends Vector, U extends Matrix<T>>(
    n: number,
    initial: T,
    transformation: U
  ) {
    const current = initial.clone();
    const next = initial.clone();
    const vectors = mapArray(n, () => {
      current.copy(next);
      transformation.prodv(next);
      return current.clone();
    });
    return new BasicCurve<T>(vectors);
  }

  static differential<T extends Vector, U extends Matrix<T>>(
    n: number,
    dt: number,
    initial: T,
    transformation: (t: number) => U
  ) {
    const vectors = mapArray(n, (idx) =>
      transformation(idx * dt).prodv(initial.clone())
    );
    return new BasicCurve<T>(vectors);
  }
}

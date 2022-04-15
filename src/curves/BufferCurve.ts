import { Vector } from "../algebra";
import { Curve } from "../common/";
import BasicCurve from "./BasicCurve";

export default class BufferCurve<T extends Vector>
  extends BasicCurve<T>
  implements Curve<T>
{
  private _addIndex: number;

  /** explicitly construct a curve by giving, vertices, origins and time step(s) */
  constructor(vertices: T[] = []) {
    super(vertices);
    this._addIndex = 0;
  }

  get(i: number): T {
    return this.vertices[(i + this._addIndex) % this.vertices.length];
  }

  set(i: number, position: T): this {
    this.vertices[(i + this._addIndex) % this.vertices.length].copy(position);
    return this;
  }

  get first() {
    return this.vertices[this._addIndex];
  }

  set first(newFirst) {
    this.vertices[this._addIndex].copy(newFirst);
  }

  get last() {
    return this.vertices[this._lastIndex];
  }

  set last(newLast) {
    this.vertices[this._lastIndex].copy(newLast);
  }

  get nexto() {
    return this.vertices[this._nextoIndex];
  }

  set nexto(newNexto) {
    this.vertices[this._nextoIndex].copy(newNexto);
  }

  /** index of last position in trajectory **/
  private get _lastIndex() {
    return this._addIndex > 0 ? this._addIndex - 1 : this.vertices.length - 1;
  }

  /** index of nexto last position in trajectory **/
  get _nextoIndex() {
    return this._addIndex > 1
      ? this._addIndex - 2
      : this.vertices.length - 2 + this._addIndex;
  }

  push(position: T): this {
    this.vertices[this._addIndex].copy(position);
    this._addIndex = (this._addIndex + 1) % this.vertices.length;
    return this;
  }

  pop(): T {
    const position = this.vertices[this._lastIndex];
    this._addIndex =
      this._addIndex === 0 ? this.vertices.length - 1 : this._addIndex - 1;
    return position;
  }

  clear(): this {
    this._addIndex = 0;
    return this;
  }

  indexAt(x: number = 1): [number, number, number] {
    const scale = x * (this.vertices.length - 1),
      i0 = Math.floor(scale + this._addIndex) % this.vertices.length,
      i1 = Math.min(this.vertices.length - 1, i0 + 1);
    return [i0, i1, scale - Math.floor(scale)];
  }

  positionAt(x: number = 1): T {
    const [i0, i1, dx] = this.indexAt(x);
    return this.vertices[i0].clone().lerp(this.vertices[i1], dx) as T;
  }

  lengthAt(x: number = 1): number {
    const [i0, i1, dx] = this.indexAt(x);
    let length = 0;
    for (let i = this._addIndex; i <= i0; i++) {
      length += this.vertices[i].dist(this.vertices[i - 1]);
    }

    return length + this.vertices[i1].dist(this.vertices[i0]) * dx;
  }

  static bufferize<T extends Vector>(curve: BasicCurve<T>) {
    return new BufferCurve(curve.vertices);
  }
}

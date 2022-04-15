export default interface Twice<T> {
  /** upper component */
  upper: T;

  /** lower component */
  lower: T;

  concat(upper: T, lower: T): this;
}

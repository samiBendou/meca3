/**
 *
 * ## Brief
 *
 * Standardizes components accessors between objects of dimension 9.
 *
 * ## Getting Started
 *
 * ### Components accessors
 * Access a component using an equivalent of cartesian coordinates `u.ij` where :
 * - `i` is an index which value can be `x`, `y`, `z`
 * - `j` is an index which value can be `x`, `y`, `z`
 *
 * #### Example
 * ```js
 * m.xx = 2;
 * s = m.yz + u.x;
 * z = m.zz;
 * ```
 */
export default interface Object9<T> {
  xx: T;
  yx: T;
  zx: T;
  xy: T;
  yy: T;
  zy: T;
  xz: T;
  yz: T;
  zz: T;
}

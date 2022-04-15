export default interface Metrical {
  /** magnitude of the vector `||u||` */
  mag: number;

  /** squared magnitude of the vector `u . u` */
  mag2: number;

  /** normalizes a vector `u / ||u||` */
  norm(): this;

  /** usual dot product of two vector `u . v` */
  dot(vector: this): number;

  /** distance distance between two vectors `d2(u, v)` */
  dist(vector: this): number;

  /** distance between two vectors given by norm 1 `d1(u, v)` */
  dist1(vector: this): number;

  /** squared distance between two vectors given by norm 2 `d2(u, v)**2` */
  dist2(vector: this): number;

  /** `true` if the distance 1 between vectors is 0 */
  equal1(vector: this): boolean;

  /** `true` if the distance 2 between vectors is 0 */
  equal2(vector: this): boolean;

  /** `true` if the vector has a 0 norm 1 */
  zero1(): boolean;

  /** `true` if the vector has a 0 norm 2 */
  zero2(): boolean;
}

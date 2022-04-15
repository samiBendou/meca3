export default interface Interpolable {
  /**
   * @brief linear interpolation between two vectors `u + (v - u) * s`
   * @details `s` must be between 0 and 1.
   * @param target destination of interpolation
   * @param s parameter of the interpolation.
   */
  lerp(target: this, s: number): this;

  /**
   * @brief Hermite's interpolation between two vectors
   * @details `s` must be between 0 and 1. Starting vector is `this`.
   * @param target destination of interpolation
   * @param vector1 control point number 1
   * @param vector2 control point number 2
   * @param s parameter of the interpolation.
   */
  herp(target: this, vector1: this, vector2: this, s: number): this;

  /**
   * @brief Bezier's interpolation between two vectors
   * @details `s` must be between 0 and 1. Starting vector is `this`.
   * @param target destination of interpolation
   * @param vector1 control point number 1
   * @param vector2 control point number 2
   * @param s parameter of the interpolation.
   */
  berp(target: this, vector1: this, vector2: this, s: number): this;

  /** derivative between the two vectors with given step `(u - v) / ds`*/
  der(ds: number, vector: this): this;
}

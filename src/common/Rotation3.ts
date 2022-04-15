import { Vector3 } from "..";

export default interface Rotation3 {
  /**
   * @brief rotates the vector around `x` axis
   * @details See [[Object3]] for more details.
   * @param theta angle of rotation
   * @param cos `y` rotation function of the rotation
   * @param sin `z` rotation function of the rotation
   */
  rotX(
    theta: number,
    cos?: (x: number) => number,
    sin?: (x: number) => number
  ): this;

  /**
   * @brief rotation around `y` axis
   * @details See [[Object3]] for more details.
   * @param theta angle of rotation
   * @param cos `x` rotation function of the rotation
   * @param sin `z` rotation function of the rotation
   */
  rotY(
    theta: number,
    cos?: (x: number) => number,
    sin?: (x: number) => number
  ): this;

  /**
   * @brief rotation around `z` axis
   * @details See [[Object3]] for more details.
   * @param theta angle of rotation
   * @param cos `x` rotation function of the rotation
   * @param sin `y` rotation function of the rotation
   */
  rotZ(
    theta: number,
    cos?: (x: number) => number,
    sin?: (x: number) => number
  ): this;

  /**
   * @brief rotation around `u` axis
   * @details `ox` and `oy` are such that they form a orthonormal basis `(ox, oy, u)`.
   * See [[Object3]] for more details.
   * @param u axis of rotation
   * @param theta angle of rotation
   * @param cos `ox` rotation function of the rotation
   * @param sin `oy` rotation function of the rotation
   */
  rot(
    other: Vector3,
    theta: number,
    cos?: (x: number) => number,
    sin?: (x: number) => number
  ): this;
}

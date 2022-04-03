import { BufferCurve, Vector3, Vector6 } from "../../space3/src";

/**
 * @brief material point
 * @details `Point` class represents physics _material points_ model in a _frame_.
 *
 * `Points` must be initialized using the `init` method in order to performed trajectory updates.
 *
 * - **Manipulate the trajectory** of the point
 *
 * - **Manipulate speed and position** of the point
 *
 * - **Change frame** of the point
 *
 * - Move point by giving a solver to **generate the trajectory**
 */
export default class Point {
  /** trajectory of the point **/
  trajectory: BufferCurve<Vector6>;

  position: Vector3;

  speed: Vector3;

  /** mass of the point **/
  mass: number;

  /** Construct a material point by giving a mass and optionally a trajectory **/
  constructor(
    position: Vector3,
    speed: Vector3,
    trajectory: BufferCurve<Vector6>,
    mass = 1.0
  ) {
    this.mass = mass;
    this.position = position;
    this.speed = speed;
    this.trajectory = trajectory;
  }

  /**
   * @brief initialize the point with position and speed
   * @param u0 initial position
   * @param v0 initial speed
   * @return reference to this
   */
  init(position: Vector3, speed: Vector3): this {
    const state = new Vector6(...position.array(), ...speed.array());
    this.trajectory.last = state;
    this.position.copy(position);
    this.speed.copy(speed);
    return this;
  }
}

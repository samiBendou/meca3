import { Camera, Quaternion, Spherical, Vector2, Vector3 } from "three";

const UP_VECTOR = new Vector3(0, 1, 0);

export default class OrbitControls {
  object: Camera;
  initial: Vector3;

  private _sphericalDelta = new Spherical();
  private _spherical = new Spherical();

  private _offset = new Vector3();
  private _quat = new Quaternion();
  private _quatInverse = new Quaternion();

  private _rotateStart = new Vector2();
  private _rotateEnd = new Vector2();
  private _rotateDelta = new Vector2();

  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  minPolarAngle = 0;
  maxPolarAngle: number = Math.PI;

  // How far you can orbit horizontally, upper and lower limits.
  // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
  minAzimuthAngle = -Infinity;
  maxAzimuthAngle = Infinity;

  constructor(object: Camera) {
    this.object = object;
    this.initial = this.object.position.clone();
    this.update();
  }

  rotateLeft(rad: number) {
    this._sphericalDelta.theta -= rad;
  }

  rotateUp(rad: number) {
    this._sphericalDelta.phi -= rad;
  }

  rotateCartesian(x: number, y: number, height: number) {
    this._rotateEnd.set(x, y);
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart);

    this._sphericalDelta.theta -= (2 * Math.PI * this._rotateDelta.x) / height;
    this._sphericalDelta.phi -= (2 * Math.PI * this._rotateDelta.y) / height;

    this._rotateStart.copy(this._rotateEnd);
  }

  reset() {
    this.object.position.copy(this.initial);
    this.object.lookAt(0, 0, 0);
  }

  update() {
    this._offset.set(0, 0, 0);

    // so camera.up is the orbit axis
    this._quat.setFromUnitVectors(this.object.up, UP_VECTOR);
    this._quatInverse.copy(this._quat).inverse();

    this._offset.copy(this.object.position);

    // rotate offset to "y-axis-is-up" space
    this._offset.applyQuaternion(this._quat);

    // angle from z-axis around y-axis
    this._spherical.setFromVector3(this._offset);

    this._spherical.theta += this._sphericalDelta.theta;
    this._spherical.phi += this._sphericalDelta.phi;

    // restrict theta to be between desired limits
    this._spherical.theta = Math.max(
      this.minAzimuthAngle,
      Math.min(this.maxAzimuthAngle, this._spherical.theta)
    );

    // restrict phi to be between desired limits
    this._spherical.phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, this._spherical.phi)
    );

    this._spherical.makeSafe();
    this._offset.setFromSpherical(this._spherical);
    // rotate offset back to "camera-up-vector-is-up" space
    this._offset.applyQuaternion(this._quatInverse);
    this.object.position.copy(this._offset);
    this.object.lookAt(0, 0, 0);

    this._sphericalDelta.set(0, 0, 0);
  }
}

import { Matrix3, Vector3 } from "meca3";

const RAD_DEG = Math.PI / 180;

export type OrbitConstructor = {
  mu: number;
  apoapsis: number;
  periapsis: number;
  argument: number;
  inclination: {
    value: number;
    argument: number;
  };
};

export default class Orbit {
  readonly mu: number;
  readonly apoapsis: number;
  readonly periapsis: number;
  readonly argument: number;
  readonly inclination: {
    readonly value: number;
    readonly argument: number;
  };

  readonly semiMajor: number;
  readonly semiMinor: number;
  readonly eccentricity: number;
  readonly isDegenerated: boolean;

  constructor(orbit: OrbitConstructor) {
    this.mu = orbit.mu;
    this.apoapsis = orbit.apoapsis;
    this.periapsis = orbit.periapsis;
    this.argument = orbit.argument * RAD_DEG;
    this.inclination = {
      value: orbit.inclination.value * RAD_DEG,
      argument: orbit.inclination.argument * RAD_DEG,
    };
    this.semiMajor = 0.5 * (orbit.apoapsis + orbit.periapsis);
    this.semiMinor = Math.sqrt(orbit.apoapsis * orbit.periapsis);
    this.eccentricity =
      (orbit.apoapsis - orbit.periapsis) / (orbit.apoapsis + orbit.periapsis) ||
      0;
    this.isDegenerated =
      this.semiMinor < Number.EPSILON || this.semiMajor < Number.EPSILON;
  }

  radiusAt = (trueAnomaly: number): number => {
    const sm = this.semiMajor;
    const epsilon = this.eccentricity;
    return (
      (sm * (1 - epsilon * epsilon)) / (1 + epsilon * Math.cos(trueAnomaly))
    );
  };

  flightAngleAt = (trueAnomaly: number): number => {
    const epsilon = this.eccentricity;
    const ec = epsilon * Math.cos(trueAnomaly);
    return Math.acos(
      Math.min(1, (1 + ec) / Math.sqrt(1 + epsilon * epsilon + 2 * ec))
    );
  };

  positionAt = (trueAnomaly: number): Vector3 => {
    const mag = this.radiusAt(trueAnomaly);
    const nodeAxis = Vector3.ex.rotZ(this.inclination.argument);
    const rotationNode = Matrix3.rot(nodeAxis, this.inclination.value);
    const rotationInclination = Matrix3.rotZ(this.argument);
    const direction = Vector3.ex.mul(mag).rotZ(trueAnomaly);
    return rotationNode.prodv(rotationInclination.prodv(direction));
  };

  speedAt = (trueAnomaly: number): Vector3 => {
    if (this.isDegenerated) {
      return Vector3.zeros;
    }
    const mag = Math.sqrt(
      this.mu * (2 / this.radiusAt(trueAnomaly) - 1 / this.semiMajor)
    );
    const phi = trueAnomaly + Math.PI / 2 - this.flightAngleAt(trueAnomaly);
    const nodeAxis = Vector3.ex.rotZ(this.inclination.argument);
    const rotationNode = Matrix3.rot(nodeAxis, this.inclination.value);
    const rotationInclination = Matrix3.rotZ(this.argument);
    const direction = Vector3.ex.mul(mag).rotZ(phi);
    return rotationNode.prodv(rotationInclination.prodv(direction));
  };
}

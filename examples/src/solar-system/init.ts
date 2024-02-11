import { Point, Vector3 } from "meca3";
import { OrbitalBody } from "./data";

export function initBodiesRotation(
  orbits: OrbitalBody[],
  points: Point[],
  spheres: THREE.Mesh[]
) {
  spheres.forEach((sphere, idx) => {
    const orbit = orbits[idx];
    const point = points[idx];
    const position = point.state.upper;
    const unit = Vector3.er(position);
    const currentInclination = Math.atan2(unit.z, Vector3.erxy(position).mag);
    const tilt = (Math.PI / 180) * orbit.rotation.tilt;
    sphere.rotateX(Math.PI / 2 - currentInclination + tilt);
  });
}

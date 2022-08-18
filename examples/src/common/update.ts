import { Barycenter, Point, Solver, Timer } from "meca3";
import * as THREE from "three";
import { OrthographicCamera } from "three";
import { Duration, UnitPrefix, UNIT_MAP } from "./constants";
import Settings, { Frame } from "./settings";
import { SettingsDom } from "./types";

function framePosition(frame: Frame, points: Point[], barycenter: Barycenter) {
  switch (frame) {
    case null:
      return new THREE.Vector3(0, 0, 0);
    case "barycenter":
      return new THREE.Vector3(...barycenter.position.xyz);
    default:
      return new THREE.Vector3(...points[frame].position.xyz);
  }
}

function frameTrajectory(
  frame: Frame,
  points: Point[],
  barycenter: Barycenter
) {
  switch (frame) {
    case null:
      return null;
    case "barycenter":
      return barycenter.trajectory;
    default:
      return points[frame].trajectory;
  }
}

function frameLabel(frame: Frame, points: Point[]) {
  switch (frame) {
    case null:
      return "fixed";
    case "barycenter":
      return "barycenter";
    default:
      return points[frame].id;
  }
}

export function makeTime(secs: number) {
  const years = secs / Duration.Year;
  const months = secs / Duration.Month;
  const days = secs / Duration.Day;
  const hours = secs / Duration.Hour;
  const minutes = secs / Duration.Minutes;
  if (years >= 1) {
    return `${years.toFixed(2)} years`;
  }
  if (months >= 1) {
    return `${months.toFixed(2)} m ${Math.floor(months % 30)} d`;
  }
  if (days >= 1) {
    return `${Math.floor(days)} d ${Math.floor(hours % 24)} h`;
  }
  if (hours >= 1) {
    return `${Math.floor(hours)} h ${Math.floor(minutes % 60)} m`;
  }
  if (minutes >= 1) {
    return `${Math.floor(minutes)} m ${Math.floor(secs % 60)} s`;
  }
  const { value, unit } = makeUnit(secs);
  return `${value.toFixed(2)} ${unit}s`;
}

export function makeUnit(si: number) {
  const exp = Math.floor(Math.log10(si));
  if (exp < 3 && exp >= 0) {
    return { value: si, unit: UnitPrefix.None };
  }
  if (exp >= 24) {
    return { value: si / 1e9, unit: UnitPrefix.Giga };
  }
  if (exp <= -24) {
    return { value: si / 1e-9, unit: UnitPrefix.Nano };
  }
  const rem = exp % 3;
  const exp3 = exp - rem + (exp < 0 && rem !== 0 ? -3 : 0);
  return { value: si * Math.pow(10, -exp3), unit: UNIT_MAP[exp3] };
}

export function updateSimulation<T>(
  points: Point[],
  barycenter: Barycenter,
  solver: Solver<Point[], T>,
  settings: Settings
) {
  // updating the position and speed of the points
  solver.timer.dt = settings.speed / settings.samples;
  const states = solver.advance(settings.speed);
  points.forEach((point, idx) => {
    point.update(states[idx].state);
  });
  barycenter.update(points);
}

export function updateSpheresMesh(
  points: Point[],
  barycenter: Barycenter,
  spheres: THREE.Mesh[],
  settings: Settings
) {
  // updating spheres position in sphere according to current position of points in field
  const frame = framePosition(settings.frame, points, barycenter);
  [barycenter, ...points].forEach((point, idx) => {
    const position = point.position.xyz;
    spheres[idx].position
      .set(...position)
      .sub(frame)
      .multiplyScalar(settings.scale);
  });
}

export function updateLinesMesh(
  points: Point[],
  barycenter: Barycenter,
  lines: THREE.Line[],
  settings: Settings
) {
  const frame = frameTrajectory(settings.frame, points, barycenter);
  const zero = new THREE.Vector3(0, 0, 0);
  [barycenter, ...points].forEach((point, idx) => {
    const geometry = lines[idx].geometry as THREE.Geometry;
    const trajectory = point.trajectory;
    geometry.vertices.forEach((vertex, vIdx) => {
      const position = trajectory.get(vIdx).xyz;
      const pos =
        frame === null ? zero : new THREE.Vector3(...frame.get(vIdx).xyz);
      vertex
        .set(...position)
        .sub(pos)
        .multiplyScalar(settings.scale);
    });
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    lines[idx].computeLineDistances();
  });
}

export function updateAxesMesh(
  camera: OrthographicCamera,
  frame: THREE.Mesh[],
  scaleF: number
) {
  const scale = (camera.top - camera.bottom) / camera.zoom / 800;
  const transfer = scale / scaleF;
  frame.forEach((mesh) => {
    mesh.geometry.scale(transfer, transfer, transfer);
    mesh.position.multiplyScalar(transfer);
  });
  return scale;
}

export function updateSettingsDom(
  dom: SettingsDom,
  settings: Settings,
  points: Point[],
  barycenter: Barycenter,
  timer: Timer
) {
  dom.frame.innerText = frameLabel(settings.frame, points);
  dom.samples.innerText = settings.samples.toFixed(0);
  dom.dt.innerText = makeTime(timer.dt);
  dom.delta.innerText = makeTime(settings.speed);
  dom.momentum.innerText = barycenter.momentum.mag.toPrecision(5);
  dom.elapsed.innerText = makeTime(timer.t1);

  const { value, unit } = makeUnit(200 / settings.scale);
  dom.scale.innerText = `${value.toPrecision(4)} ${unit}m`;
}

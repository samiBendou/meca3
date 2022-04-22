import Stats from "stats.js";
import * as THREE from "three";
import { OrthographicCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Barycenter,
  Point,
  PointAcceleration,
  PointConstructor,
  PointDynamics,
  SystemAcceleration,
  SystemDynamics,
} from "../../src/dynamics";
import {
  ArraySolver,
  InteractionSolver,
  Solver,
  Timer,
} from "../../src/solvers";

export type Settings = {
  scale: number; // scaling factor to represent bodies in animation
  frame: number | null | "barycenter"; // reference frame body index
  speed: number; // simulation speed
  samples: number; // simulation steps per frame
};

export type SettingsDom = {
  frame: HTMLSpanElement;
  scale: HTMLSpanElement;
  samples: HTMLSpanElement;
  dt: HTMLSpanElement;
  delta: HTMLSpanElement;
  elapsed: HTMLSpanElement;
};

export type Body = {
  radius: number;
  color: Color;
} & PointConstructor;

export type Frame = number | null | "barycenter";

export enum Axis {
  X,
  Y,
  Z,
}

export enum Color {
  Red = 0xff0000,
  Green = 0x00ff00,
  Blue = 0x0000ff,
  Yellow = 0xffff00,
  Cyan = 0x00ffff,
  Magenta = 0xff00ff,
  Black = 0x000000,
  White = 0xffffff,
}

export enum Duration {
  Minutes = 60,
  Hour = 3600,
  Day = 86400,
  Month = 2592000,
  Year = 31104000,
}

export const AXIS_COLORS = [Color.Red, Color.Green, Color.Blue];
export const AXIS_UNIT_LENGTH = 20;
export const AXIS_UNIT_SIDE = 2;
export const AXIS_MAX_LENGTH = 100000;

export const BODY_COLORS = [
  0xffff00, 0x00ffff, 0xff00ff, 0x111111, 0x333333, 0x555555,
];

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
    return `${months.toFixed(2)} months`;
  }
  if (days >= 1) {
    return `${days.toFixed(2)} days`;
  }
  if (hours >= 1) {
    return `${hours.toFixed(2)} hours`;
  }
  if (minutes >= 1) {
    return `${minutes.toFixed(2)} mins`;
  }
  return `${secs.toPrecision(2)} secs`;
}

function coordinatesFromAxis(axis: Axis, max: number, min: number) {
  const w = axis == Axis.X ? max : min;
  const h = axis == Axis.Y ? max : min;
  const d = axis == Axis.Z ? max : min;
  return [w, h, d];
}

export function initStats() {
  const stats = new Stats();

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  return stats;
}

export function initClock() {
  const clock = new THREE.Clock();
  clock.start();
  return clock;
}

export function initSettingsDom(): SettingsDom {
  return {
    frame: document.getElementById("frame"),
    scale: document.getElementById("scale"),
    samples: document.getElementById("samples"),
    delta: document.getElementById("delta"),
    dt: document.getElementById("dt"),
    elapsed: document.getElementById("elapsed"),
  };
}

export function initSystemSimulation(
  data: PointConstructor[],
  acceleration: SystemAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.map((d) => Point.makePoint(d));
  const { field } = new SystemDynamics(acceleration);
  const solver = new InteractionSolver(points, field, new Timer(dt));
  const barycenter = new Barycenter("barycenter", points);
  return { points, solver, barycenter };
}

export function initPointSimulation(
  data: PointConstructor[],
  acceleration: PointAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.map((d) => Point.makePoint(d));
  const { field } = new PointDynamics(acceleration);
  const solver = new ArraySolver(points, field, new Timer(dt));
  const barycenter = new Barycenter("barycenter", points);
  return { points, solver, barycenter };
}

export function initUnitMesh(axis: Axis) {
  const [w, h, d] = coordinatesFromAxis(axis, AXIS_UNIT_LENGTH, AXIS_UNIT_SIDE);
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: AXIS_COLORS[axis],
  });
  const mesh = new THREE.Mesh(geometry, material);
  const [x, y, z] = coordinatesFromAxis(axis, AXIS_UNIT_LENGTH / 2, 0);
  mesh.position.set(x, y, z);
  return mesh;
}

export function initAxisMesh(axis: Axis) {
  const [w, h, d] = coordinatesFromAxis(axis, AXIS_MAX_LENGTH, AXIS_UNIT_SIDE);
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: AXIS_COLORS[axis],
    opacity: 0.4,
    transparent: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function initCenterMesh() {
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  return new THREE.Mesh(geometry, material);
}

export function initFrameMesh(axes?: Axis[]) {
  const visibleAxes = axes ?? [Axis.X, Axis.Y, Axis.Z];
  return [
    initCenterMesh(),
    ...visibleAxes.map((axis) => initAxisMesh(axis)),
    ...visibleAxes.map((axis) => initUnitMesh(axis)),
  ];
}

export function initSphereMesh(point: Body) {
  const { radius, color } = point;
  const geometry = new THREE.SphereGeometry(radius, 16, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

export function initLineMesh(point: Body) {
  const { color, trajectoryLength } = point;
  const geometry = new THREE.Geometry();
  const material = new THREE.LineDashedMaterial({
    color,
  });
  geometry.vertices = new Array(trajectoryLength)
    .fill(undefined)
    .map((_) => new THREE.Vector3(0, 0, 0));
  return new THREE.Line(geometry, material);
}

export function initBodiesMesh(points: Body[]) {
  const spheres = points.map((p) => initSphereMesh(p));
  const lines = points.map((p) => initLineMesh(p));
  return { spheres, lines };
}

export function initScene(...objects: THREE.Object3D[]) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();

  scene.add(...objects);

  document.body.appendChild(renderer.domElement);

  return { renderer, scene };
}

export function makeOnKeyPressedHandler(points: Point[], settings: Settings) {
  return function onKeyPressed(event: KeyboardEvent) {
    let { frame } = settings;
    switch (event.key) {
      case "r":
        switch (frame) {
          case null:
            frame = "barycenter";
            break;
          case "barycenter":
            frame = 0;
            break;
          default:
            frame++;
        }
        settings.frame = frame >= points.length ? null : frame;
        break;
      case "+":
        settings.scale *= 2;
        break;
      case "-":
        settings.scale /= 2;
        break;
      case "w":
        settings.samples *= 2;
        break;
      case "x":
        settings.samples /= 2;
        break;
      case ";":
        settings.speed *= 2;
        break;
      case ",":
        settings.speed /= 2;
        break;
    }
  };
}

export function initControls(
  points: Point[],
  settings: Settings,
  camera: THREE.Camera
) {
  const controls = new OrbitControls(camera);
  const onKeyPressed = makeOnKeyPressedHandler(points, settings);

  document.body.addEventListener("keypress", onKeyPressed, false);
  return controls;
}

export function initCamera(scale: number, x: number, y: number, z: number) {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const near = 0;
  const far = Number.MAX_VALUE;
  const camera = new THREE.OrthographicCamera(-w, w, h, -h, near, far);

  camera.position.set(x, y, z).multiplyScalar(scale);

  return camera;
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

export function updateObjectSpheres(
  points: Point[],
  barycenter: Barycenter,
  spheres: THREE.Mesh[],
  settings: Settings
) {
  // updating spheres position in sphere according to current position of points in field
  const frame = framePosition(settings.frame, points, barycenter);
  spheres.forEach((sphere, idx) => {
    const position = points[idx].position.xyz;
    sphere.position
      .set(...position)
      .sub(frame)
      .multiplyScalar(settings.scale);
  });
}

export function updateObjectLines(
  points: Point[],
  barycenter: Barycenter,
  lines: THREE.Line[],
  settings: Settings
) {
  const frame = frameTrajectory(settings.frame, points, barycenter);
  const zero = new THREE.Vector3(0, 0, 0);
  lines.forEach((line, idx) => {
    const geometry = line.geometry as THREE.Geometry;
    const trajectory = points[idx].trajectory;
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
  });
}

export function updateObjectFrame(
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
  timer: Timer
) {
  dom.frame.innerText = frameLabel(settings.frame, points);
  dom.samples.innerText = settings.samples.toFixed(0);
  dom.dt.innerText = makeTime(timer.dt);
  dom.delta.innerText = makeTime(settings.speed);
  dom.scale.innerText = settings.scale.toPrecision(4);
  dom.elapsed.innerText = makeTime(timer.t1);
}

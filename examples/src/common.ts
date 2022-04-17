import Stats from "stats.js";
import * as THREE from "three";
import { OrthographicCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Point,
  PointConstructor,
  SystemAcceleration,
  SystemDynamics,
} from "../../src/dynamics";
import { InteractionSolver, Timer } from "../../src/solvers";

export type Body = {
  radius: number;
  color: Color;
} & PointConstructor;

export type Frame = {
  idx: number | null;
};

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

export const AXIS_COLORS = [Color.Red, Color.Green, Color.Blue];
export const AXIS_UNIT_LENGTH = 20;
export const AXIS_UNIT_SIDE = 2;
export const AXIS_MAX_LENGTH = 100000;

export const BODY_COLORS = [
  0xffff00, 0x00ffff, 0xff00ff, 0x111111, 0x333333, 0x555555,
];

export function initStats() {
  const stats = new Stats();

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  return stats;
}

export function initSystemSimulation(
  data: PointConstructor[],
  acceleration: SystemAcceleration,
  dt: number
) {
  const points = data.map((d) => Point.makePoint(d));
  const { field } = new SystemDynamics(acceleration);
  const solver = new InteractionSolver(points, field, new Timer(dt));

  return { points, solver };
}

function coordinatesFromAxis(axis: Axis, max: number, min: number) {
  const w = axis == Axis.X ? max : min;
  const h = axis == Axis.Y ? max : min;
  const d = axis == Axis.Z ? max : min;
  return [w, h, d];
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

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.add(...objects);

  document.body.appendChild(renderer.domElement);

  return { renderer, scene };
}

export function makeOnKeyPressedHandler(points: Point[], frame: Frame) {
  return function onKeyPressed(event: KeyboardEvent) {
    switch (event.key) {
      case "r":
        frame.idx = frame.idx === null ? 0 : frame.idx + 1;
        frame.idx = frame.idx >= points.length ? null : frame.idx;
        break;
    }
  };
}

export function initControls(
  points: Point[],
  frame: Frame,
  camera: THREE.Camera
) {
  const controls = new OrbitControls(camera);
  const onKeyPressed = makeOnKeyPressedHandler(points, frame);

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

export function updateSimulation(
  points: Point[],
  solver: InteractionSolver<Point>,
  delta: number
) {
  // updating the position and speed of the points
  const states = solver.advance(delta);
  points.forEach((point, idx) => {
    point.update(states[idx].state);
  });
}

export function updateObjectSpheres(
  points: Point[],
  spheres: THREE.Mesh[],
  frame: Frame,
  scale: number
) {
  // updating spheres position in sphere according to current position of points in field
  const framePosition =
    frame.idx !== null
      ? new THREE.Vector3(...points[frame.idx].position.xyz)
      : new THREE.Vector3(0, 0, 0);
  spheres.forEach((sphere, idx) => {
    const position = points[idx].position.xyz;
    sphere.position
      .set(...position)
      .sub(framePosition)
      .multiplyScalar(scale);
  });
}

export function updateObjectLines(
  points: Point[],
  lines: THREE.Line[],
  frame: Frame,
  scale: number
) {
  const frameTrajectory =
    frame.idx !== null ? points[frame.idx].trajectory : null;
  lines.forEach((line, idx) => {
    const geometry = line.geometry as THREE.Geometry;
    const trajectory = points[idx].trajectory;
    geometry.vertices.forEach((vertex, vIdx) => {
      const position = trajectory.get(vIdx).xyz;
      const framePosition =
        frameTrajectory !== null
          ? new THREE.Vector3(...frameTrajectory.get(vIdx).xyz)
          : new THREE.Vector3(0, 0, 0);
      vertex
        .set(...position)
        .sub(framePosition)
        .multiplyScalar(scale);
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

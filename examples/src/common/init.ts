import {
  ArraySolver,
  Barycenter,
  InteractionSolver,
  Point,
  PointAcceleration,
  PointDynamics,
  SystemAcceleration,
  SystemDynamics,
  Timer,
} from "meca3";
import Stats from "stats.js";
import * as THREE from "three";
import {
  Axis,
  AXIS_COLORS,
  AXIS_MAX_LENGTH,
  AXIS_UNIT_LENGTH,
  AXIS_UNIT_SIDE,
} from "./constants";
import OrbitControls from "./controls";
import {
  makeOnKeyPressedHandler,
  makeOnMouseDownHandler,
  makeOnMouseMoveHandler,
  makeOnMouseUpHandler,
  makeOnMouseWheel,
  makeOnResizeHandler,
} from "./events";
import Settings from "./settings";
import { Body, SettingsDom, SimulationData } from "./types";

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

export function initSystemSimulation(
  data: SimulationData,
  acceleration: SystemAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.points.map((d) => Point.makePoint(d));
  const { field } = new SystemDynamics(acceleration);
  const solver = new InteractionSolver(points, field, new Timer(dt));
  const barycenter = Barycenter.makeBarycenter(data.barycenter);
  return { points, solver, barycenter };
}

export function initPointSimulation(
  data: SimulationData,
  acceleration: PointAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.points.map((d) => Point.makePoint(d));
  const { field } = new PointDynamics(acceleration);
  const solver = new ArraySolver(points, field, new Timer(dt));
  const barycenter = Barycenter.makeBarycenter(data.barycenter);
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

export function initAxesMesh(axes?: Axis[]) {
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
  const material = new THREE.LineBasicMaterial({
    color,
  });
  geometry.vertices = new Array(trajectoryLength)
    .fill(undefined)
    .map(() => new THREE.Vector3(0, 0, 0));
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

export function initSettingsDom(): SettingsDom {
  return {
    frame: document.getElementById("frame") as HTMLSpanElement,
    samples: document.getElementById("samples") as HTMLSpanElement,
    delta: document.getElementById("delta") as HTMLSpanElement,
    dt: document.getElementById("dt") as HTMLSpanElement,
    elapsed: document.getElementById("elapsed") as HTMLSpanElement,
    momentum: document.getElementById("momentum") as HTMLSpanElement,
    bar: document.getElementById("bar") as HTMLDivElement,
    scale: document.getElementById("scale") as HTMLDivElement,
  };
}

export function initControls(
  points: Point[],
  settings: Settings,
  camera: THREE.OrthographicCamera
) {
  const controls = new OrbitControls(camera);
  const onKeyPressed = makeOnKeyPressedHandler(points, settings, controls);
  const onResize = makeOnResizeHandler(camera);
  const onMouseMove = makeOnMouseMoveHandler(controls);
  const onMouseUp = makeOnMouseUpHandler(onMouseMove);
  const onMouseDown = makeOnMouseDownHandler(onMouseMove);
  const onMouseWheel = makeOnMouseWheel(settings);
  document.body.addEventListener("keypress", onKeyPressed, false);
  document.body.addEventListener("mouseup", onMouseUp, false);
  document.body.addEventListener("mousedown", onMouseDown, false);
  document.body.addEventListener("wheel", onMouseWheel, false);
  window.addEventListener("resize", onResize);
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

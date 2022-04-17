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

export type Frame = {
  idx: number | null;
};

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

export function initObjectSpheres(points: Point[]) {
  // The points in simulation are represented as spheres of different colors.
  const geometry = new THREE.SphereGeometry(1, 16, 32);
  const materials = points.map(
    (_, idx) => new THREE.MeshBasicMaterial({ color: BODY_COLORS[idx] })
  );
  return materials.map((material) => new THREE.Mesh(geometry, material));
}

export function initObjectLines(points: Point[], scale: number = 1) {
  const geometries = points.map(({ trajectory }) => {
    const geometry = new THREE.Geometry();
    geometry.vertices = trajectory.vertices.map(
      (p) => new THREE.Vector3(p.x * scale, p.y * scale, p.z * scale)
    );
    return geometry;
  });
  const materials = points.map(
    (_, idx) =>
      new THREE.LineDashedMaterial({
        color: BODY_COLORS[idx],
        linewidth: 1,
        scale: 100,
        dashSize: 10,
        gapSize: 10,
      })
  );
  return points.map(
    (_, idx) => new THREE.Line(geometries[idx], materials[idx])
  );
}

export function initScene(...objects: THREE.Object3D[]) {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.add(...objects);

  document.body.appendChild(renderer.domElement);

  return { renderer, scene };
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

export function initOrthographicCamera(scale: number, distance: number) {
  const width = (window.innerWidth * scale) / 2;
  const height = (window.innerHeight * scale) / 2;
  const near = 0 * scale;
  const far = 1e8 * scale;
  const dist = distance * scale;

  const camera = new THREE.OrthographicCamera(
    -width,
    width,
    height,
    -height,
    near,
    far
  );

  camera.position.x = dist;

  return camera;
}

export function initPerspectiveCamera(x: number, y: number, z: number) {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;

  return camera;
}

export function initCenter() {
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  return new THREE.Mesh(geometry, material);
}

export function initXUnit() {
  const geometry = new THREE.BoxGeometry(20, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 10;
  return mesh;
}

export function initXAxis() {
  const geometry = new THREE.BoxGeometry(100000, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.4,
    transparent: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function initYUnit() {
  const geometry = new THREE.BoxGeometry(2, 20, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 10;
  return mesh;
}

export function initYAxis() {
  const geometry = new THREE.BoxGeometry(2, 100000, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.4,
    transparent: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function initZUnit() {
  const geometry = new THREE.BoxGeometry(2, 2, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 10;
  return mesh;
}

export function initZAxis() {
  const geometry = new THREE.BoxGeometry(2, 2, 100000);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    opacity: 0.4,
    transparent: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function initFrame() {
  return [
    initCenter(),
    initXUnit(),
    initXAxis(),
    initYUnit(),
    initYAxis(),
    initZUnit(),
    initZAxis(),
  ];
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
  scale: number,
  scaleF: number
) {
  const newScaleF =
    (((camera.top - camera.bottom) / camera.zoom) * scale) / 800;
  frame.forEach((mesh) => {
    mesh.geometry.scale(
      newScaleF / scaleF,
      newScaleF / scaleF,
      newScaleF / scaleF
    );
    mesh.position.multiplyScalar(newScaleF / scaleF);
  });
  return newScaleF;
}

import Stats from "stats.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3, Vector6 } from "../../src/algebra";
import { Point, PointConstructor, SystemDynamics } from "../../src/dynamics";
import { InteractionSolver, Timer } from "../../src/solvers";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8 * 8192;
const TARGET_FRAMERATE = 60;
const BODY_COLORS = [0xffff00, 0x00ffff, 0xff00ff];

const SECS_PER_MONTH = 2.628e6;
const GRAVITATIONAL_CONSTANT = -6.67408e-11; // universal gravitation constant in SI
const DISTANCE_TOL = 100;

const data = [
  {
    id: "sun",
    mass: 1.9891e30,
    state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "earth",
    mass: 5.9736e24,
    state: Vector6.concatenated(
      Vector3.ex.mul(1.47098074e11),
      Vector3.ey.mul(3.0287e4)
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "mars",
    mass: 6.4185e23,
    state: Vector6.concatenated(
      Vector3.ex.mul(2.06644545e11),
      Vector3.ey.mul(2.6499e4)
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
];

const acceleration = Vector3.zeros;

// gravitational field between bodies
const gravitationalAcceleration = (p, point) => {
  const dist3 = point.position.dist(p.position) ** 3;
  const k =
    dist3 > DISTANCE_TOL ? (GRAVITATIONAL_CONSTANT * point.mass) / dist3 : 0;
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

let speed = 10 * SECS_PER_MONTH; // simulation speed
let delta = speed / TARGET_FRAMERATE; // time step of animation in s
let scale = 1e-10; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame
let framePointIdx = undefined;

function initStats() {
  const stats = new Stats();

  stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  return stats;
}

function initSimulation(data: PointConstructor[]) {
  console.log(Vector6);
  console.log(data);

  const points = data.map((d) => Point.makePoint(d));
  const { field } = new SystemDynamics(gravitationalAcceleration);
  const solver = new InteractionSolver(points, field, new Timer(dt));

  return { points, solver };
}

function initObjectSpheres(points) {
  // The points in simulation are represented as spheres of different colors.
  const geometry = new THREE.SphereGeometry(1, 16, 32);
  const materials = points.map(
    (_, idx) => new THREE.MeshBasicMaterial({ color: BODY_COLORS[idx] })
  );
  return materials.map((material) => new THREE.Mesh(geometry, material));
}

function initObjectLines(points) {
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

function initScene(...objects: THREE.Object3D[]) {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.add(...objects);

  document.body.appendChild(renderer.domElement);

  return { renderer, scene };
}

function initControls() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const controls = new OrbitControls(camera);

  document.body.addEventListener("keypress", onKeyPressed, false);

  camera.position.z = 50;

  return { camera, controls };
}

function onKeyPressed(event: KeyboardEvent) {
  switch (event.key) {
    case "r":
      framePointIdx = framePointIdx === undefined ? 0 : framePointIdx + 1;
      framePointIdx = framePointIdx > 1 ? undefined : framePointIdx;
  }
}

function updateSimulation(points: Point[], solver: InteractionSolver<Point>) {
  // updating the position and speed of the points
  const states = solver.advance(delta);
  points.forEach((point, idx) => {
    point.update(states[idx].state);
  });
}

function updateObjectSpheres(points: Point[], spheres: THREE.Mesh[]) {
  // updating spheres position in sphere according to current position of points in field
  const framePosition =
    framePointIdx !== undefined
      ? new THREE.Vector3(...points[framePointIdx].position.xyz)
      : new THREE.Vector3(0, 0, 0);
  spheres.forEach((sphere, idx) => {
    const position = points[idx].position.xyz;
    sphere.position
      .set(...position)
      .sub(framePosition)
      .multiplyScalar(scale);
  });
}

function updateObjectLines(points: Point[], lines: THREE.Mesh[]) {
  lines.forEach((line, idx) => {
    const geometry = line.geometry as THREE.Geometry;
    const trajectory = points[idx].trajectory;
    geometry.vertices.forEach((vertex, vIdx) => {
      const position = trajectory.get(vIdx).xyz;

      // if (framePointIdx !== undefined) {
      //   const frame = points[framePointIdx].trajectory;
      //   const framePosition = new THREE.Vector3(...frame.get(vIdx).xyz);
      //   vertex
      //     .set(...position)
      //     .sub(framePosition)
      //     .multiplyScalar(scale);
      //   return;
      // }
      vertex.set(...position).multiplyScalar(scale);
    });
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
  });
}

function init() {
  const stats = initStats();
  const { points, solver } = initSimulation(data);
  const spheres = initObjectSpheres(points);
  const lines = initObjectLines(points);
  const { renderer, scene } = initScene(...spheres, ...lines);
  const { camera, controls } = initControls();

  return function animate() {
    stats.begin();
    updateSimulation(points, solver);
    updateObjectSpheres(points, spheres);
    updateObjectLines(points, lines);

    controls.update();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
  };
}

// SIMULATION LOOP

const animate = init();
animate();

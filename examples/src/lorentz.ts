import Stats from "stats.js";
import { Vector3, Vector6 } from "../../src/algebra";
import {
  initControls,
  initObjectLines,
  initObjectSpheres,
  initPerspectiveCamera,
  initScene,
  initSimulation,
  updateObjectLines,
  updateObjectSpheres,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 4 * 8192;
const TARGET_FRAMERATE = 60;

const electricFieldVector = Vector3.ex;
const magneticFieldVector = Vector3.ez;
const dragVector = Vector3.zeros;
const zero = Vector3.zeros;
const acceleration = Vector3.zeros;

const SPEED_OF_LIGHT = 299792458;
const MAGNETIC_FIELD_AMP = 2 / SPEED_OF_LIGHT;
const FREQUENCY = SPEED_OF_LIGHT / 1000;

const electricField = (t) =>
  SPEED_OF_LIGHT * MAGNETIC_FIELD_AMP * Math.cos(2 * Math.PI * FREQUENCY * t);
const magneticField = (t) =>
  MAGNETIC_FIELD_AMP * Math.cos(2 * Math.PI * FREQUENCY * t);

let speed = 1; // simulation speed
let delta = (10 * speed) / SPEED_OF_LIGHT / TARGET_FRAMERATE; // time step of animation in s
let scale = 1000000000 / SPEED_OF_LIGHT; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame

function initStats() {
  const stats = new Stats();

  stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  return stats;
}

const data = [
  {
    id: "mass",
    mass: 4 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "a",
    mass: 1 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(
      Vector3.ex.mul(10),
      Vector3.ez.mul(SPEED_OF_LIGHT / 2)
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "b",
    mass: 1 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(
      Vector3.ex.mul(10).neg(),
      Vector3.ey.mul(SPEED_OF_LIGHT / 200)
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
];

// gravitational field between bodies
const electromagAcceleration = (p, point, t) => {
  if (p.id !== point.id) {
    return zero;
  }
  electricFieldVector.x = electricField(t);
  magneticFieldVector.z = magneticField(t);
  dragVector.copy(p.speed);
  dragVector.mul(-0.0);
  acceleration.copy(p.speed);
  return acceleration
    .cross(magneticFieldVector)
    .add(electricFieldVector)
    .add(dragVector)
    .div(p.mass);
};

function init() {
  const frame = { idx: null };
  const stats = initStats();
  const { points, solver } = initSimulation(data, electromagAcceleration, dt);
  const spheres = initObjectSpheres(points);

  const lines = initObjectLines(points, scale);
  const { renderer, scene } = initScene(...spheres, ...lines);
  const camera = initPerspectiveCamera(0, 0, 50);
  const controls = initControls(points, frame, camera);

  return function animate() {
    stats.begin();
    updateSimulation(points, solver, delta);
    updateObjectSpheres(points, spheres, frame, scale);
    updateObjectLines(points, lines, frame, scale);

    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
  };
}

const animate = init();
animate();

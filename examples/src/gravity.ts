import { Vector3, Vector6 } from "../../src/algebra";
import {
  initControls,
  initObjectLines,
  initObjectSpheres,
  initPerspectiveCamera,
  initScene,
  initStats,
  initSystemSimulation,
  updateObjectLines,
  updateObjectSpheres,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8 * 8192;
const TARGET_FRAMERATE = 60;

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

// gravitational field between bodies
const acceleration = Vector3.zeros;
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

function init() {
  const frame = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(
    data,
    gravitationalAcceleration,
    dt
  );
  const spheres = initObjectSpheres(points);

  const lines = initObjectLines(points, scale);
  const { renderer, scene } = initScene(...spheres, ...lines);
  const camera = initPerspectiveCamera(0, -0, 50);
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

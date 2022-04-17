import { Vector3, Vector6 } from "../../src";
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
// INITIALIZATION OF THE SIMULATION

let a = 50; // length of the equilateral triangle
let freq = 1 / 2,
  pulse = freq * 2 * Math.PI; // frequency and pulsation of oscillation in Hz resp. rad/s

const BUFFER_LENGTH = 4096;
const SAMPLE_PER_FRAMES = 2048;
const TARGET_FRAMERATE = 60;
const DISTANCE_TOL = a / 1000;

const data = [
  {
    id: "first",
    mass: 1,
    state: Vector6.concatenated(Vector3.ex.mul(a), Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "second",
    mass: 1,
    state: Vector6.concatenated(Vector3.ex.mul(-a), Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "third",
    mass: 2,
    state: Vector6.concatenated(
      Vector3.ey.mul((a * Math.sqrt(3)) / 2),
      Vector3.zeros
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
];

// oscillating field, each point is linked to the other with a spring of given pulsation
const acceleration = Vector3.zeros;
const oscillationField = (p, point) => {
  const dist = point.position.dist(p.position);
  const k = dist > DISTANCE_TOL ? -((pulse / p.mass) ** 2) : 0;
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

let delta = 1 / TARGET_FRAMERATE; // time step of animation in s
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame
let scale = 1;

function init() {
  const frame = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(data, oscillationField, dt);
  const spheres = initObjectSpheres(points);

  const lines = initObjectLines(points, scale);
  const { renderer, scene } = initScene(...spheres, ...lines);
  const camera = initPerspectiveCamera(0, (a * Math.sqrt(3)) / 4, 100);

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

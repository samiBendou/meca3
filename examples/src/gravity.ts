import { Vector3, Vector6 } from "../../src/algebra";
import {
  Color,
  initBodiesMesh,
  initCamera,
  initControls,
  initFrameMesh,
  initScene,
  initStats,
  initSystemSimulation,
  updateObjectFrame,
  updateObjectLines,
  updateObjectSpheres,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8 * 8192;

const SECS_PER_MONTH = 2.628e6;
const GRAVITATIONAL_CONSTANT = -6.67408e-11; // universal gravitation constant in SI
const DISTANCE_TOL = 100;

const data = [
  {
    id: "sun",
    mass: 1.9891e30,
    state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Yellow,
    radius: 10,
  },
  {
    id: "earth",
    mass: 5.9736e24,
    state: Vector6.concatenated(
      Vector3.ex.mul(1.47098074e11),
      Vector3.ey.mul(3.0287e4)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 10,
  },
  {
    id: "mars",
    mass: 6.4185e23,
    state: Vector6.concatenated(
      Vector3.ex.mul(2.06644545e11),
      Vector3.ey.mul(2.6499e4)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Magenta,
    radius: 10,
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

let speed = SECS_PER_MONTH / 30; // simulation speed
let delta = speed; // time step of animation in s
let scale = 1e-9; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame
let zoomScale = 1;

function init() {
  const reference = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(
    data,
    gravitationalAcceleration,
    dt
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...spheres, ...lines, ...frame);
  const camera = initCamera(scale, -15e9, -25e9, 50e9);
  const controls = initControls(points, reference, camera);

  return function animate() {
    stats.begin();
    updateSimulation(points, solver, delta);
    updateObjectSpheres(points, spheres, reference, scale);
    updateObjectLines(points, lines, reference, scale);
    zoomScale = updateObjectFrame(camera, frame, zoomScale);

    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
  };
}

const animate = init();
animate();

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
let zoomScale = 1;

const data = [
  {
    id: "mass",
    mass: 4 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Yellow,
    radius: 10,
  },
  {
    id: "a",
    mass: 1 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(
      Vector3.ex.mul(10),
      Vector3.ey.mul(SPEED_OF_LIGHT / 2)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 10,
  },
  {
    id: "b",
    mass: 1 / SPEED_OF_LIGHT / SPEED_OF_LIGHT,
    state: Vector6.concatenated(
      Vector3.ex.mul(10).neg(),
      Vector3.ey.mul(SPEED_OF_LIGHT / 200)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Magenta,
    radius: 10,
  },
];

// gravitational field between bodies
const electromagAcceleration = (p, point, t) => {
  if (p.id !== point.id) {
    return zero;
  }
  electricFieldVector.y = electricField(t);
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
  const reference = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(
    data,
    electromagAcceleration,
    dt
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...frame, ...spheres, ...lines);
  const camera = initCamera(scale, 0, 0, 50 * scale);
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

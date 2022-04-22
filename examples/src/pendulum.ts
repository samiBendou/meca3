import { Vector3, Vector6 } from "../../src";
import {
  Color,
  initBodiesMesh,
  initCamera,
  initControls,
  initFrameMesh,
  initScene,
  initSettingsDom,
  initStats,
  initSystemSimulation,
  updateObjectFrame,
  updateObjectLines,
  updateObjectSpheres,
  updateSettingsDom,
  updateSimulation,
} from "./common";
// INITIALIZATION OF THE SIMULATION

const GRAVITY_ACCELERATION = 9.80665;
const PENDULUM_LENGTH = 50;

const BUFFER_LENGTH = 4096;
const SAMPLE_PER_FRAMES = 16384;
const TARGET_FRAMERATE = 60;

const data = [
  {
    id: "first",
    mass: 10000,
    state: Vector6.concatenated(Vector3.ey.mul(PENDULUM_LENGTH), Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Yellow,
    radius: 10,
  },
  {
    id: "second",
    mass: 1,
    state: Vector6.concatenated(Vector3.zeros, Vector3.ex.mul(-100)),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 10,
  },
  {
    id: "third",
    mass: 2,
    state: Vector6.concatenated(
      Vector3.ey.mul(PENDULUM_LENGTH).neg(),
      Vector3.ex.mul(150)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Magenta,
    radius: 10,
  },
];

const gravity = Vector3.ey.mul(-GRAVITY_ACCELERATION);
const strengths = {
  first: {
    first: 0,
    second: 0,
    third: 0,
  },
  second: {
    first: 100000,
    second: 0,
    third: 100000,
  },
  third: {
    first: 0,
    second: 100000,
    third: 0,
  },
};

// oscillating field, each point is linked to the other with a spring of given pulsation
const zero = Vector3.zeros;
const acceleration = Vector3.zeros;
const unit = Vector3.zeros;
const field = (p, point) => {
  if (p.id === "first") {
    return zero;
  }
  const k = -strengths[p.id][point.id] / p.mass;
  unit.copy(p.position).sub(point.position).norm();
  unit.mul(PENDULUM_LENGTH);
  acceleration.copy(p.position);
  return acceleration.sub(point.position).sub(unit).mul(k).add(gravity);
};

let zoomScale = 1;
const settings = {
  frame: null,
  speed: 1 / TARGET_FRAMERATE,
  scale: 10,
  samples: SAMPLE_PER_FRAMES,
};

function init() {
  const stats = initStats();
  const { points, solver, barycenter } = initSystemSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();

  const { renderer, scene } = initScene(...frame, ...spheres, ...lines);
  const camera = initCamera(settings.scale, 0, PENDULUM_LENGTH / 4, 100);

  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    updateSimulation(points, barycenter, solver, settings);
    updateObjectSpheres(points, barycenter, spheres, settings);
    updateObjectLines(points, barycenter, lines, settings);

    updateSettingsDom(dom, settings, points, solver.timer);
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

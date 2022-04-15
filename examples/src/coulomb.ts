import { Vector3, Vector6 } from "../../src/algebra";
import {
  initControls,
  initObjectLines,
  initObjectSpheres,
  initPerspectiveCamera,
  initScene,
  initSimulation,
  initStats,
  updateObjectLines,
  updateObjectSpheres,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8192;
const TARGET_FRAMERATE = 60;

const SECS_PER_AS = 1e-18;
const VACUUM_PERMITTIVITY = 8.8541878128e-12;
const COULOMB_CONSTANT = 1 / (4 * Math.PI * VACUUM_PERMITTIVITY);
const ELEMENTARY_CHARGE = 1.602176634e-19;
const PROTON_ELECTRON_DIST = 5.29177e-11;
const ELECTRON_MASS = 9.1093837015e-31;
const SPEED_OF_LIGHT = 299792458;

const data = [
  {
    id: "proton",
    mass: Number.POSITIVE_INFINITY,
    state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
  },
  {
    id: "electron",
    mass: ELECTRON_MASS,
    state: Vector6.concatenated(
      Vector3.ex.mul(PROTON_ELECTRON_DIST),
      Vector3.ey.mul(SPEED_OF_LIGHT / 274)
    ),
    trajectoryLength: BUFFER_LENGTH,
  },
];

let speed = 10 * SECS_PER_AS; // simulation speed
let delta = speed / TARGET_FRAMERATE; // time step of animation in s
let scale = 5e11; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame

const acceleration = Vector3.zeros;
const coulombAcceleration = (p, point) => {
  const dist3 =
    point.position.dist(p.position) ** 3 || Number.POSITIVE_INFINITY;
  const k =
    -(COULOMB_CONSTANT * ELEMENTARY_CHARGE * ELEMENTARY_CHARGE) /
    (dist3 * p.mass);
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

function init() {
  const frame = { idx: null };
  const stats = initStats();
  const { points, solver } = initSimulation(data, coulombAcceleration, dt);
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

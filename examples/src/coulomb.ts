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
    color: Color.Yellow,
    radius: 10,
  },
  {
    id: "electron",
    mass: ELECTRON_MASS,
    state: Vector6.concatenated(
      Vector3.ex.mul(PROTON_ELECTRON_DIST),
      Vector3.ey.mul(SPEED_OF_LIGHT / 274)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 10,
  },
];

let speed = 10 * SECS_PER_AS; // simulation speed
let delta = speed / TARGET_FRAMERATE; // time step of animation in s
let scale = 5e12; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame
let zoomScale = 1;

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
  const reference = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(
    data,
    coulombAcceleration,
    dt
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...frame, ...spheres, ...lines);
  const camera = initCamera(scale, 0, 0, 50e-11);
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

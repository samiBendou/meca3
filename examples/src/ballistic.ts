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

const AIR_RHO = 1.204;
const WATER_RHO = 1000;
const SPHERE_RADIUS = 0.1;
const RAD_PER_DEG = Math.PI / 180;
const SPHERE_AREA = 4 * Math.PI * SPHERE_RADIUS ** 2;
const SPHERE_VOLUME = (4 * Math.PI * SPHERE_RADIUS ** 3) / 3;

const SIDERAL_DAY = 86164;
const GRAVITY_ACCELERATION = 9.80665;
const EARTH_RADIUS = 6378.137e3;
const LATITUDE_DEG = 45;
const LATITUDE_RAD = LATITUDE_DEG * RAD_PER_DEG;
const ROTATION_SPEED = (2 * Math.PI) / SIDERAL_DAY;
const FRICTION_COEFFICIENT = (AIR_RHO * 0.03 * SPHERE_AREA) / 2;
const ROTATION_AXIS = new Vector3(
  0,
  Math.cos(LATITUDE_RAD),
  Math.sin(LATITUDE_RAD)
);
const LINEAR_SPEED = Vector3.ez.cross(ROTATION_AXIS).mul(EARTH_RADIUS);

const INITIAL_SPEED = 1000;
const INITIAL_DISTANCE = 1000;
const INITIAL_OFFSET = 2000;
const INITIAL_ALTITUDE = 10000;

const zero = Vector3.zeros;
const dragVector = Vector3.zeros;
const centrifugal = ROTATION_AXIS.clone()
  .cross(LINEAR_SPEED)
  .mul(ROTATION_SPEED ** 2);
const archimede = Vector3.ez.mul(
  AIR_RHO * SPHERE_VOLUME * GRAVITY_ACCELERATION
);
const gravity = Vector3.ez
  .mul(-GRAVITY_ACCELERATION)
  .add(centrifugal)
  .add(archimede);
const axisCoriolis = ROTATION_AXIS.clone().mul(-2 * ROTATION_SPEED);

const data = [
  {
    id: "plumb",
    mass: 11.3 * WATER_RHO * SPHERE_VOLUME,
    state: Vector6.concatenated(
      Vector3.ez
        .mul(INITIAL_ALTITUDE)
        .add(Vector3.ex.mul(INITIAL_DISTANCE))
        .add(Vector3.ey.mul(-INITIAL_OFFSET)),
      Vector3.ey.mul(INITIAL_SPEED)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Yellow,
    radius: 1000,
  },
  {
    id: "steel",
    mass: 7.32 * WATER_RHO * SPHERE_VOLUME,
    state: Vector6.concatenated(
      Vector3.ez
        .mul(INITIAL_ALTITUDE)
        .add(Vector3.ey.mul(-INITIAL_OFFSET))
        .add(Vector3.ex.mul(0)),
      Vector3.ey.mul(INITIAL_SPEED)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 1000,
  },
  {
    id: "aluminum",
    mass: 2.7 * WATER_RHO * SPHERE_VOLUME,
    state: Vector6.concatenated(
      Vector3.ez
        .mul(INITIAL_ALTITUDE)
        .add(Vector3.ey.mul(-INITIAL_OFFSET))
        .add(Vector3.ex.mul(-INITIAL_DISTANCE)),
      Vector3.ey.mul(INITIAL_SPEED)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Magenta,
    radius: 1000,
  },
];

// gravitational field between bodies
const acceleration = Vector3.zeros;
const earthAcceleration = (p, point) => {
  if (p.id !== point.id) {
    return zero;
  }
  dragVector.copy(p.speed);
  dragVector.mul((-FRICTION_COEFFICIENT * p.speed.mag) / p.mass);
  acceleration.copy(axisCoriolis);
  return acceleration.cross(p.speed).add(gravity).add(dragVector);
};

console.log(gravity.string());
console.log(axisCoriolis.string());

let zoomScale = 1;
let speed = 1; // simulation speed
let delta = speed; // time step of animation in s
let scale = 1; // scaling factor to represent bodies in animation
let dt = delta / SAMPLE_PER_FRAMES; // time step = delta / number of samples per frame

function init() {
  const reference = { idx: null };
  const stats = initStats();
  const { points, solver } = initSystemSimulation(data, earthAcceleration, dt);
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...spheres, ...lines, ...frame);
  const camera = initCamera(scale, INITIAL_ALTITUDE, 0, 0);
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

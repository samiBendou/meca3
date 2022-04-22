import { Vector3, Vector6 } from "../../src/algebra";
import {
  Color,
  initBodiesMesh,
  initCamera,
  initControls,
  initFrameMesh,
  initPointSimulation,
  initScene,
  initSettingsDom,
  initStats,
  updateObjectFrame,
  updateObjectLines,
  updateObjectSpheres,
  updateSettingsDom,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8192;
const TARGET_FRAMERATE = 60;

const AIR_RHO = 1.204;
const WATER_RHO = 1000;
const SPHERE_RADIUS = 1;
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

const drag = Vector3.zeros;
const archimede = Vector3.zeros;
const centrifugal = ROTATION_AXIS.clone()
  .cross(LINEAR_SPEED)
  .mul(ROTATION_SPEED ** 2);
const ARCHIMEDE = Vector3.ez.mul(
  AIR_RHO * SPHERE_VOLUME * GRAVITY_ACCELERATION
);
const gravity = Vector3.ez.mul(-GRAVITY_ACCELERATION).add(centrifugal);
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
    radius: 10,
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
    radius: 10,
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
    radius: 10,
  },
  {
    id: "hot-air",
    mass: 0.1 * AIR_RHO * SPHERE_VOLUME,
    state: Vector6.concatenated(
      Vector3.ez
        .mul(INITIAL_ALTITUDE)
        .add(Vector3.ey.mul(-INITIAL_OFFSET))
        .add(Vector3.ex.mul(0)),
      Vector3.ey.mul(INITIAL_SPEED)
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 10,
  },
];

// gravitational field between bodies
const acceleration = Vector3.zeros;
const field = (p) => {
  drag.copy(p.speed);
  drag.mul((-FRICTION_COEFFICIENT * p.speed.mag) / p.mass);
  archimede.copy(ARCHIMEDE).div(p.mass);
  acceleration.copy(axisCoriolis);
  return acceleration.cross(p.speed).add(gravity).add(drag).add(archimede);
};

console.log(gravity.string());
console.log(axisCoriolis.string());

let zoomScale = 1;
const settings = {
  frame: null,
  speed: 1 / TARGET_FRAMERATE,
  scale: 0.1,
  samples: SAMPLE_PER_FRAMES,
};

function init() {
  const stats = initStats();
  const { points, solver, barycenter } = initPointSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...spheres, ...lines, ...frame);
  const camera = initCamera(
    settings.scale,
    INITIAL_ALTITUDE * settings.scale,
    0,
    0
  );
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

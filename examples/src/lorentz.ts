import { PointAcceleration } from "../../src";
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
  Settings,
  updateObjectFrame,
  updateObjectLines,
  updateObjectSpheres,
  updateSettingsDom,
  updateSimulation,
} from "./common";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 4 * 8192;
const TARGET_FRAMERATE = 60;

const electricFieldVector = Vector3.ex;
const magneticFieldVector = Vector3.ez;
const dragVector = Vector3.zeros;
const acceleration = Vector3.zeros;

const SPEED_OF_LIGHT = 299792458;
const MAGNETIC_FIELD_AMP = 2 / SPEED_OF_LIGHT;
const FREQUENCY = SPEED_OF_LIGHT / 10000;

const electricField = (t: number) =>
  SPEED_OF_LIGHT * MAGNETIC_FIELD_AMP * Math.cos(2 * Math.PI * FREQUENCY * t);
const magneticField = (t: number) =>
  MAGNETIC_FIELD_AMP * Math.cos(2 * Math.PI * FREQUENCY * t);

const data = {
  barycenter: {
    state: Vector6.zeros,
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 5,
  },
  points: [
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
        Vector3.ez.mul(SPEED_OF_LIGHT / 2)
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Magenta,
      radius: 10,
    },
  ],
};

let zoomScale = 1;
const settings = new Settings({
  scale: 1000000000 / SPEED_OF_LIGHT,
  speed: 10 / SPEED_OF_LIGHT / TARGET_FRAMERATE,
  samples: SAMPLE_PER_FRAMES,
});

// gravitational field between bodies
const field: PointAcceleration = (p, t) => {
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
  const { scale } = settings;
  const stats = initStats();
  const { points, solver, barycenter } = initPointSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh([data.barycenter, ...data.points]);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...frame, ...spheres, ...lines);
  const camera = initCamera(scale, 0, 0, 50 * scale);
  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    updateSimulation(points, barycenter, solver, settings);
    updateObjectSpheres(points, barycenter, spheres, settings);
    updateObjectLines(points, barycenter, lines, settings);
    updateSettingsDom(dom, settings, points, barycenter, solver.timer);

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

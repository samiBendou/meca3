import { SystemAcceleration, Vector3, Vector6 } from "meca3";
import {
  Color,
  initAxesMesh,
  initBodiesMesh,
  initCamera,
  initControls,
  initScene,
  initSettingsDom,
  initStats,
  initSystemSimulation,
  updateAxesMesh,
  updateLinesMesh,
  updateSettingsDom,
  updateSimulation,
  updateSpheresMesh,
} from "./common";
import Settings from "./common/settings";

const BUFFER_LENGTH = 8192;
const SAMPLE_PER_FRAMES = 8192;
const TARGET_FRAMERATE = 60;

const SECS_PER_MONTH = 2.628e6;
const GRAVITATIONAL_CONSTANT = -6.67408e-11;

const data = {
  barycenter: {
    state: Vector6.zeros,
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 5,
  },
  points: [
    {
      id: "first",
      mass: 2e30,
      state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Yellow,
      radius: 10,
    },
    {
      id: "second",
      mass: 2e30,
      state: Vector6.concatenated(Vector3.ex.mul(2e11), Vector3.ey.mul(3.0e4)),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Cyan,
      radius: 10,
    },
    {
      id: "third",
      mass: 2e30,
      state: Vector6.concatenated(
        Vector3.ex.mul(3e11).neg(),
        Vector3.ez.mul(2.5e4)
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Magenta,
      radius: 10,
    },
  ],
};

// gravitational field between bodies
const zero = Vector3.zeros;
const acceleration = Vector3.zeros;
const gravitationalAcceleration: SystemAcceleration = (p, point) => {
  if (point.id === p.id) {
    return zero;
  }
  const dist3 = point.position.dist(p.position) ** 3;
  const k = (GRAVITATIONAL_CONSTANT * point.mass) / dist3;
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

let zoomScale = 1;
const settings = new Settings({
  scale: 1e-9,
  speed: SECS_PER_MONTH / TARGET_FRAMERATE,
  samples: SAMPLE_PER_FRAMES,
});

function init() {
  const { scale } = settings;
  const stats = initStats();
  const { points, solver, barycenter } = initSystemSimulation(
    data,
    gravitationalAcceleration,
    settings
  );
  const { spheres, lines } = initBodiesMesh([data.barycenter, ...data.points]);
  const axes = initAxesMesh();
  const { renderer, scene } = initScene(...spheres, ...lines, ...axes);
  const camera = initCamera(scale, 0, 0, 50e9);
  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    updateSimulation(points, barycenter, solver, settings);
    updateSpheresMesh(points, barycenter, spheres, settings);
    updateLinesMesh(points, barycenter, lines, settings);
    updateSettingsDom(dom, settings, points, barycenter, solver.timer);
    zoomScale = updateAxesMesh(camera, axes, zoomScale);
    controls.update();
    renderer.setSize(window.outerWidth, window.outerHeight);
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
  };
}

const animate = init();
animate();

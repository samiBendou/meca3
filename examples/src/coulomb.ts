import { Vector3, Vector6 } from "../../src/algebra";
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

let zoomScale = 1;
const settings = {
  frame: null,
  speed: (10 * SECS_PER_AS) / TARGET_FRAMERATE,
  scale: 5e12,
  samples: SAMPLE_PER_FRAMES,
};

const acceleration = Vector3.zeros;
const field = (p, point) => {
  if (point.id === p.id) {
    return;
  }
  const dist3 = point.position.dist(p.position) ** 3;
  const k =
    -(COULOMB_CONSTANT * ELEMENTARY_CHARGE * ELEMENTARY_CHARGE) /
    (dist3 * p.mass);
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

function init() {
  const { scale } = settings;
  const stats = initStats();
  const { points, solver, barycenter } = initSystemSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh(data);
  const frame = initFrameMesh();
  const { renderer, scene } = initScene(...frame, ...spheres, ...lines);
  const camera = initCamera(scale, 0, 0, 50e-11);
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

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
const BUFFER_LENGTH = 128;
const SAMPLE_PER_FRAMES = 2 * 8192;
const TARGET_FRAMERATE = 60;

const SECS_PER_AS = 1e-18;
const VACUUM_PERMITTIVITY = 8.8541878128e-12;
const COULOMB_CONSTANT = 1 / (4 * Math.PI * VACUUM_PERMITTIVITY);
const ELEMENTARY_CHARGE = 1.602176634e-19;
const BOHR_RADIUS = 5.29177210903e-11;
const ELECTRON_MASS = 9.1093837015e-31;
const PROTON_MASS = 1.67262192369e-27;
const ELECTRON_VELOCITY = 7.29e5;

const data = {
  barycenter: {
    state: Vector6.zeros,
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 5,
    emissive: Color.White,
  },
  points: [
    {
      id: "proton",
      mass: PROTON_MASS,
      state: Vector6.concatenated(Vector3.zeros, Vector3.zeros),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Yellow,
      radius: 10,
      emissive: Color.Yellow,
    },
    {
      id: "electron",
      mass: ELECTRON_MASS,
      state: Vector6.concatenated(
        Vector3.ex.mul(BOHR_RADIUS),
        Vector3.ey.mul(ELECTRON_VELOCITY)
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Cyan,
      radius: 10,
      emissive: Color.Cyan,
    },
  ],
};

let zoomScale = 1;
const settings = new Settings({
  scale: 5e12,
  speed: (10 * SECS_PER_AS) / TARGET_FRAMERATE,
  samples: SAMPLE_PER_FRAMES,
});
const zero = Vector3.zeros;
const acceleration = Vector3.zeros;
const field: SystemAcceleration = (p, point) => {
  if (point.id === p.id) {
    return zero;
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
  const { spheres, lines } = initBodiesMesh([data.barycenter, ...data.points]);
  const axes = initAxesMesh();
  const { renderer, scene } = initScene(...axes, ...spheres, ...lines.flat());
  const camera = initCamera(scale, 0, 0, 400);
  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    if (!settings.pause) {
      updateSimulation(points, barycenter, solver, settings);
    }
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

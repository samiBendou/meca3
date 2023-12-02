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
  updateLinesObject,
  updateSettingsDom,
  updateSimulation,
  updateSpheresMesh,
} from "./common";
import Settings from "./common/settings";
import * as THREE from "three";


const BUFFER_LENGTH = 1024;
const SAMPLE_PER_FRAMES = 2048;
const TARGET_FRAMERATE = 60;

const BASE_LENGTH = 50;
const REQUENCY = 1 / 2;
const PULSE = REQUENCY * 2 * Math.PI;

const data = {
  barycenter: {
    id: "barycenter",
    state: Vector6.zeros,
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 5,
  },
  points: [
    {
      id: "first",
      mass: 1,
      state: Vector6.concatenated(Vector3.ex.mul(BASE_LENGTH), Vector3.zeros),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Yellow,
      radius: 10,
    },
    {
      id: "second",
      mass: 1,
      state: Vector6.concatenated(Vector3.ex.mul(-BASE_LENGTH), Vector3.zeros),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Cyan,
      radius: 10,
    },
    {
      id: "third",
      mass: 2,
      state: Vector6.concatenated(
        Vector3.ey.mul((BASE_LENGTH * Math.sqrt(3)) / 2),
        Vector3.zeros
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Magenta,
      radius: 10,
    },
  ],
};

// oscillating field, each point is linked to the other with a spring of given pulsation
const zero = Vector3.zeros;
const acceleration = Vector3.zeros;
const field: SystemAcceleration = (p, point) => {
  if (point.id === p.id) {
    return zero;
  }
  const k = -((PULSE / p.mass) ** 2);
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
};

let zoomScale = 1;
const settings = new Settings({
  scale: 10,
  speed: 1 / TARGET_FRAMERATE,
  samples: SAMPLE_PER_FRAMES,
});

function init() {
  const stats = initStats();
  const { points, solver, barycenter } = initSystemSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh([data.barycenter, ...data.points]);
  const axes = initAxesMesh();
  const light = new THREE.AmbientLight(0xffffff);

  const { renderer, scene } = initScene(...axes, ...spheres, ...lines.flat(1), light);
  const camera = initCamera(settings.scale, 0, 0, 100);

  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    updateSimulation(points, barycenter, solver, settings);
    updateSpheresMesh(points, barycenter, spheres, settings);
    updateLinesObject(points, barycenter, lines, settings);

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

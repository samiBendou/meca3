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

let a = 50; // length of the equilateral triangle
let freq = 1 / 2,
  pulse = freq * 2 * Math.PI; // frequency and pulsation of oscillation in Hz resp. rad/s

const BUFFER_LENGTH = 4096;
const SAMPLE_PER_FRAMES = 2048;
const TARGET_FRAMERATE = 60;

const data = [
  {
    id: "first",
    mass: 1,
    state: Vector6.concatenated(Vector3.ex.mul(a), Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Yellow,
    radius: 10,
  },
  {
    id: "second",
    mass: 1,
    state: Vector6.concatenated(Vector3.ex.mul(-a), Vector3.zeros),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Cyan,
    radius: 10,
  },
  {
    id: "third",
    mass: 2,
    state: Vector6.concatenated(
      Vector3.ey.mul((a * Math.sqrt(3)) / 2),
      Vector3.zeros
    ),
    trajectoryLength: BUFFER_LENGTH,
    color: Color.Magenta,
    radius: 10,
  },
];

// oscillating field, each point is linked to the other with a spring of given pulsation
const acceleration = Vector3.zeros;
const field = (p, point) => {
  if (point.id === p.id) {
    return;
  }
  const k = -((pulse / p.mass) ** 2);
  acceleration.copy(p.position);
  return acceleration.sub(point.position).mul(k);
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
  const camera = initCamera(settings.scale, 0, (a * Math.sqrt(3)) / 4, 100);

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

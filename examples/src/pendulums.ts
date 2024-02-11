import { SystemAcceleration, Vector3, Vector6 } from "meca3";
import * as THREE from "three";
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

const GRAVITY_ACCELERATION = 9.80665;
const PENDULUM_LENGTH = 50;

const BUFFER_LENGTH = 1024;
const SAMPLE_PER_FRAMES = 32768;
const TARGET_FRAMERATE = 60;

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
      mass: 10000,
      state: Vector6.concatenated(
        Vector3.ey.mul(PENDULUM_LENGTH),
        Vector3.zeros
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Yellow,
      radius: 10,
    },
    {
      id: "second",
      mass: 1,
      state: Vector6.concatenated(Vector3.zeros, Vector3.ex.mul(100)),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Cyan,
      radius: 10,
    },
    {
      id: "third",
      mass: 10,
      state: Vector6.concatenated(
        Vector3.ey.mul(PENDULUM_LENGTH).neg(),
        Vector3.ex.mul(0)
      ),
      trajectoryLength: BUFFER_LENGTH,
      color: Color.Magenta,
      radius: 10,
    },
  ],
};

const gravity = Vector3.ey.mul(-GRAVITY_ACCELERATION);
const constraints: Record<string, Record<string, string | undefined>> = {
  first: {
    second: "linked",
  },
  second: {
    first: "linked",
    third: "linked",
  },
  third: {
    second: "linked",
  },
};

// oscillating field, each point is linked to the other with a spring of given pulsation
const zero = Vector3.zeros;
const ur = Vector3.zeros;
const vr = Vector3.zeros;
const constraint = Vector3.zeros;
const field: SystemAcceleration = (p, point) => {
  if (p.id === "first") {
    return zero;
  }

  if (p.id === point.id) {
    return gravity;
  }

  if (constraints[p.id][point.id] !== "linked") {
    return zero;
  }

  ur.copy(p.position).sub(point.position).norm();
  vr.copy(p.speed).sub(point.speed).norm();
  constraint.copy(ur).mul(vr.dot(ur));
  p.speed.sub(constraint);
  return zero;
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

  const { renderer, scene } = initScene(
    ...axes,
    ...spheres,
    ...lines.flat(),
    light
  );
  const camera = initCamera(settings.scale, 0, 0, 1000);
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

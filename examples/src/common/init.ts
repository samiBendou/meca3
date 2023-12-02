import {
  ArraySolver,
  Barycenter,
  InteractionSolver,
  Point,
  PointAcceleration,
  PointDynamics,
  SystemAcceleration,
  SystemDynamics,
  Timer,
} from "meca3";
import Stats from "stats.js";
import * as THREE from "three";
import {
  AXIS_COLORS,
  AXIS_MAX_LENGTH,
  AXIS_UNIT_LENGTH,
  AXIS_UNIT_SIDE,
  Axis,
  Color,
} from "./constants";
import OrbitControls from "./controls";
import {
  makeOnKeyPressedHandler,
  makeOnMouseDownHandler,
  makeOnMouseMoveHandler,
  makeOnMouseUpHandler,
  makeOnMouseWheel,
  makeOnResizeHandler,
} from "./events";
import Settings from "./settings";
import { Body, SettingsDom, SimulationData } from "./types";

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getAverageRGB(imgEl: HTMLImageElement) {
  const blockSize = 100, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    rgb = { r: 0, g: 0, b: 0 },
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d");
  let data,
    i = -4,
    count = 0;

  const height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height || 1000;
  const width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width || 1000;

  if (!context) {
    return defaultRGB;
  }

  context.canvas.height = height;
  context.canvas.width = width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    /* security error, img on diff domain */
    return defaultRGB;
  }
  const length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}
function coordinatesFromAxis(axis: Axis, max: number, min: number) {
  const w = axis == Axis.X ? max : min;
  const h = axis == Axis.Y ? max : min;
  const d = axis == Axis.Z ? max : min;
  return [w, h, d];
}

export function initStats() {
  const stats = new Stats();

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  return stats;
}

export function initClock() {
  const clock = new THREE.Clock();
  clock.start();
  return clock;
}

export function initSystemSimulation(
  data: SimulationData,
  acceleration: SystemAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.points.map((d) => Point.makePoint(d));
  const { field } = new SystemDynamics(acceleration);
  const solver = new InteractionSolver(points, field, new Timer(dt));
  const barycenter = Barycenter.makeBarycenter(data.barycenter);
  return { points, solver, barycenter };
}

export function initPointSimulation(
  data: SimulationData,
  acceleration: PointAcceleration,
  settings: Settings
) {
  const dt = settings.speed / settings.samples;
  const points = data.points.map((d) => Point.makePoint(d));
  const { field } = new PointDynamics(acceleration);
  const solver = new ArraySolver(points, field, new Timer(dt));
  const barycenter = Barycenter.makeBarycenter(data.barycenter);
  return { points, solver, barycenter };
}

export function initUnitMesh(axis: Axis) {
  const [w, h, d] = coordinatesFromAxis(axis, AXIS_UNIT_LENGTH, AXIS_UNIT_SIDE);
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: AXIS_COLORS[axis],
  });
  const mesh = new THREE.Mesh(geometry, material);
  const [x, y, z] = coordinatesFromAxis(axis, AXIS_UNIT_LENGTH / 2, 0);
  mesh.position.set(x, y, z);
  return mesh;
}

export function initAxisMesh(axis: Axis) {
  const [w, h, d] = coordinatesFromAxis(axis, AXIS_MAX_LENGTH, AXIS_UNIT_SIDE);
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: AXIS_COLORS[axis],
    opacity: 0.4,
    transparent: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function initCenterMesh() {
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  return new THREE.Mesh(geometry, material);
}

export function initAxesMesh(axes?: Axis[]) {
  const visibleAxes = axes ?? [Axis.X, Axis.Y, Axis.Z];
  return [
    initCenterMesh(),
    ...visibleAxes.map((axis) => initAxisMesh(axis)),
    ...visibleAxes.map((axis) => initUnitMesh(axis)),
  ];
}

export function initSphereMesh(point: Body) {
  const { radius, color } = point;
  const geometry = new THREE.SphereGeometry(radius * 2, 16, 32);

  const texture = point.texture
    ? new THREE.TextureLoader().load(point.texture)
    : undefined;
  const material = !point.emissive
    ? new THREE.MeshLambertMaterial({
        color: texture ? undefined : color,
        map: texture,
      })
    : new THREE.MeshLambertMaterial({
        color: texture ? undefined : color,
        emissive: point.emissive,
        emissiveMap: texture,
        emissiveIntensity: 1,
        map: texture,
      });
  return new THREE.Mesh(geometry, material);
}

export function initLineMesh(point: Body) {
  const { color, radius, trajectoryLength } = point;
  const geometry = new THREE.CylinderGeometry(radius / 6, radius / 6, 20);
  const texture = point.texture
    ? new THREE.ImageLoader().load(point.texture)
    : undefined;
  console.log(texture);
  if (texture && point.texture) {
    texture.src = point.texture;
  }

  const meshes = new Array(trajectoryLength).fill(undefined).map((_, idx) => {
    return new THREE.Mesh(
      geometry.clone(),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: (0.7 * (idx + 1)) / trajectoryLength,
      })
    );
  });

  if (texture) {
    texture.onload = () => {
      const average = getAverageRGB(texture);
      const rgb = rgbToHex(average.r, average.g, average.b);
      const color = new THREE.Color(rgb);
      meshes.forEach((mesh) => {
        (mesh.material as THREE.MeshBasicMaterial).color = color;
      });
    };
  }
  return meshes;
}

export function initBodiesMesh(points: Body[]) {
  const spheres = points.map((p) => initSphereMesh(p));
  const lines = points.map((p) => initLineMesh(p));
  return { spheres, lines };
}

export function initScene(...objects: THREE.Object3D[]) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();

  scene.add(...objects);
  scene.background = new THREE.Color(0x111111);
  document.body.appendChild(renderer.domElement);

  return { renderer, scene };
}

export function initSettingsDom(): SettingsDom {
  return {
    frame: document.getElementById("frame") as HTMLSpanElement,
    samples: document.getElementById("samples") as HTMLSpanElement,
    delta: document.getElementById("delta") as HTMLSpanElement,
    dt: document.getElementById("dt") as HTMLSpanElement,
    elapsed: document.getElementById("elapsed") as HTMLSpanElement,
    momentum: document.getElementById("momentum") as HTMLSpanElement,
    bar: document.getElementById("bar") as HTMLDivElement,
    scale: document.getElementById("scale") as HTMLDivElement,
  };
}

export function initControls(
  points: Point[],
  settings: Settings,
  camera: THREE.OrthographicCamera
) {
  const controls = new OrbitControls(camera);
  const onKeyPressed = makeOnKeyPressedHandler(points, settings, controls);
  const onResize = makeOnResizeHandler(camera);
  const onMouseMove = makeOnMouseMoveHandler(controls);
  const onMouseUp = makeOnMouseUpHandler(onMouseMove);
  const onMouseDown = makeOnMouseDownHandler(onMouseMove);
  const onMouseWheel = makeOnMouseWheel(settings);
  document.body.addEventListener("keypress", onKeyPressed, false);
  document.body.addEventListener("mouseup", onMouseUp, false);
  document.body.addEventListener("mousedown", onMouseDown, false);
  document.body.addEventListener("wheel", onMouseWheel, false);
  window.addEventListener("resize", onResize);
  return controls;
}

export function initCamera(scale: number, x: number, y: number, z: number) {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const near = 0;
  const far = 5000;
  const camera = new THREE.OrthographicCamera(-w, w, h, -h, near, far);
  camera.position.set(x, y, z);
  camera.frustumCulled = false;

  return camera;
}

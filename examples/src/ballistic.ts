import { PointAcceleration, Vector3, Vector6 } from "meca3";
import * as THREE from "three";
import {
  Color,
  initAxesMesh,
  initBodiesMesh,
  initCamera,
  initControls,
  initPointSimulation,
  initScene,
  initSettingsDom,
  initStats,
  updateAxesMesh,
  updateLinesMesh,
  updateSettingsDom,
  updateSimulation,
  updateSpheresMesh,
  updateSpheresScale,
} from "./common";
import Settings from "./common/settings";

const BUFFER_LENGTH = 1024;
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
  Math.sin(LATITUDE_RAD),
  0,
  Math.cos(LATITUDE_RAD)
); // North is positive z-axis
const LINEAR_SPEED = Vector3.ey.cross(ROTATION_AXIS).mul(EARTH_RADIUS);

const INITIAL_SPEED = 1000;
const INITIAL_DISTANCE = 20000;
const INITIAL_OFFSET = 2000;
const INITIAL_ALTITUDE = 10000;

const drag = Vector3.zeros;
const archimede = Vector3.zeros;
const centrifugal = ROTATION_AXIS.clone()
  .cross(LINEAR_SPEED)
  .mul(ROTATION_SPEED ** 2);
const ARCHIMEDE = Vector3.ey.mul(
  AIR_RHO * SPHERE_VOLUME * GRAVITY_ACCELERATION
);
const gravity = Vector3.ey.mul(-GRAVITY_ACCELERATION).add(centrifugal);
const axisCoriolis = ROTATION_AXIS.clone().mul(-2 * ROTATION_SPEED);
const textureLoader = new THREE.TextureLoader();

const path = "static/textures/cube/nalovardo/";
const format = ".jpg";
const urls = [
  path + "posx" + format,
  path + "negx" + format,
  path + "posy" + format,
  path + "negy" + format,
  path + "posz" + format,
  path + "negz" + format,
];

const reflectionCube = new THREE.CubeTextureLoader().load(urls);

const data = {
  barycenter: {
    state: Vector6.zeros,
    trajectoryLength: BUFFER_LENGTH,
    color: Color.White,
    radius: 5,
  },
  points: [
    {
      id: "plumb",
      mass: 11.3 * WATER_RHO * SPHERE_VOLUME,
      state: Vector6.concatenated(
        Vector3.ey
          .mul(INITIAL_ALTITUDE)
          .add(Vector3.ez.mul(INITIAL_DISTANCE))
          .add(Vector3.ex.mul(-INITIAL_OFFSET)),
        Vector3.ez.mul(-1 * INITIAL_SPEED)
      ),
      trajectoryLength: BUFFER_LENGTH,
      texture: "static/textures/balls/metal-iron/Metal iron 3_baseColor.jpeg",
      material: new THREE.MeshStandardMaterial({
        map: textureLoader.load(
          "static/textures/balls/metal-iron/Metal iron 3_baseColor.jpeg"
        ),
        aoMap: textureLoader.load(
          "static/textures/balls/metal-iron/Metal iron 3_ambientOcclusion.jpeg"
        ),
        aoMapIntensity: 1,
        roughnessMap: textureLoader.load(
          "static/textures/balls/metal-iron/Metal iron 3_roughness.jpeg"
        ),
        roughness: 1,
        metalnessMap: textureLoader.load(
          "static/textures/balls/metal-iron/Metal iron 3_metallic.jpeg"
        ),
        metalness: 1,
        normalMap: textureLoader.load(
          "static/textures/balls/metal-iron/Metal iron 3_normal.jpeg"
        ),

        envMap: reflectionCube,
        envMapIntensity: 1,
      }),
      radius: 10,
    },
    {
      id: "soccer",
      mass: 0.1 * WATER_RHO * SPHERE_VOLUME,
      state: Vector6.concatenated(
        Vector3.ey
          .mul(INITIAL_ALTITUDE)
          .add(Vector3.ez.mul(INITIAL_DISTANCE))
          .add(Vector3.ex.mul(0 * INITIAL_OFFSET)),
        Vector3.ez.mul(-INITIAL_SPEED)
      ),
      trajectoryLength: BUFFER_LENGTH,
      texture: "static/textures/balls/basket/BasketballColor.jpeg",
      material: new THREE.MeshStandardMaterial({
        map: textureLoader.load(
          "static/textures/balls/basket/BasketballColor.jpeg"
        ),
        roughness: 1,
        metalness: 0,
        normalMap: textureLoader.load(
          "static/textures/balls/basket/BasketballNormal.jpeg"
        ),

        envMap: reflectionCube,
        envMapIntensity: 1,
      }),
      radius: 10,
    },
    {
      id: "aluminum",
      mass: 2.7 * WATER_RHO * SPHERE_VOLUME,
      state: Vector6.concatenated(
        Vector3.ey
          .mul(INITIAL_ALTITUDE)
          .add(Vector3.ez.mul(INITIAL_DISTANCE))
          .add(Vector3.ex.mul(1 * INITIAL_OFFSET)),
        Vector3.ez.mul(-INITIAL_SPEED)
      ),
      texture:
        "static/textures/balls/metal-aluminium-brushed/Aluminium 6_baseColor.jpeg",

      material: new THREE.MeshStandardMaterial({
        map: textureLoader.load(
          "static/textures/balls/metal-aluminium-brushed/Aluminium 6_baseColor.jpeg"
        ),
        aoMap: textureLoader.load(
          "static/textures/balls/metal-aluminium-brushed/Aluminium 6_ambientOcclusion.jpeg"
        ),
        aoMapIntensity: 1,
        roughnessMap: textureLoader.load(
          "static/textures/balls/metal-aluminium-brushed/Aluminium 6_roughness.jpeg"
        ),
        roughness: 1,
        metalnessMap: textureLoader.load(
          "static/textures/balls/metal-aluminium-brushed/Aluminium 6_metallic.jpeg"
        ),
        metalness: 1,
        normalMap: textureLoader.load(
          "static/textures/balls/metal-aluminium-brushed/Aluminium 6_normal.jpeg"
        ),

        envMap: reflectionCube,
        envMapIntensity: 1,
      }),
      trajectoryLength: BUFFER_LENGTH,
      radius: 10,
    },
  ],
};

// gravitational field between bodies
const acceleration = Vector3.zeros;
const field: PointAcceleration = (p) => {
  drag.copy(p.speed);
  drag.mul((-FRICTION_COEFFICIENT * p.speed.mag) / p.mass);
  archimede.copy(ARCHIMEDE).div(p.mass);
  acceleration.copy(axisCoriolis);
  return acceleration.cross(p.speed).add(gravity).add(drag).add(archimede);
};

let zoomScale = 1;
const settings = new Settings({
  scale: 0.04,
  speed: 1.5 / TARGET_FRAMERATE,
  samples: SAMPLE_PER_FRAMES,
});
function init() {
  const stats = initStats();
  const { points, solver, barycenter } = initPointSimulation(
    data,
    field,
    settings
  );
  const { spheres, lines } = initBodiesMesh([data.barycenter, ...data.points]);
  const axes = initAxesMesh();
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  const { renderer, scene } = initScene(
    ...spheres,
    ...lines.flat(),
    ...axes,
    light,
    ambientLight
  );

  const camera = initCamera(settings.scale, 400, 0, 0);
  const controls = initControls(points, settings, camera);
  const dom = initSettingsDom();

  return function animate() {
    stats.begin();
    if (!settings.pause) {
      updateSimulation(points, barycenter, solver, settings);
    }
    updateSpheresMesh(points, barycenter, spheres, settings);
    updateLinesMesh(points, barycenter, lines, settings);
    updateSpheresScale(spheres, settings);
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

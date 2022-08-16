import { Point } from "meca3";
import {
  ROTATION_SPEED,
  SAMPLES_SPEED,
  SCALING_KEY_SPEED,
  SCALING_SCROLL_SPEED,
  TIME_SPEED,
} from "./constants";
import OrbitControls from "./controls";
import Settings from "./settings";

export function makeOnMouseWheel(settings: Settings) {
  return function onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY > 0) {
      settings.increase("scale", SCALING_SCROLL_SPEED);
    } else {
      settings.decrease("scale", SCALING_SCROLL_SPEED);
    }
  };
}

export function makeOnMouseDownHandler(
  onMouseMove: (event: MouseEvent) => void
) {
  return function onMouseDown(event: MouseEvent) {
    event.preventDefault();
    document.body.addEventListener("mousemove", onMouseMove, false);
  };
}

export function makeOnMouseUpHandler(onMouseMove: (event: MouseEvent) => void) {
  return function onMouseUp(event: MouseEvent) {
    event.preventDefault();
    document.body.removeEventListener("mousemove", onMouseMove, false);
  };
}

export function makeOnMouseMoveHandler(controls: OrbitControls) {
  return function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    controls.rotateCartesian(
      event.clientX,
      event.clientY,
      document.documentElement.clientHeight
    );
  };
}

export function makeOnKeyPressedHandler(
  points: Point[],
  settings: Settings,
  controls: OrbitControls
) {
  return function onKeyPressed(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case "r":
        return settings.shiftFrame(points.length);
      case "+":
        return settings.increase("scale", SCALING_KEY_SPEED);
      case "-":
        return settings.decrease("scale", SCALING_KEY_SPEED);
      case "w":
        return settings.increase("samples", SAMPLES_SPEED);
      case "x":
        return settings.decrease("samples", SAMPLES_SPEED);
      case ";":
        return settings.increase("speed", TIME_SPEED);
      case ",":
        return settings.decrease("speed", TIME_SPEED);
      case " ":
        return settings.togglePause();
      case "q":
        return controls.rotateLeft(ROTATION_SPEED);
      case "d":
        return controls.rotateLeft(-ROTATION_SPEED);
      case "z":
        return controls.rotateUp(ROTATION_SPEED);
      case "s":
        return controls.rotateUp(-ROTATION_SPEED);
      case "o":
        return controls.reset();
    }
  };
}

export function makeOnResizeHandler(camera: THREE.OrthographicCamera) {
  return function onResizeHandler() {
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;
    camera.left = -w;
    camera.right = w;
    camera.top = h;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
  };
}

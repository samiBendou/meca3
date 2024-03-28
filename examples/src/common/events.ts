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
      case "R":
        return settings.shiftFrame(points.length);
      case "+":
        return settings.increase("scale", SCALING_KEY_SPEED);
      case "-":
        return settings.decrease("scale", SCALING_KEY_SPEED);
      case "z":
      case "Z":
        return settings.increase("samples", SAMPLES_SPEED);
      case "x":
      case "X":
        return settings.decrease("samples", SAMPLES_SPEED);
      case ",":
      case "<":
        return settings.increase("speed", TIME_SPEED);
      case "m":
      case "M":
        return settings.decrease("speed", TIME_SPEED);
      case " ":
        return settings.togglePause();
      case "a":
      case "A":
        return controls.rotateLeft(ROTATION_SPEED);
      case "d":
      case "D":
        return controls.rotateLeft(-ROTATION_SPEED);
      case "w":
      case "W":
        return controls.rotateUp(ROTATION_SPEED);
      case "s":
      case "S":
        return controls.rotateUp(-ROTATION_SPEED);
      case "o":
      case "O":
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

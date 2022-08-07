export type Frame = number | null | "barycenter";

export type NumericSettings = "scale" | "speed" | "samples";

function nextFrame(frame: Frame) {
  switch (frame) {
    case null:
      return "barycenter";
    case "barycenter":
      return 0;
    default:
      return frame + 1;
  }
}

export default class Settings {
  scale: number; // scaling factor to represent bodies in animation
  speed: number; // simulation speed
  samples: number; // simulation steps per frame
  frame: Frame = null; // reference frame body index
  pause = false;

  constructor(params: { scale: number; speed: number; samples: number }) {
    this.scale = params.scale;
    this.speed = params.speed;
    this.samples = params.samples;
  }

  togglePause() {
    this.pause = !this.pause;
  }

  shiftFrame(maxShift: number) {
    const next = nextFrame(this.frame);
    this.frame = next >= maxShift ? null : next;
  }

  increase(key: NumericSettings, factor: number) {
    this[key] *= Math.max(factor, 1);
  }

  decrease(key: NumericSettings, factor: number) {
    this[key] /= Math.max(factor, 1);
  }
}

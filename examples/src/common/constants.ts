export enum Axis {
  X,
  Y,
  Z,
}

export enum Color {
  Red = 0xff0000,
  Green = 0x00ff00,
  Blue = 0x0000ff,
  Yellow = 0xffff00,
  Cyan = 0x00ffff,
  Magenta = 0xff00ff,
  Black = 0x000000,
  White = 0xffffff,
  Grey1 = 0x111111,
  Grey3 = 0x333333,
  Grey5 = 0x555555,
}

export enum Duration {
  Minutes = 60,
  Hour = 3600,
  Day = 86400,
  Month = 2592000,
  Year = 31104000,
}

export const AXIS_COLORS = [Color.Red, Color.Green, Color.Blue];
export const AXIS_UNIT_LENGTH = 20;
export const AXIS_UNIT_SIDE = 2;
export const AXIS_MAX_LENGTH = 100000;

export const BODY_COLORS = [
  Color.Yellow,
  Color.Cyan,
  Color.Magenta,
  Color.Grey1,
  Color.Grey3,
  Color.Grey5,
];

export const ROTATION_SPEED = Math.PI / 16;
export const SCALING_KEY_SPEED = 2;
export const SCALING_SCROLL_SPEED = 1.2;
export const SAMPLES_SPEED = 2;
export const TIME_SPEED = 2;

import { PointConstructor } from "../../../src";
import { BarycenterConstructor } from "../../../src/dynamics/Barycenter";
import { Color } from "./constants";

export type SettingsDom = {
  frame: HTMLSpanElement;
  scale: HTMLSpanElement;
  samples: HTMLSpanElement;
  dt: HTMLSpanElement;
  delta: HTMLSpanElement;
  elapsed: HTMLSpanElement;
  momentum: HTMLSpanElement;
};

export type Body = {
  radius: number;
  color: Color;
} & Pick<PointConstructor, "trajectoryLength">;

export type SimulationData = {
  points: PointConstructor[];
  barycenter: BarycenterConstructor;
};

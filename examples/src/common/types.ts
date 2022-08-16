import { BarycenterConstructor, PointConstructor } from "meca3";
import { Color } from "./constants";

export type SettingsDom = {
  frame: HTMLSpanElement;
  samples: HTMLSpanElement;
  dt: HTMLSpanElement;
  delta: HTMLSpanElement;
  elapsed: HTMLSpanElement;
  momentum: HTMLSpanElement;
  bar: HTMLDivElement;
  scale: HTMLDivElement;
};

export type Body = {
  radius: number;
  color: Color;
} & Pick<PointConstructor, "trajectoryLength">;

export type SimulationData = {
  points: PointConstructor[];
  barycenter: BarycenterConstructor;
};

import { BarycenterConstructor, PointConstructor } from "meca3";
import * as THREE from "three";
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
  color?: Color;
  emissive?: number;
  isEmissive?: boolean;
  texture?: string;
  material?: THREE.Material;
} & Pick<PointConstructor, "trajectoryLength">;

export type SimulationData = {
  points: PointConstructor[];
  barycenter: BarycenterConstructor;
};

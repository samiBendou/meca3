import { OrbitConstructor } from "./Orbit";

export type OrbitalBody = {
  name: string;
  kind: "Star" | "Terrestrial" | "Giant";
  mass: number;
  radius: number;
  color: string;
  texture?: string;
  orbit: OrbitConstructor;
  rotation: {
    tilt: number;
  };
};

const orbits: OrbitalBody[] = [
  {
    name: "Sun",
    kind: "Star",
    mass: 1.9891e30,
    radius: 6.96342e8,
    color: "#E95700",
    texture: "static/textures/planets/Sun.jpg",
    rotation: {
      tilt: 7.25,
    },
    orbit: {
      mu: 0.0,
      apoapsis: 0.0,
      periapsis: 0.0,
      argument: 0.0,
      inclination: {
        value: 0.0,
        argument: 0.0,
      },
    },
  },
  {
    name: "Mercury",
    kind: "Terrestrial",
    mass: 3.3011e23,
    radius: 2.4397e6,
    color: "#876945",
    texture: "static/textures/planets/Mercury.jpg",
    rotation: {
      tilt: 0.01,
    },
    orbit: {
      mu: 1.3271246205000001e20,
      apoapsis: 6.9817079e10,
      periapsis: 4.6001272e10,
      argument: 29.12478,
      inclination: {
        value: 7.00487,
        argument: 48.33167,
      },
    },
  },
  {
    name: "Venus",
    kind: "Terrestrial",
    mass: 4.8685e24,
    radius: 6.0518e6,
    color: "#FFFFF1",
    texture: "static/textures/planets/Venus.jpg",
    rotation: {
      tilt: 2.64,
    },
    orbit: {
      mu: 1.32712764877e20,
      apoapsis: 1.08942109e11,
      periapsis: 1.07476259e11,
      argument: 54.85229,
      inclination: {
        value: 3.39,
        argument: 76.67069,
      },
    },
  },
  {
    name: "Earth",
    kind: "Terrestrial",
    mass: 5.9736e24,
    radius: 6.3781e6,
    color: "#195D8D",
    texture: "static/textures/planets/Earth.jpg",
    rotation: {
      tilt: 23.44,
    },
    orbit: {
      mu: 1.3271283861844181e20,
      apoapsis: 1.52097701e11,
      periapsis: 1.47098074e11,
      argument: 288.064,
      inclination: {
        value: 0.0,
        argument: 174.873,
      },
    },
  },
  {
    name: "Mars",
    kind: "Terrestrial",
    mass: 6.4185e23,
    radius: 3.3962e6,
    color: "#79392E",
    texture: "static/textures/planets/Mars.jpg",
    rotation: {
      tilt: 25.19,
    },
    orbit: {
      mu: 1.3271248284637e20,
      apoapsis: 2.4922873e11,
      periapsis: 2.06644545e11,
      argument: 286.4623,
      inclination: {
        value: 1.85061,
        argument: 49.578,
      },
    },
  },
  {
    name: "Jupiter",
    kind: "Giant",
    mass: 1.8986e27,
    radius: 7.1492e7,
    color: "#C28B51",
    texture: "static/textures/planets/Jupiter.jpg",
    rotation: {
      tilt: 3.12,
    },
    orbit: {
      mu: 1.32839126552e20,
      apoapsis: 8.1662e11,
      periapsis: 7.4052e11,
      argument: 275.066,
      inclination: {
        value: 1.3053,
        argument: 100.55615,
      },
    },
  },
  {
    name: "Saturn",
    kind: "Giant",
    mass: 5.6846e26,
    radius: 6.0268e7,
    color: "#D9C2AD",
    texture: "static/textures/planets/Saturn.jpg",
    rotation: {
      tilt: 26.73,
    },
    orbit: {
      mu: 1.32750371205e20,
      apoapsis: 1.503983449e12,
      periapsis: 1.349823615e12,
      argument: 338.7169,
      inclination: {
        value: 2.48446,
        argument: 113.7153281104,
      },
    },
  },
  {
    name: "Uranus",
    kind: "Giant",
    mass: 8.681e25,
    radius: 2.5559e7,
    color: "#297D85",
    texture: "static/textures/planets/Uranus.jpg",
    rotation: {
      tilt: 82.23,
    },
    orbit: {
      mu: 1.32718233957e20,
      apoapsis: 3.006318143e12,
      periapsis: 2.734998229e12,
      argument: 96.541318,
      inclination: {
        value: 0.77,
        argument: 73.989821,
      },
    },
  },
  {
    name: "Neptune",
    kind: "Giant",
    mass: 1.0243e26,
    radius: 2.4764e7,
    color: "#3E5F9E",
    texture: "static/textures/planets/Neptune.jpg",
    rotation: {
      tilt: 28.33,
    },
    orbit: {
      mu: 1.3271927654700001e20,
      apoapsis: 4.55394649e12,
      periapsis: 4.452940833e12,
      argument: 273.24966,
      inclination: {
        value: 1.76917,
        argument: 131.72169,
      },
    },
  },
];

export default orbits;

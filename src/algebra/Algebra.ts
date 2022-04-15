import {
  Interpolable,
  List,
  Metrical,
  Numerical,
  Vectorial
} from "../common/";

export const mag = (vector: Metrical): number => Math.sqrt(vector.dot(vector));

export const mag2 = (vector: Metrical): number => vector.dot(vector);

export const floor = <T extends Numerical & List>(vector: T): T =>
  vector.clone().floor();

export const ceil = <T extends Numerical & List>(vector: T): T =>
  vector.clone().ceil();

export const round = <T extends Numerical & List>(vector: T): T =>
  vector.clone().round();

export const abs = <T extends Numerical & List>(vector: T): T =>
  vector.clone().abs();

export const min = <T extends Numerical & List>(...vectors: T[]): T =>
  vectors.reduce((acc, u) => acc.min(u));

export const max = <T extends Numerical & List>(...vectors: T[]): T =>
  vectors.reduce((acc, u) => acc.max(u));

export const trunc = <T extends Numerical & List>(
  decimals: number = 0,
  vector: T
): T => vector.clone().trunc(decimals);

/** addition between vectors `u0 + u1 + ...` */
export const add = <T extends Vectorial & List & Numerical>(
  ...vectors: T[]
): T => vectors.reduce((acc, u) => acc.add(u), vectors[0].clone().reset0());

/** subtraction between first vector and other ones `u0 - u1 - ...`*/
export const sub = <T extends Vectorial & List & Numerical>(
  vector: T,
  ...vectors: T[]
): T => vectors.reduce((acc, u) => acc.sub(u), vector.clone());

/** sum of negated vectors `-u0 - u1 + ...` */
export const neg = <T extends Vectorial & List & Numerical>(
  ...vectors: T[]
): T => vectors.reduce((acc, u) => acc.sub(u), vectors[0].clone().reset0());

/** sum of scaled vectors `s * u0 + s * u1 + ...` */
export const mul = <T extends Vectorial & List & Numerical>(
  s: number,
  ...vectors: T[]
) => vectors.reduce((acc, u) => acc.comb(s, u), vectors[0].clone().reset0());

/** sum of scaled vectors `u0 / s + u1 / s + ...` */
export const div = <T extends Vectorial & List & Numerical>(
  s: number,
  ...vectors: T[]
): T => {
  const inv = 1 / s;
  return vectors.reduce(
    (acc, u) => acc.comb(inv, u),
    vectors[0].clone().reset0()
  );
};

/** linear combination of vectors in array `s0 * u0 + s1 * u1 + ...` */
export const comb = <T extends Vectorial & List & Numerical>(
  scalars: number[],
  ...vectors: T[]
) =>
  vectors.reduce(
    (acc, u, index) => acc.comb(scalars[index], u),
    vectors[0].clone().reset0()
  );

/** linear interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector **/
export const lerp = <T extends Interpolable & List & Numerical>(
  s: number,
  ...vectors: T[]
): T => {
  const sn = (vectors.length - 1) * s,
    index = Math.ceil(sn);
  return vectors[Math.max(index - 1, 0)]
    .clone()
    .lerp(vectors[index], sn - index + 1);
};

export const herp = <T extends Interpolable & List & Numerical>(
  s: number,
  ...vectors: T[]
): T => {
  /** Hermite's interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector **/
  const sn = (vectors.length - 1) * s,
    index = Math.max(Math.floor(sn) - 3, 0);
  return vectors[index]
    .clone()
    .herp(
      vectors[index + 3],
      vectors[index + 1],
      vectors[index + 2],
      (sn - index) / 3
    );
};

export const berp = <T extends Interpolable & List & Numerical>(
  s: number,
  ...vectors: T[]
): T => {
  /**  Bezier's interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector  */
  const sn = (vectors.length - 1) * s,
    index = Math.max(Math.floor(sn) - 3, 0);
  return vectors[index]
    .clone()
    .berp(
      vectors[index + 3],
      vectors[index + 1],
      vectors[index + 2],
      (sn - index) / 3
    );
};

/** discrete derivative of the given vectors `[u1 - u0, u2 - u1, ...]` */
export const der1 = <T extends Vectorial & List & Numerical>(
  ...vectors: T[]
): T[] =>
  vectors
    .map((vector, index) => vector.clone().sub(vectors[Math.max(0, index - 1)]))
    .slice(1);

/** 1-st order derivative of the vectors `[(u1 - u0) / ds, (u2 - u1) / ds, ...]` */
export const der = <T extends Interpolable & List & Numerical>(
  ds: number,
  ...vectors: T[]
): T[] =>
  vectors
    .map((vector, index) =>
      vector.clone().der(ds, vectors[Math.max(0, index - 1)])
    )
    .slice(1);

/** multiplication of vectors `u0 * u1 * ...` */
export const prod = <T extends Vectorial & List & Numerical>(...vectors: T[]) =>
  vectors.reduce((acc, u) => acc.prod(u), vectors[0].clone().reset1());

/** sum of normalized vectors `u0 / ||u0|| + u1 / ||u1|| + ...` */
export const norm = <T extends Vectorial & List & Numerical & Metrical>(
  ...vectors: T[]
): T =>
  vectors.reduce(
    (acc, u) => acc.comb(1 / u.mag, u),
    vectors[0].clone().reset0()
  );

export const dot = <T extends Metrical>(vector1: T, vector2: T): number =>
  vector1.dot(vector2);

export const dist = <T extends Metrical>(vector1: T, vector2: T): number =>
  Math.sqrt(vector1.dist2(vector2));

export const exact = <T extends Numerical>(...vectors: T[]): boolean => {
  const len = vectors.length - 1;
  return vectors.reduce(
    (acc, u, index) => acc && vectors[Math.min(index + 1, len)].exact(u),
    true
  );
};

export const equal1 = <T extends Metrical>(...vectors: T[]): boolean => {
  const len = vectors.length - 1;
  return vectors.reduce(
    (acc, u, index) => acc && vectors[Math.min(index + 1, len)].equal1(u),
    true
  );
};

export const equal2 = <T extends Metrical>(...vectors: T[]): boolean => {
  const len = vectors.length - 1;
  return vectors.reduce(
    (acc, u, index) => acc && vectors[Math.min(index + 1, len)].equal2(u),
    true
  );
};

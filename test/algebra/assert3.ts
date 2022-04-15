import { assert } from "chai";
import { Vector } from "../../src/algebra/";
import { List } from "../../src/common/";

type Vectors = Vector | Vector[] | number[];

const arrayString = (array: number[]) =>
  `(${array.map((n) => n.toString()).join(", ")})`;

const defaultMessage = (actual: List | number[], expected: List | number[]) => {
  const prefix = `${actual.constructor.name} not equal :`;
  if (expected instanceof Array && actual instanceof Array)
    return `${prefix}\n${arrayString(actual)}\n!=\n${arrayString(expected)}`;
  else if (expected instanceof Array) {
    return `${prefix}\n${(actual as List).string()}\n!=\n${arrayString(
      expected
    )}`;
  } else if (actual instanceof Array) {
    return `${prefix}\n${arrayString(actual)}\n!=\n${expected.string()}`;
  }
  return `${prefix}\n${actual.string()}\n!=\n${expected.string()}`;
};

export function equal(actual: Vectors, expected: Vectors, message?: string) {
  if (actual instanceof Array)
    arrayCompare(actual as Vector[], expected as Vector[]);
  else {
    message = message || defaultMessage(actual as List, expected as List);
    assert((actual as Vector).equal2(expected as Vector), message);
  }
}

export function approximately(
  actual: Vectors,
  expected: Vectors,
  tol: number,
  message?: string
) {
  if (actual instanceof Array)
    arrayCompare(actual as Vector[], expected as Vector[], tol);
  else {
    message = message || defaultMessage(actual as List, expected as List);
    assert.approximately(
      (actual as Vector).dist(expected as Vector),
      0,
      tol,
      message
    );
  }
}

export function equal1D(
  actual: number[],
  expected: number[],
  tol?: number,
  index?: number
) {
  actual.forEach((value: number, i: number) => {
    let message = `\n${actual}\n${expected}\nindex: ${
      index ? i + ", " + index : i
    }`;
    if (tol === undefined) assert.equal(value, expected[i], message);
    else assert.approximately(value, expected[i], tol, message);
  });
}

export function equal2D(
  actual: number[][],
  expected: number[][],
  tol?: number
) {
  actual.forEach((row: number[], i: number) => {
    equal1D(row, expected[i], tol, i);
  });
}

export function solved(
  approx: Vector[],
  exact: (t: number) => Vector,
  tol: number,
  dt: number
) {
  approx.forEach((u: Vector, index: number) => {
    assert.approximately(
      u.dist(exact(index * dt)),
      0,
      tol,
      `\napproximated:\t${u.string()}\nexpected:\t${exact(
        index * dt
      ).string()}\nindex: ${index}/${approx.length}\n`
    );
  });
}

function arrayCompare(actual: Vector[], expected: Vector[], tol?: number) {
  actual.forEach((value: Vector & List, index: number) => {
    let message = `\n${actual}\n${expected}\nindex: ${index}`;
    if (tol) {
      approximately(value, expected[index], tol, message);
    } else {
      equal(value, expected[index], message);
    }
  });
}

import { assert } from "chai";
import { Vector3, Vector6 } from "../../src/algebra";
import { VectorSolver } from "../../src/solvers/";
import Timer from "../../src/solvers/Timer";
import * as assert3 from "./assert3";

type Tuple6 = [number, number, number, number, number, number];

describe("Solver Tests", function () {
  let oSolver: VectorSolver<Vector6>, gSolver: VectorSolver<Vector6>;

  const freq = 1 / 100;
  const acc = 10;
  const pulse = freq * 2 * Math.PI;
  const pulse2 = pulse * pulse;
  const pulse3 = pulse * pulse * pulse;
  const tmax = 1;
  const numericTol = tmax * 100 * Number.EPSILON;

  const gdt = 0.00001;
  const odt = 0.00001 / pulse;

  const oIterations = Math.floor(tmax / odt);
  const gIterations = Math.floor(tmax / gdt);

  const oTmax = oIterations * odt;
  const gTmax = gIterations * gdt;

  const oExact = (t: number) => {
    const position = Vector3.ez.mul(Math.cos(pulse * t)).xyz;
    const speed = Vector3.ez.mul(-Math.sin(pulse * t) * pulse).xyz;
    const state: Tuple6 = [...position, ...speed];
    return new Vector6(...state);
  };
  const gExact = (t: number) => {
    const position = Vector3.ez.mul((acc * t ** 2) / 2).xyz;
    const speed = Vector3.ez.mul(acc * t).xyz;
    const state: Tuple6 = [...position, ...speed];
    return new Vector6(...state);
  };

  const oEq = (u: Vector6) =>
    new Vector6(0, 0, u.lower[2], 0, 0, -pulse2 * u.upper[2]);
  const gEq = (u: Vector6) => new Vector6(0, 0, u.lower[2], 0, 0, acc);

  const oInitial = Vector6.e(2);
  const gInitial = Vector6.zeros;

  const oUpper = Math.sqrt(pulse2 ** 2 * (1 + pulse2));
  const gUpper = acc;

  const oLipschitz = 1 / pulse;
  const gLipschitz = 1;

  const oLte = (t: number) =>
    new Vector6(
      0,
      0,
      -pulse2 * Math.cos(pulse * t),
      0,
      0,
      -pulse3 * Math.sin(pulse * t)
    ).mul(odt ** odt / 2);

  const gLte = (t: number) =>
    new Vector6(0, 0, acc, 0, 0, 0).mul((gdt * gdt) / 2);

  // Global Truncation Error
  const oGte = (t: number) =>
    (odt * oUpper * (Math.exp(oLipschitz * t) - 1)) / (2 * oLipschitz);
  const gGte = (t: number) =>
    (gdt * gUpper * (Math.exp(gLipschitz * t) - 1)) / (2 * gLipschitz);

  const printGte = (gte: number) => `(gte: ${gte.toFixed(9)})`;

  const checkLte = (error: Vector6, lte: Vector6, tol: number) => {
    assert.isTrue(
      Math.abs(error.upper[2]) - tol < Math.abs(lte.upper[2]) + tol,
      `${error.upper.string()} >= ${lte.upper.string()}`
    );
    assert.isTrue(
      Math.abs(error.lower[2]) - tol < Math.abs(lte.lower[2]) + tol,
      `${error.lower.string()} >= ${lte.lower.string()}`
    );
  };

  describe("Time management", () => {
    beforeEach(() => {
      gSolver = new VectorSolver(gInitial, gEq, new Timer(gdt));
    });

    it("should advance time to step", () => {
      gSolver.step();
      assert.equal(gSolver.timer.t1, gdt);
    });

    it("should advance time to duration", () => {
      gSolver.advance(tmax);
      assert.equal(gSolver.timer.t1, tmax);
    });

    it("should advance time to iterations", () => {
      gSolver.iterate(gIterations);
      assert.equal(gSolver.timer.t1, gIterations * gdt);
    });
  });

  describe("Index management", () => {
    beforeEach(() => {
      gSolver = new VectorSolver(gInitial, gEq, new Timer(gdt));
    });

    it("should advance time to step", () => {
      gSolver.step();
      assert.equal(gSolver.timer.idx1, 1);
    });

    it("should advance time to duration", () => {
      gSolver.advance(tmax);
      assert.equal(gSolver.timer.idx1, gIterations + 1);
    });

    it("should advance time to iterations", () => {
      gSolver.iterate(gIterations);
      assert.equal(gSolver.timer.idx1, gIterations);
    });
  });

  describe("Solve twice", () => {
    beforeEach(() => {
      gSolver = new VectorSolver(gInitial, gEq, new Timer(gdt));
    });

    it(`should solve twice to duration ${printGte(gGte(2 * tmax))}`, () => {
      gSolver.advance(tmax);
      assert3.approximately(
        gSolver.advance(tmax),
        gExact(2 * tmax),
        gGte(2 * tmax)
      );
    });

    it(`should solve twice to iterations ${printGte(gGte(2 * gTmax))}`, () => {
      gSolver.iterate(gIterations);
      assert3.approximately(
        gSolver.iterate(gIterations),
        gExact(2 * gTmax),
        gGte(2 * gTmax)
      );
    });
  });

  describe("Precision tests", () => {
    // constant acceleration d2u/dt2 = k
    describe("Constant acceleration", () => {
      beforeEach(() => {
        gSolver = new VectorSolver(gInitial, gEq, new Timer(gdt));
      });

      it("should solve one step", () => {
        for (let i = 0; i < gIterations; i++) {
          gSolver.u0 = gExact(i * gdt);
          const lte = gLte(i * gdt);
          const error = gExact((i + 1) * gdt).sub(gSolver.step());
          checkLte(error, lte, Math.sqrt(2) * gdt ** 3 + numericTol);
        }
      });

      it("should solve several steps", () => {
        const solution = [gInitial.clone()];
        for (let i = 1; i < gIterations; i++) {
          solution.push(gSolver.step().clone());
        }
        assert3.solved(solution, gExact, gGte(tmax), gdt);
      });

      it(`should solve during duration ${printGte(gGte(tmax))}`, () =>
        assert3.approximately(gSolver.advance(tmax), gExact(tmax), gGte(tmax)));

      it(`should solve until iterations ${printGte(gGte(tmax))}`, () =>
        assert3.approximately(
          gSolver.iterate(gIterations),
          gExact(gTmax),
          gGte(gTmax)
        ));
    });

    // harmonic oscillator d2u/dt2 = -w^2 * u
    describe("Harmonic oscillator", () => {
      beforeEach(() => {
        oSolver = new VectorSolver(oInitial, oEq, new Timer(odt));
      });

      it("should solve one step", () => {
        for (let i = 0; i < oIterations; i++) {
          oSolver.u0 = oExact(i * odt);
          const lte = oLte(i * odt);
          const error = oExact((i + 1) * odt).sub(oSolver.step());
          checkLte(error, lte, Math.sqrt(2) * odt ** 3 + numericTol);
        }
      });

      it("should solve several steps", () => {
        const solution = [oInitial.clone()];
        for (let i = 1; i < oIterations; i++) {
          solution.push(oSolver.step().clone());
        }
        assert3.solved(solution, oExact, oGte(tmax), odt);
      });

      it(`should solve during duration ${printGte(oGte(tmax))}`, () =>
        assert3.approximately(oSolver.advance(tmax), oExact(tmax), oGte(tmax)));

      it(`should solve until iterations ${printGte(oGte(oTmax))}`, () =>
        assert3.approximately(
          oSolver.iterate(oIterations),
          oExact(oTmax),
          oGte(oTmax)
        ));
    });
  });
});

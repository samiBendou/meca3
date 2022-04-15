import { assert } from "chai";
import { Matrix3, Vector3 } from "../../src/";
import { epsilon } from "../../src/common/utils";
import * as assert3 from "./assert3";

describe("Matrix3 Tests", () => {
  let eye: Matrix3,
    u1: Matrix3,
    u2: Matrix3,
    c: Matrix3,
    magic: Matrix3,
    zeros: Matrix3,
    ones: Matrix3;

  beforeEach(() => {
    eye = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);

    u1 = new Matrix3(2, 0, 0, 0, 2, 0, 0, 0, 2);

    u2 = new Matrix3(2, -1, 0, -1, 2, -1, 0, -1, 2);

    // inverse of u2
    c = new Matrix3(0.75, 0.5, 0.25, 0.5, 1.0, 0.5, 0.25, 0.5, 0.75);

    zeros = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);

    ones = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);

    magic = new Matrix3(1, 2, 3, 1, 2, 3, 1, 2, 3);
  });

  it("initialized", () =>
    assert3.equal1D(
      [
        magic.x[0],
        magic.x[1],
        magic.x[2],
        magic.y[0],
        magic.y[1],
        magic.y[2],
        magic.z[0],
        magic.z[1],
        magic.z[2],
      ],
      [1, 2, 3, 1, 2, 3, 1, 2, 3]
    ));

  describe("Zero", () => {
    it("gets zero norm 2", () => assert.isTrue(zeros.zero2()));
    it("differentiates zeros norm 2", () => assert.isFalse(ones.zero2()));
  });

  describe("Equality", () => {
    it("differentiates norm 2", () => assert.isFalse(ones.equal2(magic)));
    it("equals norm 2", () => assert.isTrue(magic.equal2(magic)));
  });

  describe("Clone/Copy", () => {
    it("clones object", () =>
      assert3.equal(eye.clone(), new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1)));
    it("does not modify original object", () => {
      magic.clone().x[0] = 5;
      assert.equal(magic.x[0], 1);
    });
    it("copies object", () => assert3.equal(eye.copy(magic), magic));
  });

  describe("Generators", () => {
    it("gets zeros", () => assert3.equal(Matrix3.zeros, zeros));
    it("gets ones", () => assert3.equal(Matrix3.ones, ones));
    it("gets scalar", () => assert3.equal(Matrix3.scalar(2), u1));
    it("gets identity", () => assert3.equal(Matrix3.eye, eye));
    it("gets diagonal", () => assert3.equal(Matrix3.diag(1, 1, 1), eye));
    it("gets symmetrical", () =>
      assert3.equal(Matrix3.sym(2, 2, 2, -1, -1), u2));
    it("gets anti-symmetrical", () =>
      assert3.equal(
        Matrix3.asym(2, 2, 2, 1, 1),
        new Matrix3(2, 1, 0, -1, 2, 1, 0, -1, 2)
      ));

    describe("Circular Rotation", () => {
      const angle = Math.PI / 2;

      it("rotates around Ox", () =>
        assert3.equal(Matrix3.rotX(Math.PI / 2).prodv(Vector3.ey), Vector3.ez));
      it("rotates around Oy", () =>
        assert3.equal(Matrix3.rotY(Math.PI / 2).prodv(Vector3.ez), Vector3.ex));
      it("rotates around Oz", () =>
        assert3.equal(Matrix3.rotZ(Math.PI / 2).prodv(Vector3.ex), Vector3.ey));

      it("generates rotation of axis Ox", () =>
        assert3.equal(Matrix3.rotX(angle), Matrix3.rot(Vector3.ex, angle)));
      it("generates rotation of axis Oy", () =>
        assert3.equal(Matrix3.rotY(angle), Matrix3.rot(Vector3.ey, angle)));
      it("generates rotation of axis Oz", () =>
        assert3.equal(Matrix3.rotZ(angle), Matrix3.rot(Vector3.ez, angle)));
    });

    describe("Elliptic Rotation", () => {
      const angle = Math.PI / 2;
      const u1 = 2,
        u2 = 1;
      const cos = (theta: number) => Math.cos(theta),
        sin = (theta: number) => (u2 / u1) * Math.sin(theta);

      it("rotates around Ox", () =>
        assert3.equal(
          Matrix3.rotX(Math.PI / 2, cos, sin).prodv(Vector3.ey.mul(u1)),
          Vector3.ez
        ));
      it("rotates around Oy", () =>
        assert3.equal(
          Matrix3.rotY(Math.PI / 2, cos, sin).prodv(Vector3.ez.mul(u1)),
          Vector3.ex
        ));
      it("rotates around Oz", () =>
        assert3.equal(
          Matrix3.rotZ(Math.PI / 2, cos, sin).prodv(Vector3.ex.mul(u1)),
          Vector3.ey
        ));

      it("generates rotation of axis Ox", () =>
        assert3.equal(
          Matrix3.rotX(angle, cos, sin),
          Matrix3.rot(Vector3.ex, angle, cos, sin)
        ));
      it("generates rotation of axis Oy", () =>
        assert3.equal(
          Matrix3.rotY(angle, cos, sin),
          Matrix3.rot(Vector3.ey, angle, cos, sin)
        ));
      it("generates rotation of axis Oz", () =>
        assert3.equal(
          Matrix3.rotZ(angle, cos, sin),
          Matrix3.rot(Vector3.ez, angle, cos, sin)
        ));
    });

    describe("Hyperbolic Rotation", () => {
      const angle = Math.PI / 2,
        tol = 0.2e-6;
      const cos = (theta: number) => Math.cosh(theta),
        sin = (theta: number) => Math.sinh(theta);

      const resX = Matrix3.rotX(angle, cos, sin).prodv(Vector3.ey),
        resY = Matrix3.rotY(angle, cos, sin).prodv(Vector3.ez),
        resZ = Matrix3.rotZ(angle, cos, sin).prodv(Vector3.ex);

      it("rotates around Ox", () =>
        assert.approximately(
          resX.y ** 2 - resX.z ** 2,
          1,
          tol,
          `\nresX : ${resX}`
        ));
      it("rotates around Oy", () =>
        assert.approximately(
          resY.z ** 2 - resY.x ** 2,
          1,
          tol,
          `\nresY : ${resY}`
        ));
      it("rotates around Oz", () =>
        assert.approximately(
          resZ.x ** 2 - resZ.y ** 2,
          1,
          tol,
          `\nresZ : ${resZ}`
        ));

      it("generates rotation of axis Ox", () =>
        assert3.equal(
          Matrix3.rotX(angle, cos, sin),
          Matrix3.rot(Vector3.ex, angle, cos, sin)
        ));
      it("generates rotation of axis Oy", () =>
        assert3.equal(
          Matrix3.rotY(angle, cos, sin),
          Matrix3.rot(Vector3.ey, angle, cos, sin)
        ));
      it("generates rotation of axis Oz", () =>
        assert3.equal(
          Matrix3.rotZ(angle, cos, sin),
          Matrix3.rot(Vector3.ez, angle, cos, sin)
        ));
    });
  });

  describe("Coordinates", () => {
    it("gets xx", () => assert.equal(u2.xx, 2));
    it("gets yx", () => assert.equal(u2.yx, -1));
    it("gets zx", () => assert.equal(u2.zx, 0));
    it("gets xy", () => assert.equal(u2.xy, -1));
    it("gets yy", () => assert.equal(u2.yy, 2));
    it("gets zy", () => assert.equal(u2.zy, -1));
    it("gets xz", () => assert.equal(u2.xz, 0));
    it("gets yz", () => assert.equal(u2.yz, -1));
    it("gets zz", () => assert.equal(u2.zz, 2));
  });

  describe("Manipulators", () => {
    describe("Rows", () => {
      describe("Getters", () => {
        const array0 = [1, 0, 0],
          array1 = [0, 1, 0],
          array2 = [0, 0, 1];
        const u0 = Vector3.array(array0),
          u1 = Vector3.array(array1),
          u2 = Vector3.array(array2);

        it("gets row 0", () => assert3.equal1D(eye.row(0), array0));
        it("gets row 1", () => assert3.equal1D(eye.row(1), array1));
        it("gets row 2", () => assert3.equal1D(eye.row(2), array2));
        it("gets row x", () => assert3.equal(eye.x, u0));
        it("gets row y", () => assert3.equal(eye.y, u1));
        it("gets row z", () => assert3.equal(eye.z, u2));
        it("gets all rows as 2D array", () =>
          assert3.equal2D(eye.rows, [array0, array1, array2]));
        it("gets all rows as vectors", () =>
          assert3.equal(eye.xyz, [u0, u1, u2]));
      });

      describe("Setters", () => {
        it("set row with vector", () => {
          eye.x = Vector3.ez;
          assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 0, 0, 1));
        });
        it("sets all rows with vectors", () => {
          eye.xyz = [Vector3.ez, Vector3.ey, Vector3.ex];
          assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 1, 0, 0));
        });
        it("sets all rows with 2D array", () => {
          magic.rows = [
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
          ];
          assert3.equal(magic, u1);
        });
      });
    });

    describe("Cols", () => {
      describe("Getters", () => {
        const array0 = [1, 1, 1],
          array1 = [2, 2, 2],
          array2 = [3, 3, 3];
        const u0 = Vector3.array(array0),
          u1 = Vector3.array(array1),
          u2 = Vector3.array(array2);

        it("gets col 0", () => assert3.equal1D(magic.col(0), array0));
        it("gets col 1", () => assert3.equal1D(magic.col(1), array1));
        it("gets col 2", () => assert3.equal1D(magic.col(2), array2));
        it("gets all columns as 2D array", () =>
          assert3.equal2D(magic.cols, [array0, array1, array2]));
        it("gets all columns as vectors", () =>
          assert3.equal(magic.xyzt, [u0, u1, u2]));
      });

      describe("Setters", () => {
        it("sets all columns with vectors", () => {
          eye.xyzt = [Vector3.ez, Vector3.ey, Vector3.ex];
          assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 1, 0, 0));
        });
        it("sets all columns with 2D array", () => {
          magic.cols = [
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
          ];
          assert3.equal(magic, u1);
        });
      });
    });
  });

  describe("Algebra", () => {
    describe("Transposition", () => {
      it("gets transpose", () =>
        assert3.equal(
          magic.clone().trans(),
          new Matrix3(1, 1, 1, 2, 2, 2, 3, 3, 3)
        ));
    });

    describe("Matrix Multiplication", () => {
      it("conserves identity", () =>
        assert3.equal(eye.clone().prod(eye), Matrix3.eye));
      it("gets product", () =>
        assert3.equal(magic.clone().prod(u1), magic.clone().mul(2)));
    });

    describe("Vector Multiplication", () => {
      const u = Vector3.ones;
      it("conserves identity", () => assert3.equal(eye.clone().prodv(u), u));
      it("gets product", () =>
        assert3.equal(magic.prodv(u.clone()), Vector3.scalar(6)));
    });

    describe("Determinant", () => {
      it("gets 1 on identity", () => assert.approximately(eye.det, 1, epsilon));
      it("gets 0 on non invertible", () =>
        assert.approximately(magic.det, 0, epsilon));
      it("gets determinant", () => assert.approximately(u2.det, 4, epsilon));
    });

    describe("Inversion", () => {
      it("conserves identity", () =>
        assert3.equal(eye.clone().inv(), Matrix3.eye));
      it("gets inverse", () => assert3.equal(u2.clone().inv(), c));
      it("can return to neutral", () =>
        assert3.equal(u2.prod(u2.clone().inv()), eye));
    });

    describe("Exponentiation", () => {
      it("conserves identity", () => assert3.equal(eye.clone().pow(3), eye));
      it("return identity on 0", () =>
        assert3.equal(magic.clone().pow(0), eye));
      it("is neutral on 1", () => assert3.equal(u2.clone().pow(1), u2));
      it("gets product on positive", () =>
        assert3.equal(eye.clone().mul(2).pow(4), Matrix3.eye.mul(16)));
      it("gets product on negative", () =>
        assert3.equal(u2.clone().pow(-1), c));
    });
  });

  describe("Geometry", () => {
    describe("Magnitude", () => {
      it("gets magnitude", () => assert.equal(u1.mag, Math.sqrt(12)));
      it("gets squared magnitude", () => assert.equal(u1.mag2, 12));
    });

    describe("Distance", () => {
      it("gets distance", () => assert.equal(eye.dist(u1), Math.sqrt(3)));
      it("gets squared distance", () => assert.equal(eye.dist2(u1), 3));
    });
  });

  describe("Serialize", () => {
    const a2D = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const a1D = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    it("encodes to 1D array", () => assert3.equal1D(eye.array(), a1D));
    it("encodes to string", () =>
      assert.equal(eye.string(), "(1, 0, 0)\n(0, 1, 0)\n(0, 0, 1)"));
    it("decodes from 1D array", () => assert3.equal(Matrix3.array(a1D), eye));
    it("decodes from 2D array", () => assert3.equal(Matrix3.rows(a2D), eye));
  });

  describe("Generators", () => {});
});

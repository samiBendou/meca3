import { assert } from "chai";
import { Vector3, Vector6 } from "../../src/algebra";
import * as assert3 from "./assert3";

describe("Vector6 Tests", () => {
  let ex: Vector6,
    ey: Vector6,
    ez: Vector6,
    zeros: Vector6,
    ones: Vector6,
    magic: Vector6;

  beforeEach(() => {
    ex = new Vector6(1, 0, 0, 0, 0, 0);
    ey = new Vector6(0, 1, 0, 0, 0, 0);
    ez = new Vector6(0, 0, 1, 0, 0, 0);
    zeros = new Vector6(0, 0, 0, 0, 0, 0);
    ones = new Vector6(1, 1, 1, 1, 1, 1);
    magic = new Vector6(1, 2, 3, 4, 5, 6);
  });
  it("initialized", () =>
    assert3.equal1D(
      [
        magic.upper[0],
        magic.upper[1],
        magic.upper[2],
        magic.lower[0],
        magic.lower[1],
        magic.lower[2],
      ],
      [1, 2, 3, 4, 5, 6]
    ));

  describe("Zero", () => {
    describe("exact", () => {
      it("gets zero", () => assert.isTrue(zeros.nil()));
      it("differentiates zeros", () => assert.isFalse(ex.nil()));
    });
    describe("norm 1", () => {
      it("gets zero", () => assert.isTrue(zeros.zero1()));
      it("differentiates zeros", () => assert.isFalse(ex.zero1()));
    });
    describe("norm 2", () => {
      it("gets zero", () => assert.isTrue(zeros.zero2()));
      it("differentiates zeros", () => assert.isFalse(ex.zero2()));
    });
  });

  describe("Clone/Copy", () => {
    it("clones object", () =>
      assert3.equal(magic.clone(), new Vector6(1, 2, 3, 4, 5, 6)));
    it("does not modify original object", () => {
      magic.clone().upper[0] = 5;
      assert3.equal(magic, new Vector6(1, 2, 3, 4, 5, 6));
    });
    it("copies object", () => assert3.equal(magic.copy(ex), ex));
  });

  describe("Generators", () => {
    it("gets zeros", () =>
      assert3.equal(Vector6.zeros, new Vector6(0, 0, 0, 0, 0, 0)));
    it("gets ones", () =>
      assert3.equal(Vector6.ones, new Vector6(1, 1, 1, 1, 1, 1)));
    it("gets scalar", () =>
      assert3.equal(Vector6.scalar(3), new Vector6(3, 3, 3, 3, 3, 3)));

    describe("Basis", () => {
      describe("Cartesian", () => {
        it("gets upper vector", () =>
          assert3.equal(magic.upper, new Vector3(1, 2, 3)));
        it("gets lower vector", () =>
          assert3.equal(magic.lower, new Vector3(4, 5, 6)));
      });
    });
  });

  describe("Coordinates", () => {
    describe("Getters", () => {});

    describe("Setters", () => {});
  });

  describe("Algebra", () => {
    it("adds", () =>
      assert3.equal(magic.clone().add(ones), new Vector6(2, 3, 4, 5, 6, 7)));
    it("subtracts", () =>
      assert3.equal(magic.clone().sub(ones), new Vector6(0, 1, 2, 3, 4, 5)));
    it("negates", () =>
      assert3.equal(magic.clone().neg(), new Vector6(-1, -2, -3, -4, -5, -6)));
    it("multiplies with scalar", () =>
      assert3.equal(magic.clone().mul(2), new Vector6(2, 4, 6, 8, 10, 12)));
    it("multiplies with vector", () =>
      assert3.equal(magic.clone().prod(ey), new Vector6(0, 2, 0, 0, 0, 0)));
    it("inverses with vector", () =>
      assert3.equal(
        magic.clone().inv(),
        new Vector6(1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6)
      ));
    it("divides", () =>
      assert3.equal(magic.clone().div(0.5), new Vector6(2, 4, 6, 8, 10, 12)));
    it("interpolates", () =>
      assert3.equal(
        ex.clone().lerp(ex.clone().mul(2), 0.5),
        new Vector6(1.5, 0, 0, 0, 0, 0)
      ));
    it("can assign during operation", () =>
      assert3.equal(magic.clone().add(ones), new Vector6(2, 3, 4, 5, 6, 7)));
  });

  describe("Geometry", () => {
    it("gets dot product", () => assert.equal(magic.dot(magic), 91));

    describe("Magnitude", () => {
      it("gets magnitude", () => assert.equal(magic.mag, Math.sqrt(91)));
      it("gets squared magnitude", () => assert.equal(magic.mag2, 91));
    });

    describe("Distance", () => {
      it("gets distance", () => assert.equal(ex.dist(ey), Math.sqrt(2)));
      it("gets squared distance", () => assert.equal(zeros.dist2(ones), 6));
    });
  });

  describe("Serialization", () => {
    const aD = [1, 0, 0, 0, 0, 0];
    it("encodes to array", () => assert3.equal1D(ex.array(), aD));
    it("decodes to array", () => assert3.equal(Vector6.array(aD), ex));
    it("encodes to string", () =>
      assert.equal(ex.string(), "(1, 0, 0, 0, 0, 0)"));
  });
});

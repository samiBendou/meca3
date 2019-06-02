const assert = require("chai").assert;

describe("Vector3 Tests", function () {
    const Vector3 = require("../Vector3.js");

    let u = Vector3.ex;
    let v = Vector3.ey;
    let w = Vector3.ez;

    it("Add", function () {
        assert(u.copy().add(u).isEqual(new Vector3(2, 0, 0)));
        assert(u.copy().add(v).isEqual(new Vector3(1, 1, 0)));
    });

    it("Opposite", function () {
        assert(u.copy().opp().isEqual(new Vector3(-1, 0, 0)));
        assert(v.copy().opp().isEqual(new Vector3(0, -1, 0)));
    });

    it("Multiply", function () {
        assert(u.copy().mul(5).isEqual(new Vector3(5, 0, 0)));
        assert(v.copy().mul(-5).isEqual(new Vector3(0, -5, 0)));
    });

    it("Dot Product", function () {
        assert.approximately(u.scal(u), 1, Number.EPSILON);
        assert.approximately(u.scal(v), 0, Number.EPSILON);
    });

    it("Angle", function () {
        assert.approximately(u.angle(v), Math.PI / 2, Number.EPSILON);
        assert.approximately(u.angle(w), Math.PI / 2, Number.EPSILON);
        assert.approximately(u.angle(u), 0.0, Number.EPSILON);
    });

    it("Cross Product", function () {
        assert(u.copy().cross(v).isEqual(new Vector3(0, 0, 1)));
        assert(v.copy().cross(w).isEqual(new Vector3(1, 0, 0)));
        assert(w.copy().cross(u).isEqual(new Vector3(0, 1, 0)));
        assert(u.copy().cross(u).isEqual(new Vector3(0, 0, 0)));
    });

    it("Get coordinates", function () {
        assert.approximately(u.r, 1, Number.EPSILON);
        assert.approximately(u.rxy, 1, Number.EPSILON);
        assert.approximately(u.theta, 0, Number.EPSILON);
        assert.approximately(u.phi, Math.PI / 2, Number.EPSILON);
    });

    it("Set coordinates", function () {
        u.r = 2;
        assert(u.isEqual(new Vector3(2, 0, 0)));

        u.theta = Math.PI / 2;
        assert(u.isEqual(new Vector3(0, 2, 0)));

        u.phi = 0;
        assert(u.isEqual(new Vector3(0, 0, 2)));

        u = Vector3.ex;
    });

    it("Equality", function () {
        assert.isFalse(u.isEqual(v));
        assert.isTrue(u.isEqual(u));
        assert.isFalse(u.isEqual(u.copy().mul(1 + Number.EPSILON)));
    });

    it("Derivative", function () {
        let expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        Vector3.der([u, v, w], [1, 1, 1]).forEach(function (vector, index) {
            assert(vector.isEqual(expected[index]));
        });
    });

    it("Serialize", function () {
        let uExpected = [1, 0, 0];
        u.toArray().forEach(function (s, index) {
            assert.equal(s, uExpected[index]);
        });
        assert(Vector3.fromArray([1, 0, 0]).isEqual(u));
    });
});
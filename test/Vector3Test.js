const assert = require("chai").assert;

describe("Vector3 Tests", function () {
    const Vector3 = require("../Vector3.js");

    let u, v, w;

    function setUp() {
        u = Vector3.ex;
        v = Vector3.ey;
        w = Vector3.ez;
    }

    it("Add", function () {
        setUp();
        assert(u.copy().add(u).isEqual(new Vector3(2, 0, 0)));
        assert(u.copy().add(v).isEqual(new Vector3(1, 1, 0)));
    });

    it("Opposite", function () {
        setUp();
        assert(u.copy().opp().isEqual(new Vector3(-1, 0, 0)));
        assert(v.copy().opp().isEqual(new Vector3(0, -1, 0)));
    });

    it("Multiply", function () {
        setUp();
        assert(u.copy().mul(5).isEqual(new Vector3(5, 0, 0)));
        assert(v.copy().mul(-5).isEqual(new Vector3(0, -5, 0)));
    });

    it("Dot Product", function () {
        setUp();
        assert.approximately(u.scal(u), 1, Number.EPSILON);
        assert.approximately(u.scal(v), 0, Number.EPSILON);
    });

    it("Angle", function () {
        setUp();
        assert.approximately(u.angle(v), Math.PI / 2, Number.EPSILON);
        assert.approximately(u.angle(w), Math.PI / 2, Number.EPSILON);
        assert.approximately(u.angle(u), 0.0, Number.EPSILON);
    });

    it("Cross Product", function () {
        setUp();
        assert(u.copy().cross(v).isEqual(new Vector3(0, 0, 1)));
        assert(v.copy().cross(w).isEqual(new Vector3(1, 0, 0)));
        assert(w.copy().cross(u).isEqual(new Vector3(0, 1, 0)));
        assert(u.copy().cross(u).isEqual(new Vector3(0, 0, 0)));
    });

    it("Get coordinates", function () {
        setUp();
        assert.approximately(u.r, 1, Number.EPSILON);
        assert.approximately(u.rxy, 1, Number.EPSILON);
        assert.approximately(u.theta, 0, Number.EPSILON);
        assert.approximately(u.phi, Math.PI / 2, Number.EPSILON);

        assert.approximately(u.lat, 0, Number.EPSILON);
        assert.approximately(u.lon, 0, Number.EPSILON);
        assert.approximately(w.lat, Math.PI / 2, Number.EPSILON);
        assert.approximately(v.lon, Math.PI / 2, Number.EPSILON);
        assert.approximately(v.copy().opp().lon, -Math.PI / 2, Number.EPSILON);

        assert.approximately(Vector3.zeros.phi, 0, Number.EPSILON);
        assert.approximately(Vector3.zeros.theta, 0, Number.EPSILON);
    });

    it("Set coordinates", function () {
        setUp();
        u.r = 2;
        assert(u.isEqual(new Vector3(2, 0, 0)));

        u.theta = Math.PI / 2;
        assert(u.isEqual(new Vector3(0, 2, 0)));

        u.phi = 0;
        assert(u.isEqual(new Vector3(0, 0, 2)));

        u.x = 0;
        u.y = 1;
        u.z = 1;
        u.rxy = 3;
        assert(u.isEqual(new Vector3(0, 3, 1)));

        u.y = 0;
        u.lat = 0;
        assert(u.isEqual(new Vector3(1, 0, 0)));

        u.lon = Math.PI / 2;
        assert(u.isEqual(new Vector3(0, 1, 0)));

        u.lon = -Math.PI / 2;
        assert(u.isEqual(new Vector3(0, -1, 0)));
    });

    it("Equality", function () {
        setUp();
        assert.isFalse(u.isEqual(v));
        assert.isTrue(u.isEqual(u));
        assert.isFalse(u.isEqual(u.copy().mul(1 + Number.EPSILON)));
    });

    it("Derivative", function () {
        setUp();
        let expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        Vector3.derivative([u, v, w], [1, 1, 1]).forEach((vector, index) => {
            assert(vector.isEqual(expected[index]));
        });

        Vector3.derivative([u, v, w], 1).forEach((vector, index) => {
            assert(vector.isEqual(expected[index]));
        });
    });

    it("Serialize", function () {
        setUp();
        let uExpected = [1, 0, 0];
        u.to1D().forEach((s, index) => {
            assert.equal(s, uExpected[index])
        });
        assert(Vector3.from1D([1, 0, 0]).isEqual(u));

        assert.equal(u.toString(), "(1.00 0.00 0.00)");
    });

    it("Spherical basis", function () {
        assert(Vector3.er(Vector3.ex).isEqual(Vector3.ex));
        assert(Vector3.er(Vector3.ey).isEqual(Vector3.ey));
        assert(Vector3.er(Vector3.ez).isEqual(Vector3.ez));

        assert(Vector3.etheta(Vector3.ex).isEqual(Vector3.ey));
        assert(Vector3.etheta(Vector3.ey).isEqual(Vector3.ex.opp()));
        assert(Vector3.etheta(Vector3.ez).isEqual(Vector3.ey));

        assert(Vector3.ephi(Vector3.ex).isEqual(Vector3.ez.opp()));
        assert(Vector3.ephi(Vector3.ey).isEqual(Vector3.ez.opp()));
        assert(Vector3.ephi(Vector3.ez).isEqual(Vector3.ex));
    });

    it("Coordinates generators", function () {
        assert(Vector3.cylindrical(1, 0, 0).isEqual(Vector3.ex));
        assert(Vector3.cylindrical(1, Math.PI / 2, 0).isEqual(Vector3.ey));
        assert(Vector3.cylindrical(0, 0, 1).isEqual(Vector3.ez));

        assert(Vector3.spherical(1, 0, Math.PI / 2).isEqual(Vector3.ex));
        assert(Vector3.spherical(1, Math.PI / 2, Math.PI / 2).isEqual(Vector3.ey));
        assert(Vector3.spherical(1, 0, 0).isEqual(Vector3.ez));
    });
});
const assert = require("./common.js");

describe("Vector3 Tests", function () {
    const Vector3 = require("../Vector3.js");

    let u, v, w;

    function setUp() {
        u = Vector3.ex;
        v = Vector3.ey;
        w = Vector3.ez;
    }

    it("Equality", function () {
        setUp();
        assert.isFalse(u.isEqual(v));
        assert.isTrue(u.isEqual(u));
        assert.isFalse(u.isEqual(u.copy().mul(1 + Number.EPSILON)));
    });

    it("Fill", function () {
        setUp();
        assert.meca3.equal(u.fill(3), new Vector3(3, 3, 3));
    });

    it("Add", function () {
        setUp();
        assert.meca3.equal(u.addc(u), new Vector3(2, 0, 0), `\n${u} + ${u} = ${u.addc(u)}`);
        assert.meca3.equal(u.addc(v), new Vector3(1, 1, 0), `\n${u} + ${v} = ${u.addc(v)}`);
        assert.meca3.equal(u.subc(u), new Vector3(0, 0, 0), `\n${u} - ${u} = ${u.subc(u)}`);
    });

    it("Opposite", function () {
        setUp();
        assert.meca3.equal(u.oppc(), new Vector3(-1, 0, 0), `\n-${u} = ${u.oppc()}`);
        assert.meca3.equal(v.oppc(), new Vector3(0, -1, 0), `\n-${v} = ${v.oppc()}`);
    });

    it("Multiply", function () {
        setUp();
        assert.meca3.equal(u.mulc(5), new Vector3(5, 0, 0), `\n5 * ${u} = ${u.mulc(5)}`);
        assert.meca3.equal(v.mulc(-5), new Vector3(0, -5, 0), `\n-5 * ${u} = ${u.mulc(-5)}`);
        assert.meca3.equal(v.divc(2), new Vector3(0, 0.5, 0), `\n${u} / 2 = ${u.divc(2)}`);
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
        assert.meca3.equal(u.crossc(v), new Vector3(0, 0, 1), `\n${u} x ${v} = ${u.crossc(v)}`);
        assert.meca3.equal(v.crossc(w), new Vector3(1, 0, 0), `\n${v} x ${w} = ${u.crossc(w)}`);
        assert.meca3.equal(w.crossc(u), new Vector3(0, 1, 0), `\n${w} x ${u} = ${w.crossc(u)}`);
        assert.meca3.equal(u.crossc(u), new Vector3(0, 0, 0), `\n${u} x ${u} = ${u.crossc(u)}`);
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
        assert.meca3.equal(u, new Vector3(2, 0, 0));

        u.theta = Math.PI / 2;
        assert.meca3.equal(u, new Vector3(0, 2, 0));

        u.phi = 0;
        assert.meca3.equal(u, new Vector3(0, 0, 2));

        u.x = 0;
        u.y = 1;
        u.z = 1;
        u.rxy = 3;
        assert.meca3.equal(u, new Vector3(0, 3, 1));

        u.y = 0;
        u.lat = 0;
        assert.meca3.equal(u, new Vector3(1, 0, 0));

        u.lon = Math.PI / 2;
        assert.meca3.equal(u, new Vector3(0, 1, 0));

        u.lon = -Math.PI / 2;
        assert.meca3.equal(u, new Vector3(0, -1, 0));
    });

    it("Derivative", function () {
        setUp();
        let expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        let derivative = Vector3.derivative([u, v, w], 1);
        assert.meca3.arrayEqual(derivative, expected);
    });

    it("Serialize", function () {
        setUp();
        let u1D = [1, 0, 0];

        assert.meca3.arrayEqual(u.to1D(), u1D);
        assert.meca3.equal(Vector3.from1D(u1D), u);

        assert.equal(u.toString(), "(1.00e+0 0.00e+0 0.00e+0)");
    });

    it("Spherical basis", function () {
        assert.meca3.equal(Vector3.er(Vector3.ex), Vector3.ex);
        assert.meca3.equal(Vector3.er(Vector3.ey), Vector3.ey);
        assert.meca3.equal(Vector3.er(Vector3.ez), Vector3.ez);

        assert.meca3.equal(Vector3.etheta(Vector3.ex), Vector3.ey);
        assert.meca3.equal(Vector3.etheta(Vector3.ey), Vector3.ex.opp());
        assert.meca3.equal(Vector3.etheta(Vector3.ez), Vector3.ey);

        assert.meca3.equal(Vector3.ephi(Vector3.ex), Vector3.ez.opp());
        assert.meca3.equal(Vector3.ephi(Vector3.ey), Vector3.ez.opp());
        assert.meca3.equal(Vector3.ephi(Vector3.ez), Vector3.ex);
    });

    it("Coordinates generators", function () {
        assert.meca3.equal(Vector3.cylindrical(1, 0, 0), Vector3.ex);
        assert.meca3.equal(Vector3.cylindrical(1, Math.PI / 2, 0), Vector3.ey);
        assert.meca3.equal(Vector3.cylindrical(0, 0, 1), Vector3.ez);

        assert.meca3.equal(Vector3.spherical(1, 0, Math.PI / 2), Vector3.ex);
        assert.meca3.equal(Vector3.spherical(1, Math.PI / 2, Math.PI / 2), Vector3.ey);
        assert.meca3.equal(Vector3.spherical(1, 0, 0), Vector3.ez);
    });
});
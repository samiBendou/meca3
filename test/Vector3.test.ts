import {assert} from "chai";
import {check} from "./common";
import {epsilon} from "../src/Algebra";
import {Vector3} from "../src/Vector3";

describe("Vector3 Tests", function () {

    let u: Vector3, v: Vector3, w: Vector3;

    function setUp() {
        u = Vector3.ex;
        v = Vector3.ey;
        w = Vector3.ez;
    }

    it("Equality", function () {
        setUp();
        assert.isFalse(u.isEqual(v));
        assert.isTrue(u.isEqual(u));
        assert.isFalse(u.isEqual(u.copy().mul(1 + epsilon)));
    });

    it("Fill", function () {
        setUp();
        check.equal(u.fill(3), new Vector3(3, 3, 3));
    });

    it("Add", function () {
        setUp();
        check.equal(u.addc(u), new Vector3(2, 0, 0), `\n${u} + ${u} = ${u.addc(u)}`);
        check.equal(u.addc(v), new Vector3(1, 1, 0), `\n${u} + ${v} = ${u.addc(v)}`);
        check.equal(u.subc(u), new Vector3(0, 0, 0), `\n${u} - ${u} = ${u.subc(u)}`);
    });

    it("Opposite", function () {
        setUp();
        check.equal(u.oppc(), new Vector3(-1, 0, 0), `\n-${u} = ${u.oppc()}`);
        check.equal(v.oppc(), new Vector3(0, -1, 0), `\n-${v} = ${v.oppc()}`);
    });

    it("Multiply", function () {
        setUp();
        check.equal(u.mulc(5), new Vector3(5, 0, 0), `\n5 * ${u} = ${u.mulc(5)}`);
        check.equal(v.mulc(-5), new Vector3(0, -5, 0), `\n-5 * ${u} = ${u.mulc(-5)}`);
        check.equal(v.divc(2), new Vector3(0, 0.5, 0), `\n${u} / 2 = ${u.divc(2)}`);
    });

    it("Dot Product", function () {
        setUp();
        assert.approximately(u.scal(u), 1, epsilon);
        assert.approximately(u.scal(v), 0, epsilon);
    });

    it("Angle", function () {
        setUp();
        assert.approximately(u.angle(v), Math.PI / 2, epsilon);
        assert.approximately(u.angle(w), Math.PI / 2, epsilon);
        assert.approximately(u.angle(u), 0.0, epsilon);
    });

    it("Cross Product", function () {
        setUp();
        check.equal(u.crossc(v), new Vector3(0, 0, 1), `\n${u} x ${v} = ${u.crossc(v)}`);
        check.equal(v.crossc(w), new Vector3(1, 0, 0), `\n${v} x ${w} = ${u.crossc(w)}`);
        check.equal(w.crossc(u), new Vector3(0, 1, 0), `\n${w} x ${u} = ${w.crossc(u)}`);
        check.equal(u.crossc(u), new Vector3(0, 0, 0), `\n${u} x ${u} = ${u.crossc(u)}`);
    });

    it("Get coordinates", function () {
        setUp();
        assert.approximately(u.r, 1, epsilon);
        assert.approximately(u.rxy, 1, epsilon);
        assert.approximately(u.theta, 0, epsilon);
        assert.approximately(u.phi, Math.PI / 2, epsilon);

        assert.approximately(u.lat, 0, epsilon);
        assert.approximately(u.lon, 0, epsilon);
        assert.approximately(w.lat, Math.PI / 2, epsilon);
        assert.approximately(v.lon, Math.PI / 2, epsilon);
        assert.approximately(v.copy().opp().lon, -Math.PI / 2, epsilon);

        assert.approximately(Vector3.zeros.phi, 0, epsilon);
        assert.approximately(Vector3.zeros.theta, 0, epsilon);
    });

    it("Set coordinates", function () {
        setUp();
        u.r = 2;
        check.equal(u, new Vector3(2, 0, 0));

        u.theta = Math.PI / 2;
        check.equal(u, new Vector3(0, 2, 0));

        u.phi = 0;
        check.equal(u, new Vector3(0, 0, 2));

        u.x = 0;
        u.y = 1;
        u.z = 1;
        u.rxy = 3;
        check.equal(u, new Vector3(0, 3, 1));

        u.y = 0;
        u.lat = 0;
        check.equal(u, new Vector3(1, 0, 0));

        u.lon = Math.PI / 2;
        check.equal(u, new Vector3(0, 1, 0));

        u.lon = -Math.PI / 2;
        check.equal(u, new Vector3(0, -1, 0));
    });

    it("Derivative", function () {
        setUp();
        let expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        let derivative = Vector3.derivative([u, v, w], 1);
        check.arrayEqual(derivative, expected);
    });

    it("Serialize", function () {
        setUp();
        let u1D = [1, 0, 0];

        check.arrayEqual(u.to1D(), u1D);
        check.equal(Vector3.from1D(u1D), u);

        assert.equal(u.toString(), "(1.00e+0 0.00e+0 0.00e+0)");
    });

    it("Spherical basis", function () {
        check.equal(Vector3.er(Vector3.ex), Vector3.ex);
        check.equal(Vector3.er(Vector3.ey), Vector3.ey);
        check.equal(Vector3.er(Vector3.ez), Vector3.ez);

        check.equal(Vector3.etheta(Vector3.ex), Vector3.ey);
        check.equal(Vector3.etheta(Vector3.ey), Vector3.ex.opp());
        check.equal(Vector3.etheta(Vector3.ez), Vector3.ey);

        check.equal(Vector3.ephi(Vector3.ex), Vector3.ez.opp());
        check.equal(Vector3.ephi(Vector3.ey), Vector3.ez.opp());
        check.equal(Vector3.ephi(Vector3.ez), Vector3.ex);
    });

    it("Coordinates generators", function () {
        check.equal(Vector3.cylindrical(1, 0, 0), Vector3.ex);
        check.equal(Vector3.cylindrical(1, Math.PI / 2, 0), Vector3.ey);
        check.equal(Vector3.cylindrical(0, 0, 1), Vector3.ez);

        check.equal(Vector3.spherical(1, 0, Math.PI / 2), Vector3.ex);
        check.equal(Vector3.spherical(1, Math.PI / 2, Math.PI / 2), Vector3.ey);
        check.equal(Vector3.spherical(1, 0, 0), Vector3.ez);
    });
});
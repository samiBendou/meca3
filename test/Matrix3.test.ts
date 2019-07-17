import {assert} from "chai";
import {assets} from "./common";
import {epsilon} from "../src/Algebra";
import Vector3 from "../src/Vector3";
import Matrix3 from "../src/Matrix3";

describe("Matrix3 Tests", function () {

    let a: Matrix3, b: Matrix3, c: Matrix3, cInv: Matrix3;

    function setUp() {
        a = Matrix3.eye;

        b = new Matrix3(
            1, 2, 3,
            1, 2, 3,
            1, 2, 3
        );

        c = new Matrix3(
            2, -1, 0,
            -1, 2, -1,
            0, -1, 2
        );

        cInv = new Matrix3(
            0.75, 0.50, 0.25,
            0.50, 1.00, 0.50,
            0.25, 0.50, 0.75
        );
    }

    it("Transpose", function () {
        setUp();
        assets.equal(b.transc(), new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        ));
    });

    it("Matrix Product", function () {
        setUp();
        assets.equal(a.prodc(a), a, `\n${a}\n*\n${a}\n=\n${a.prodc(a)}`);
        assets.equal(b.prodc(a.mulc(2)), b.mulc(2), `\n${b}\n*\n${a.mulc(2)}\n=\n${b.prodc(a.mulc(2))}`);
    });

    it("Linear mapping", function () {
        setUp();
        let u = Vector3.ones;
        assets.equal(a.map(u), u, `\n${a}\n*\n${u}\n=\n${a.mapc(u)}`);
        assets.equal(b.mapc(u), new Vector3(6, 6, 6), `\n${b}\n*\n${u}\n=\n${b.mapc(u)}`);
    });

    it("Determinant", function () {
        setUp();
        assert.approximately(a.det, 1, epsilon);
        assert.approximately(b.det, 0, epsilon);
        assert.approximately(c.det, 4, epsilon);
    });

    it("Inverse", function () {
        setUp();
        assets.equal(a.invc(), a, `\n${a}^-1\n=\n${a.invc()}`);
        assets.equal(c.invc(), cInv, `\n${c}^-1\n=\n${c.invc()}`);
        assets.equal(c.prod(c.invc()), a);
    });

    it("Exponentiation", function () {
        setUp();
        assets.equal(a.powc(2), a, `\n${a}^2\n=\n${a.powc(2)}`);
        assets.equal(b.powc(0), a, `\n${b}^0\n=\n${b.powc(0)}`);
        assets.equal(c.powc(1), c, `\n${c}^1\n=\n${c.powc(1)}`);
        assets.equal(a.mulc(2).pow(4), Matrix3.eye.mul(16), `\n(2 * ${a})^4\n=\n${a.mulc(2).pow(4)}`);
        assets.equal(c.powc(-1), cInv, `\n${c}^-1\n=\n${c.powc(-1)}`);
        assets.equal(Matrix3.ones.powc(3), Matrix3.ones.mul(9));
    });

    it("Get elements", function () {
        setUp();
        let assertRow = new Vector3(1, 2, 3);
        assets.equal(b.row(0), assertRow);
        assets.equal(b.row(2), assertRow);

        assets.equal(a.col(0), Vector3.ex);
        assets.equal(a.col(2), Vector3.ez);
    });

    it("Rotation", function () {
        setUp();
        const angle = Math.PI / 2;

        assets.equal(Matrix3.rotX(angle), Matrix3.makeRot(Vector3.ex)(angle));
        assets.equal(Matrix3.rotY(angle), Matrix3.makeRot(Vector3.ey)(angle));
        assets.equal(Matrix3.rotZ(angle), Matrix3.makeRot(Vector3.ez)(angle));

        assets.equal(Matrix3.rotX(Math.PI / 2).map(Vector3.ey), Vector3.ez);
        assets.equal(Matrix3.rotY(Math.PI / 2).map(Vector3.ez), Vector3.ex);
        assets.equal(Matrix3.rotZ(Math.PI / 2).map(Vector3.ex), Vector3.ey);
    });

    it("Elliptic rotation", function () {
        setUp();
        const angle = Math.PI / 2;
        const a = 2, b = 1;
        const cos = (theta: number) => Math.cos(theta);
        const sin = (theta: number) => b / a * Math.sin(theta);

        assets.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle));
        assets.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle));
        assets.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle));

        assets.equal(Matrix3.rotX(Math.PI / 2, cos, sin).map(Vector3.ey.mul(a)), Vector3.ez);
        assets.equal(Matrix3.rotY(Math.PI / 2, cos, sin).map(Vector3.ez.mul(a)), Vector3.ex);
        assets.equal(Matrix3.rotZ(Math.PI / 2, cos, sin).map(Vector3.ex.mul(a)), Vector3.ey);
    });

    it("Hyperbolic rotation", function () {
        setUp();
        const angle = Math.PI / 2;
        const cos = (theta: number) => Math.cosh(theta);
        const sin = (theta: number) => Math.sinh(theta);

        const resX = Matrix3.rotX(angle, cos, sin).map(Vector3.ey);
        const resY = Matrix3.rotY(angle, cos, sin).map(Vector3.ez);
        const resZ = Matrix3.rotZ(angle, cos, sin).map(Vector3.ex);

        assets.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle));
        assets.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle));
        assets.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle));

        assert.equal(resX.y ** 2 - resX.z ** 2, 1, `\nresX : ${resX}`);
        assert.equal(resY.z ** 2 - resY.x ** 2, 1, `\nresY : ${resY}`);
        assert.equal(resZ.x ** 2 - resZ.y ** 2, 1, `\nresZ : ${resZ}`);
    });

    it("Generators", function () {
        setUp();
        assets.equal(Matrix3.diag(1, 1, 1), a);
        assets.equal(Matrix3.sym(2, 2, 2, -1, -1), c);
    });

    it("Serialize", function () {
        setUp();
        let a2D = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        let a1D = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        assets.arrayEqual(a.to1D(), a1D);
        assets.arrayEqual2D(a.to2D(), a2D);

        assets.equal(Matrix3.from1D(a1D), a);
        assets.equal(Matrix3.from2D(a2D), a);

        assert.equal(a.toString(), "(1.00e+0 0.00e+0 0.00e+0)\n(0.00e+0 1.00e+0 0.00e+0)\n(0.00e+0 0.00e+0 1.00e+0)");
    });
});
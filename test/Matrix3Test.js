const assert = require("./common.js");

describe("Matrix3 Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");

    let a, b, c, cInv;

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
        assert.meca3.equal(b.transc(), new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        ));
    });

    it("Matrix Product", function () {
        setUp();
        assert.meca3.equal(a.prodc(a), a, `\n${a}\n*\n${a}\n=\n${a.prodc(a)}`);
        assert.meca3.equal(b.prodc(a.mulc(2)), b.mulc(2), `\n${b}\n*\n${a.mulc(2)}\n=\n${b.prodc(a.mulc(2))}`);
    });

    it("Linear mapping", function () {
        setUp();
        let u = Vector3.ones;
        assert.meca3.equal(a.map(u), u, `\n${a}\n*\n${u}\n=\n${a.mapc(u)}`);
        assert.meca3.equal(b.mapc(u), new Vector3(6, 6, 6), `\n${b}\n*\n${u}\n=\n${b.mapc(u)}`);
    });

    it("Determinant", function () {
        setUp();
        assert.approximately(a.det, 1, Number.EPSILON);
        assert.approximately(b.det, 0, Number.EPSILON);
        assert.approximately(c.det, 4, Number.EPSILON);
    });

    it("Inverse", function () {
        setUp();
        assert.meca3.equal(a.invc(), a, `\n${a}^-1\n=\n${a.invc()}`);
        assert.meca3.equal(c.invc(), cInv, `\n${c}^-1\n=\n${c.invc()}`);
        assert.meca3.equal(c.prod(c.invc()), a);
    });

    it("Exponentiation", function () {
        setUp();
        assert.meca3.equal(a.powc(2), a, `\n${a}^2\n=\n${a.powc(2)}`);
        assert.meca3.equal(b.powc(0), a, `\n${b}^0\n=\n${b.powc(0)}`);
        assert.meca3.equal(c.powc(1), c, `\n${c}^1\n=\n${c.powc(1)}`);
        assert.meca3.equal(a.mulc(2).pow(4), Matrix3.eye.mul(16), `\n(2 * ${a})^4\n=\n${a.mulc(2).pow(4)}`);
        assert.meca3.equal(c.powc(-1), cInv, `\n${c}^-1\n=\n${c.powc(-1)}`);
        assert.meca3.equal(Matrix3.ones.powc(3), Matrix3.ones.mul(9));
    });

    it("Get elements", function () {
        setUp();
        let assertRow = new Vector3(1, 2, 3);
        assert.meca3.equal(b.row(0), assertRow);
        assert.meca3.equal(b.row(2), assertRow);

        assert.meca3.equal(a.col(0), Vector3.ex);
        assert.meca3.equal(a.col(2), Vector3.ez);
    });

    it("Rotation", function () {
        setUp();
        const angle = Math.PI / 2;

        assert.meca3.equal(Matrix3.rotX(angle), Matrix3.makeRot(Vector3.ex)(angle));
        assert.meca3.equal(Matrix3.rotY(angle), Matrix3.makeRot(Vector3.ey)(angle));
        assert.meca3.equal(Matrix3.rotZ(angle), Matrix3.makeRot(Vector3.ez)(angle));

        assert.meca3.equal(Matrix3.rotX(Math.PI / 2).map(Vector3.ey), Vector3.ez);
        assert.meca3.equal(Matrix3.rotY(Math.PI / 2).map(Vector3.ez), Vector3.ex);
        assert.meca3.equal(Matrix3.rotZ(Math.PI / 2).map(Vector3.ex), Vector3.ey);
    });

    it("Elliptic rotation", function () {
        setUp();
        const angle = Math.PI / 2;
        const a = 2, b = 1;
        const cos = (theta) => Math.cos(theta);
        const sin = (theta) => b / a * Math.sin(theta);

        assert.meca3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle));
        assert.meca3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle));
        assert.meca3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle));

        assert.meca3.equal(Matrix3.rotX(Math.PI / 2, cos, sin).map(Vector3.ey.mul(a)), Vector3.ez);
        assert.meca3.equal(Matrix3.rotY(Math.PI / 2, cos, sin).map(Vector3.ez.mul(a)), Vector3.ex);
        assert.meca3.equal(Matrix3.rotZ(Math.PI / 2, cos, sin).map(Vector3.ex.mul(a)), Vector3.ey);
    });

    it("Hyperbolic rotation", function () {
        setUp();
        const angle = Math.PI / 2;
        const cos = (theta) => Math.cosh(theta);
        const sin = (theta) => Math.sinh(theta);

        const resX = Matrix3.rotX(angle, cos, sin).map(Vector3.ey);
        const resY = Matrix3.rotY(angle, cos, sin).map(Vector3.ez);
        const resZ = Matrix3.rotZ(angle, cos, sin).map(Vector3.ex);

        assert.meca3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle));
        assert.meca3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle));
        assert.meca3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle));

        assert.equal(resX.y ** 2 - resX.z ** 2, 1, `\nresX : ${resX}`);
        assert.equal(resY.z ** 2 - resY.x ** 2, 1, `\nresY : ${resY}`);
        assert.equal(resZ.x ** 2 - resZ.y ** 2, 1, `\nresZ : ${resZ}`);
    });

    it("Generators", function () {
        setUp();
        assert.meca3.equal(Matrix3.diag(1, 1, 1), a);
        assert.meca3.equal(Matrix3.sym(2, 2, 2, -1, -1), c);
    });

    it("Serialize", function () {
        setUp();
        let a2D = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        let a1D = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        assert.meca3.arrayEqual(a.to1D(), a1D);
        assert.meca3.arrayEqual2D(a.to2D(), a2D);

        assert.meca3.equal(Matrix3.from1D(a1D), a);
        assert.meca3.equal(Matrix3.from2D(a2D), a);

        assert.equal(a.toString(), "(1.00e+0 0.00e+0 0.00e+0)\n(0.00e+0 1.00e+0 0.00e+0)\n(0.00e+0 0.00e+0 1.00e+0)");
    });
});
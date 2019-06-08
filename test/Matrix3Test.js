const assert = require("chai").assert;

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
        assert(b.transc().isEqual(new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        )));
    });

    it("Matrix Product", function () {
        setUp();
        assert(a.prod(a).isEqual(a));
        assert(b.prodc(a.mulc(2)).isEqual(b.mul(2)));
    });

    it("Linear mapping", function () {
        setUp();
        let u = Vector3.ones;
        assert(a.map(u).isEqual(u));
        assert(b.mapc(u).isEqual(new Vector3(6, 6, 6)));
    });

    it("Determinant", function () {
        setUp();
        assert(Math.abs(a.det - 1) < Number.EPSILON);
        assert(Math.abs(b.det) < Number.EPSILON);
        assert(Math.abs(c.det - 4) < Number.EPSILON);
    });

    it("Inverse", function () {
        setUp();
        assert(a.inv().isEqual(a));
        assert(c.inv().isEqual(cInv));
        assert(c.prod(c.invc()).isEqual(a));
    });

    it("Exponentiation", function () {
        setUp();
        assert(a.pow(2).isEqual(a));
        assert(b.pow(0).isEqual(a));
        assert(c.pow(1).isEqual(c));
        assert(a.mul(2).pow(4).isEqual(Matrix3.eye.mul(16)));
        assert(c.pow(-1).isEqual(cInv));
        assert(Matrix3.ones.powc(3).isEqual(Matrix3.ones.mul(9)));
    });

    it("Get elements", function () {
        setUp();
        let assertRow = new Vector3(1, 2, 3);
        assert(b.row(0).isEqual(assertRow));
        assert(b.row(2).isEqual(assertRow));

        assert(a.col(0).isEqual(Vector3.ex));
        assert(a.col(2).isEqual(Vector3.ez));
    });

    it("Rotation", function () {
        setUp();
        const angle = Math.PI / 2;

        const rotX = Matrix3.makeRot(Vector3.ex);
        const rotY = Matrix3.makeRot(Vector3.ey);
        const rotZ = Matrix3.makeRot(Vector3.ez);

        const resX = Matrix3.rotX(Math.PI / 2).map(Vector3.ey);
        const resY = Matrix3.rotY(Math.PI / 2).map(Vector3.ez);
        const resZ = Matrix3.rotZ(Math.PI / 2).map(Vector3.ex);

        const expectedX = Matrix3.rotX(angle);
        const expectedY = Matrix3.rotY(angle);
        const expectedZ = Matrix3.rotZ(angle);

        assert(expectedX.isEqual(rotX(angle)), `\n${expectedX}\n!=\n${rotX(angle)}`);
        assert(expectedY.isEqual(rotY(angle)), `\n${expectedY}\n!=\n${rotY(angle)}`);
        assert(expectedZ.isEqual(rotZ(angle)), `\n${expectedZ}\n!=\n${rotZ(angle)}`);

        assert(resX.isEqual(Vector3.ez), `\n${resX}\n!=\n${Vector3.ez}`);
        assert(resY.isEqual(Vector3.ex), `\n${resY}\n!=\n${Vector3.ex}`);
        assert(resZ.isEqual(Vector3.ey), `\n${resZ}\n!=\n${Vector3.ey}`);
    });

    it("Elliptic rotation", function () {
        setUp();
        const angle = Math.PI / 2;
        const a = 2, b = 1;
        const cos = (theta) => Math.cos(theta);
        const sin = (theta) => b / a * Math.sin(theta);

        const rotX = Matrix3.makeRot(Vector3.ex, cos, sin);
        const rotY = Matrix3.makeRot(Vector3.ey, cos, sin);
        const rotZ = Matrix3.makeRot(Vector3.ez, cos, sin);

        const resX = Matrix3.rotX(Math.PI / 2, cos, sin).map(Vector3.ey.mul(a));
        const resY = Matrix3.rotY(Math.PI / 2, cos, sin).map(Vector3.ez.mul(a));
        const resZ = Matrix3.rotZ(Math.PI / 2, cos, sin).map(Vector3.ex.mul(a));

        const expectedX = Matrix3.rotX(angle, cos, sin);
        const expectedY = Matrix3.rotY(angle, cos, sin);
        const expectedZ = Matrix3.rotZ(angle, cos, sin);

        assert(expectedX.isEqual(rotX(angle)), `\n${expectedX}\n!=\n${rotX(angle)}`);
        assert(expectedY.isEqual(rotY(angle)), `\n${expectedY}\n!=\n${rotY(angle)}`);
        assert(expectedZ.isEqual(rotZ(angle)), `\n${expectedZ}\n!=\n${rotZ(angle)}`);

        assert(resX.isEqual(Vector3.ez), `\n${resX}\n!=\n${Vector3.ez.mul(b)}`);
        assert(resY.isEqual(Vector3.ex), `\n${resY}\n!=\n${Vector3.ex.mul(b)}`);
        assert(resZ.isEqual(Vector3.ey), `\n${resZ}\n!=\n${Vector3.ey.mul(b)}`);
    });

    it("Hyperbolic rotation", function () {
        setUp();
        const angle = Math.PI / 2;

        const rotX = Matrix3.makeRot(Vector3.ex, Math.cosh, Math.sinh);
        const rotY = Matrix3.makeRot(Vector3.ey, Math.cosh, Math.sinh);
        const rotZ = Matrix3.makeRot(Vector3.ez, Math.cosh, Math.sinh);

        const resX = Matrix3.rotX(angle, Math.cosh, Math.sinh).map(Vector3.ey);
        const resY = Matrix3.rotY(angle, Math.cosh, Math.sinh).map(Vector3.ez);
        const resZ = Matrix3.rotZ(angle, Math.cosh, Math.sinh).map(Vector3.ex);

        const expectedX = Matrix3.rotX(angle, Math.cosh, Math.sinh);
        const expectedY = Matrix3.rotY(angle, Math.cosh, Math.sinh);
        const expectedZ = Matrix3.rotZ(angle, Math.cosh, Math.sinh);

        assert(expectedX.isEqual(rotX(angle)), `\n${expectedX}\n!=\n${rotX(angle)}`);
        assert(expectedY.isEqual(rotY(angle)), `\n${expectedY}\n!=\n${rotY(angle)}`);
        assert(expectedZ.isEqual(rotZ(angle)), `\n${expectedZ}\n!=\n${rotZ(angle)}`);

        assert.equal(resX.y ** 2 - resX.z ** 2, 1, `\nresX : ${resX}`);
        assert.equal(resY.z ** 2 - resY.x ** 2, 1, `\nresY : ${resY}`);
        assert.equal(resZ.x ** 2 - resZ.y ** 2, 1, `\nresZ : ${resZ}`);
    });

    it("Generators", function () {
        setUp();
        assert(Matrix3.diag(1, 1, 1).isEqual(a));
        assert(Matrix3.sym(2, 2, 2, -1, -1).isEqual(c));
    });

    it("Serialize", function () {
        setUp();
        let aExpected = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];

        a.to1D().forEach((s, i) => {
            assert.equal(s, aExpected[Math.floor(i / 3)][i % 3])
        });
        a.to2D().forEach((row, i) => {
            row.forEach((s, j) => {
                assert.equal(s, aExpected[i][j])
            })
        });

        assert(Matrix3.from1D([1, 0, 0, 0, 1, 0, 0, 0, 1]).isEqual(a));
        assert(Matrix3.from2D(aExpected).isEqual(a));

        assert.equal(a.toString(), "(1.00 0.00 0.00)\n(0.00 1.00 0.00)\n(0.00 0.00 1.00)");
    });
});
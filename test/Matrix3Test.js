const assert = require("chai").assert;

describe("Matrix3 Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");

    let a, b, c;

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
    }

    it("Transpose", function () {
        setUp();
        assert(b.trans().isEqual(new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        )));
    });

    it("Matrix Product", function () {
        setUp();
        assert(a.prod(a).isEqual(a));
        assert(b.prod(a.copy().mul(2)).isEqual(b.copy().mul(2)));
    });

    it("Linear mapping", function () {
        setUp();
        let u = Vector3.ones;
        assert(a.map(u).isEqual(u));
        assert(b.map(u).isEqual(new Vector3(6, 6, 6)));
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
        assert(c.inv().isEqual(new Matrix3(
            0.75, 0.50, 0.25,
            0.50, 1.00, 0.50,
            0.25, 0.50, 0.75
        )));
        assert(c.prod(c.inv()).isEqual(a));
    });

    it("Get elements", function () {
        setUp();
        let assertRow = new Vector3(1, 2, 3);
        assert(b.row(0).isEqual(assertRow));
        assert(b.row(2).isEqual(assertRow));

        assert(a.col(0).isEqual(Vector3.ex));
        assert(a.col(2).isEqual(Vector3.ez));
    });

    it("Rotates", function () {
        setUp();
        const angle = Math.PI / 2;

        const rotX = Matrix3.makeRot(Vector3.ex);
        const rotY = Matrix3.makeRot(Vector3.ey);
        const rotZ = Matrix3.makeRot(Vector3.ez);

        assert(Matrix3.rotX(Math.PI / 2).map(Vector3.ey).isEqual(Vector3.ez));
        assert(Matrix3.rotY(Math.PI / 2).map(Vector3.ez).isEqual(Vector3.ex));
        assert(Matrix3.rotZ(Math.PI / 2).map(Vector3.ex).isEqual(Vector3.ey));

        assert(Matrix3.rotX(angle).isEqual(rotX(angle)));
        assert(Matrix3.rotY(angle).isEqual(rotY(angle)));
        assert(Matrix3.rotZ(angle).isEqual(rotZ(angle)));
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
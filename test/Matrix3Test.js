const assert = require("chai").assert;

describe("Matrix3 Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");

    let a = Matrix3.eye;

    let b = new Matrix3(
        1, 2, 3,
        1, 2, 3,
        1, 2, 3
    );

    let c = new Matrix3(
        2, -1, 0,
        -1, 2, -1,
        0, -1, 2
    );

    it("Transpose", function () {
        assert(b.trans.isEqual(new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        )));
    });

    it("Matrix Product", function () {
        assert(a.prod(a).isEqual(a));
        assert(b.prod(a.copy().mul(2)).isEqual(b.copy().mul(2)));
    });

    it("Linear mapping", function () {
        let u = Vector3.ones;
        assert(a.map(u).isEqual(u));
        assert(b.map(u).isEqual(new Vector3(6, 6, 6)));
    });

    it("Determinant", function () {
        assert(Math.abs(a.det - 1) < Number.EPSILON);
        assert(Math.abs(b.det) < Number.EPSILON);
        assert(Math.abs(c.det - 4) < Number.EPSILON);
    });

    it("Inverse", function() {
        assert(a.inv.isEqual(a));
        assert(c.prod(c.inv).isEqual(a));
        assert(c.inv.isEqual(new Matrix3(
            0.75, 0.50, 0.25,
            0.50, 1.00, 0.50,
            0.25, 0.50, 0.75
        )));
    });

    it("Get elements", function() {
        let assertRow = new Vector3(1, 2, 3);
        assert(b.row(0).isEqual(assertRow));
        assert(b.row(2).isEqual(assertRow));

        assert(a.col(0).isEqual(Vector3.ex));
        assert(a.col(2).isEqual(Vector3.ez));
    });

    it("Rotates", function() {
        const angle = Math.PI / 2;
       assert(Matrix3.rotX(Math.PI / 2).map(Vector3.ey).isEqual(Vector3.ez));
       assert(Matrix3.rotY(Math.PI / 2).map(Vector3.ez).isEqual(Vector3.ex));
       assert(Matrix3.rotZ(Math.PI / 2).map(Vector3.ex).isEqual(Vector3.ey));
       assert(Matrix3.rotX(angle).isEqual(Matrix3.rot(Vector3.ex, angle)));
       assert(Matrix3.rotY(angle).isEqual(Matrix3.rot(Vector3.ey, angle)));
       assert(Matrix3.rotZ(angle).isEqual(Matrix3.rot(Vector3.ez, angle)));
    });
});
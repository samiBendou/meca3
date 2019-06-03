const assert = require("chai").assert;

describe("Vector3 Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");
    const VSpace = require("../VSpace.js");

    let vectors = [Vector3.ex, Vector3.ey, Vector3.ez];
    let matrices = [Matrix3.eye, Matrix3.ones, Matrix3.scal(5)];
    let scalars = [1, 2, 3];

    it("Sum", function () {
        assert(VSpace.sum(vectors).isEqual(new Vector3(1, 1, 1)));
        assert(VSpace.sum(matrices).isEqual(new Matrix3(
            7, 1, 1,
            1, 7, 1,
            1, 1, 7
        )));
    });

    it("Comb", function () {
        assert(VSpace.comb(scalars, vectors).isEqual(new Vector3(1, 2, 3)));
        assert(VSpace.comb(scalars, matrices).isEqual(new Matrix3(
            18, 2, 2,
            2, 18, 2,
            2, 2, 18
        )));
    });
});
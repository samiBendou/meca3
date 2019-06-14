const assert = require("chai").assert;

describe("Vector3 Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");
    const VSpace = require("../VSpace.js");

    let vectors = [Vector3.ex, Vector3.ey, Vector3.ez];
    let matrices = [Matrix3.eye, Matrix3.ones, Matrix3.scal(5)];
    let scalars = [1, 2, 3];

    it("Sum", function () {
        assert.meca3.equal(VSpace.sum(vectors), new Vector3(1, 1, 1));
        assert.meca3.equal(VSpace.sum(matrices), new Matrix3(
            7, 1, 1,
            1, 7, 1,
            1, 1, 7
        ));
        assert.meca3.equal(vectors[0], Vector3.ex);
    });

    it("Comb", function () {
        assert.meca3.equal(VSpace.comb(scalars, vectors), new Vector3(1, 2, 3));
        assert.meca3.equal(VSpace.comb(scalars, matrices), new Matrix3(
            18, 2, 2,
            2, 18, 2,
            2, 2, 18
        ));
        assert.meca3.equal(vectors[0], Vector3.ex);
    });
});
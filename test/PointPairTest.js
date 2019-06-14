const assert = require("./common.js");

describe("PointPair Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");
    const PointPair = require("../PointPair.js");

    let om, op;

    function setUp() {
        om = new PointPair(Vector3.ex, Vector3.ey);
        op = PointPair.vect(Vector3.ex);
    }

    it("Relative", function () {
        setUp();
        assert.meca3.equal(om.relative, new Vector3(-1, 1, 0));

        om.relative = Vector3.ex;
        assert.meca3.equal(om.relative, Vector3.ex);
        assert.meca3.equal(om.vector, Vector3.ex.mul(2));
    });

    it("Length", function () {
        setUp();
        assert.approximately(om.length, Math.SQRT2, Number.EPSILON);

        op.length = 2;
        assert.meca3.equal(op.vector, Vector3.ex.mul(2));
    });

    it("Affine", function () {
        setUp();
        let affOM = om.copy().affine(Matrix3.rotZ(Math.PI / 4), Vector3.ones);
        assert.approximately(affOM.length, om.length, Number.EPSILON);
        assert.approximately(affOM.origin.y, affOM.vector.y, Number.EPSILON);
    });
});
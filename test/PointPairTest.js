const assert = require("chai").assert;

describe("PointPair Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Matrix3 = require("../Matrix3.js");
    const PointPair = require("../PointPair.js");

    let om = new PointPair(Vector3.ex, Vector3.ey);
    let op = PointPair.fromVect(Vector3.ex);

    it("Relative", function(){
       assert(om.relative.isEqual(new Vector3(-1, 1, 0)));

       om.relative = Vector3.ex;
       assert(om.relative.isEqual(Vector3.ex));
       assert(om.vector.isEqual(Vector3.ex.mul(2)));
       om = new PointPair(Vector3.ex, Vector3.ey);
    });

    it("Length", function(){
        assert(Math.abs(om.length - Math.SQRT2) < Number.EPSILON);

        op.length = 2;
        assert(op.vector.isEqual(Vector3.ex.mul(2)));
    });

    it("Affine", function() {
        console.log(om.toString());
        let affOM = om.copy().affine(Matrix3.rotZ(Math.PI / 4), Vector3.ones);
        assert.approximately(affOM.length, om.length, Number.EPSILON);
        assert.approximately(affOM.origin.y, affOM.vector.y, Number.EPSILON);
    });
});
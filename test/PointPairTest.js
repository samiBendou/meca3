const assert = require("chai").assert;

describe("PointPair Tests", function () {
    const Vector3 = require("../Vector3.mjs");
    const PointPair = require("../PointPair.mjs");

    let om = new PointPair(Vector3.ex, Vector3.ey);
    let op = new PointPair(Vector3.zeros, Vector3.ex);

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
});
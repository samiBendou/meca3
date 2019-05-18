const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;

describe("Trajectory Tests", function () {
    const Vector3 = require("../Vector3.mjs");
    const PointPair = require("../PointPair.mjs");
    const Trajectory = require("../Trajectory.mjs");

    // Initialisation of trajectory
    var step = 0.1;
    let steps = [step, step, step];
    let org = Vector3.zeros;
    let om0 = new PointPair(org, Vector3.ex);
    let om1 = new PointPair(org, Vector3.ey);
    let om2 = new PointPair(org, Vector3.ex.opp);
    let om3 = om0.copy().translate(Vector3.ex);
    let om4 = om0.copy().translate(Vector3.ey);

    let gamma0 = new Trajectory([om0, om1, om2], steps);
    let gamma1 = new Trajectory([om0, om3, om4], steps);

    it("Length", function () {
        assert.approximately(gamma0.length, 2 * Math.SQRT2, Number.EPSILON);
        assert.approximately(gamma1.length, 0, Number.EPSILON);
    });

    it("Positions", function () {
        let expectPos0 = Trajectory.fromVect([om0.relative, om1.relative, om2.relative], Vector3.zeros, step);
        let expectPos1 = Trajectory.fromVect([Vector3.ex, Vector3.ex, Vector3.ex], Vector3.zeros, step);

        assert(gamma0.isEqual(expectPos0));
        assert(gamma1.isEqual(expectPos1));
    });

    it("Accelerations", function () {
        assert(gamma0.accels[0].isEqual(new Vector3(0, -2 / step / step, 0)));
        assert(gamma1.accels[0].isEqual(Vector3.zeros));
    });

    it("Add", function () {
        let pp = new PointPair(om1.origin.copy(), om1.vector.copy().opp);

        gamma0.add(pp);
        assert(gamma0.isEqual(Trajectory.cstStep([om0, om1, om2, pp], step)));
    });

    it("Origins", function () {
        var expectedOrg = [om0.origin, om3.origin, om4.origin];
        var originToSet = [Vector3.zeros, Vector3.zeros, Vector3.zeros];

        assert(gamma1.origins.reduce(function (acc, cur, index) {
            return acc && cur.isEqual(expectedOrg[index]);
        }, true));

        gamma1.origins = originToSet;
        assert(gamma1.origins.reduce(function (acc, cur, index) {
            return acc && cur.isEqual(originToSet[index]);
        }, true));
    });

    it("First/Last", function() {
        assert(gamma0.first.isEqual(om0));
        assert(gamma0.last.isEqual(om2));

        gamma0.first = om1;
        gamma0.last = om0;

        assert(gamma0.first.isEqual(om1));
        assert(gamma0.last.isEqual(om0));
    });
});
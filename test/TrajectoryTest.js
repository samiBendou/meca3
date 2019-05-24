const chai = require("chai");
const assert = chai.assert;

describe("Trajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");

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
        let expectPos0 = Trajectory.cstOrigin([om0.relative, om1.relative, om2.relative], Vector3.zeros, step);
        let expectPos1 = Trajectory.cstOrigin([Vector3.ex, Vector3.ex, Vector3.ex], Vector3.zeros, step);

        assert(gamma0.isEqual(expectPos0));
        assert(gamma1.isEqual(expectPos1));
    });

    it("Accelerations", function () {
        assert(gamma0.accels[0].isEqual(new Vector3(0, -2 / step / step, 0)));
        assert(gamma1.accels[0].isEqual(Vector3.zeros));
    });

    it("Add", function () {
        let pp = new PointPair(om1.origin.copy(), om1.vector.copy().opp);
        assert(gamma0.add(pp).isEqual(Trajectory.cstStep([om0, om1, om2, pp], step)));

        gamma0 = Trajectory.cstStep([om0, om1, om2], step);
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

        gamma1 = Trajectory.cstStep([om0, om3, om4], step);
    });

    it("First/Last/Nexto", function () {
        assert(gamma0.first.isEqual(om0));
        assert(gamma0.last.isEqual(om2));
        assert(gamma0.nexto.isEqual(om1));

        gamma0.first = om1;
        gamma0.last = om0;
        gamma0.nexto = om4;

        assert(gamma0.first.isEqual(om1));
        assert(gamma0.last.isEqual(om0));
        assert(gamma0.nexto.isEqual(om4));

        gamma0 = Trajectory.cstStep([om0, om1, om2], step);
    });

    it("At/Get", function() {
        assert(gamma0.get(0).isEqual(om0));
        assert(gamma0.at(0).isEqual(om0));
        assert(gamma0.get(1).isEqual(om1));
        assert(gamma0.at(0.5).vector.isEqual(Vector3.ex.add(Vector3.ey).mul(0.5)));
    });

    it("Time", function(){
        assert.equal(gamma0.t(0), 0);
        assert.equal(gamma0.t(0.5), 0.05);
        assert.equal(gamma0.t(1), 0.1);
        assert.equal(gamma0.t(2.5), 0.25);
        assert.approximately(gamma0.t(3), 0.3, Number.EPSILON);
    });
});
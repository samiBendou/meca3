const chai = require("chai");
const assert = chai.assert;

describe("Trajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");

    // Initialisation of trajectory
    let step = 0.1;
    let om0 = PointPair.vect(Vector3.ex);
    let om1 = PointPair.vect(Vector3.ey);
    let om2 = PointPair.vect(Vector3.ex.opp);
    let om3 = om0.copy().translate(Vector3.ex);
    let om4 = om0.copy().translate(Vector3.ey);

    let gamma0 = new Trajectory([om0, om1, om2], step);
    let gamma1 = new Trajectory([om0, om3, om4], step);

    it("Length", function () {
        assert.approximately(gamma0.length, 2 * Math.SQRT2, Number.EPSILON);
        assert.approximately(gamma1.length, 0, Number.EPSILON);
    });

    it("Positions", function () {
        let expectPos0 = Trajectory.fromVect([om0.relative, om1.relative, om2.relative], step);
        let expectPos1 = Trajectory.fromVect([Vector3.ex, Vector3.ex, Vector3.ex], step);

        assert(gamma0.isEqual(expectPos0));
        assert(gamma1.isEqual(expectPos1));
    });

    it("Add", function () {
        let pp = new PointPair(om1.origin.copy(), om1.vector.copy().opp);
        assert(gamma0.add(pp).isEqual(new Trajectory([om0, om1, om2, pp], step)));

        gamma0 = new Trajectory([om0, om1, om2], step);
    });

    it("Origins", function () {
        let expectedOrg = [om0.origin, om3.origin, om4.origin];
        let originToSet = [Vector3.zeros, Vector3.zeros, Vector3.zeros];

        assert(gamma1.origins.reduce(function (acc, cur, index) {
            return acc && cur.isEqual(expectedOrg[index]);
        }, true));

        gamma1.origins = originToSet;
        assert(gamma1.origins.reduce(function (acc, cur, index) {
            return acc && cur.isEqual(originToSet[index]);
        }, true));

        gamma1 = new Trajectory([om0, om3, om4], step);
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

        gamma0 = new Trajectory([om0, om1, om2], step);
    });

    it("At/Get", function () {
        assert(gamma0.get(0).isEqual(om0));
        assert(gamma0.at(0).isEqual(om0));
        assert(gamma0.get(1).isEqual(om1));
        assert(gamma0.at(0.5).vector.isEqual(Vector3.ex.add(Vector3.ey).mul(0.5)));
    });

    it("Time", function () {
        assert.equal(gamma0.t(0), 0);
        assert.equal(gamma0.t(0.5), 0.05);
        assert.equal(gamma0.t(1), 0.1);
        assert.equal(gamma0.t(2.5), 0.25);
        assert.approximately(gamma0.t(3), 0.3, Number.EPSILON);
    });

    it("Origin", function () {
        assert(
            gamma0.isEqual(
                Trajectory.fromVect([om0.vector, om1.vector, om2.vector], 0.1, Vector3.zeros)));
    })
});
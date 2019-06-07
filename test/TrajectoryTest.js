const chai = require("chai");
const assert = chai.assert;

describe("Trajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");


    let dt;
    let om0, om1, om2, om3, om4;
    let gamma0, gamma1;

    function setUp() {
        dt = 0.1;
        om0 = PointPair.vect(Vector3.ex);
        om1 = PointPair.vect(Vector3.ey);
        om2 = PointPair.vect(Vector3.ex.opp());
        om3 = om0.copy().translate(Vector3.ex);
        om4 = om0.copy().translate(Vector3.ey);

        gamma0 = new Trajectory([om0, om1, om2], dt);
        gamma1 = new Trajectory([om0, om3, om4], dt);
    }

    it("Length", function () {
        setUp();
        assert.approximately(gamma0.length, 2 * Math.SQRT2, Number.EPSILON);
        assert.approximately(gamma1.length, 0, Number.EPSILON);
    });

    it("Positions", function () {
        setUp();
        assert(gamma0.isEqual(Trajectory.discrete([om0.relative, om1.relative, om2.relative], dt)));
        assert(gamma1.isEqual(Trajectory.discrete([Vector3.ex, Vector3.ex, Vector3.ex], dt)));
    });

    it("Add", function () {
        setUp();
        let pp = new PointPair(om1.origin.copy(), om1.vector.copy().opp());
        assert(gamma0.add(pp).isEqual(new Trajectory([om0, om1, om2, pp], dt)));
    });

    it("Origins", function () {
        setUp();
        let expectedOrg = [om0.origin, om3.origin, om4.origin];
        let originToSet = [Vector3.zeros, Vector3.zeros, Vector3.zeros];

        assert(gamma1.origin.reduce((acc, cur, index) => acc && cur.isEqual(expectedOrg[index]), true));

        gamma1.origin = originToSet;
        assert(gamma1.origin.reduce((acc, cur, index) => acc && cur.isEqual(originToSet[index]), true));
    });

    it("First/Last/Nexto", function () {
        setUp();
        assert(gamma0.first.isEqual(om0));
        assert(gamma0.nexto.isEqual(om1));
        assert(gamma0.last.isEqual(om2));

        gamma0.first = om1;
        gamma0.nexto = om4;
        gamma0.last = om0;

        assert(gamma0.first.isEqual(om1));
        assert(gamma0.nexto.isEqual(om4));
        assert(gamma0.last.isEqual(om0));
    });

    it("At/Get", function () {
        setUp();
        assert(gamma0.get(0).isEqual(om0));
        assert(gamma0.at(0).isEqual(om0));
        assert(gamma0.get(1).isEqual(om1));
        assert(gamma0.at(0.5).vector.isEqual(Vector3.ey));
    });

    it("Time", function () {
        setUp();
        assert.equal(gamma0.duration(0), 0);
        assert.equal(gamma0.duration(1), 0.1);

        assert.equal(gamma0.t(0), 0);
        assert.equal(gamma0.t(0.5), 0.1);
        assert.equal(gamma0.t(1), 0.2);
    });

    it("Origin", function () {
        setUp();
        assert(
            gamma0.isEqual(
                Trajectory.discrete([om0.vector, om1.vector, om2.vector], 0.1, Vector3.zeros)));
    });
});
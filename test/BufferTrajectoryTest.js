const assert = require("chai").assert;

describe("BufferTrajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");
    const BufferTrajectory = require("../BufferTrajectory.js");

    let dt = 0.1;
    let org = Vector3.zeros;

    let om0 = new PointPair(org, Vector3.ex);
    let om1 = new PointPair(org, Vector3.ey);
    let om2 = new PointPair(org, Vector3.ex.opp());

    let gamma = new Trajectory([om0, om1, om2], dt);

    let gamma0 = new BufferTrajectory(gamma, 3);
    let gamma1 = new BufferTrajectory(gamma, 2);
    let gamma2 = new BufferTrajectory(gamma, 4);

    it("Bufferize", function () {
        assert(gamma0.isEqual(gamma));
        assert(gamma1.isEqual(new Trajectory([om1, om2], dt)));
        assert(gamma2.isEqual(new Trajectory([om0, om1, om2, PointPair.zeros()], dt)));
    });

    it("At", function () {
        assert(gamma1.at(0).isEqual(om1));
        assert(gamma2.at(0).isEqual(PointPair.zeros()));
    });

    it("Add", function () {
        gamma1.add(om2);
        assert(gamma1.isEqual(new Trajectory([om2, om2], dt)));
        gamma1 = new BufferTrajectory(gamma, 2);

        gamma2.add(om2);
        gamma2.add(om1);
        assert(gamma2.isEqual(new Trajectory([om1, om1, om2, om2], dt)));
        gamma2 = new BufferTrajectory(gamma, 4);
    });

    it("First/Last/Nexto", function () {
        assert(gamma1.first.isEqual(om1));
        assert(gamma1.last.isEqual(om2));

        assert(gamma2.last.isEqual(om2));
        assert(gamma2.nexto.isEqual(om1));

        gamma1.first = om1;
        gamma1.last = om0;
        gamma2.nexto = org;

        assert(gamma1.first.isEqual(om1));
        assert(gamma1.last.isEqual(om0));
        assert(gamma2.nexto.isEqual(org));

        gamma1 = new BufferTrajectory(gamma, 2);
        gamma2 = new BufferTrajectory(gamma, 4);
    });

    it("At/Get", function() {
        assert(gamma1.get(0).isEqual(om1));
        assert(gamma1.at(0).isEqual(om1));
        assert(gamma1.get(1).isEqual(om2));
        assert(gamma1.at(0.5).vector.isEqual(Vector3.ex.opp().add(Vector3.ey).mul(0.5)));

        assert(gamma2.get(0).isEqual(PointPair.zeros()));
        assert(gamma2.at(0).isEqual(PointPair.zeros()));
        assert(gamma2.get(1).isEqual(om0));
        assert(gamma2.at(1.5).vector.isEqual(Vector3.ex.add(Vector3.ey).mul(0.5)));
    });

    it("Time", function(){
        assert.equal(gamma0.t(0), 0);
        assert.equal(gamma0.t(0.5), 0.05);
        assert.equal(gamma0.t(1), 0.1);
        assert.equal(gamma0.t(2.5), 0.25);
        assert.approximately(gamma0.t(3), 0.3, Number.EPSILON);

        assert.equal(gamma2.t(0), 0);
        assert.equal(gamma2.t(0.5), 0);
        assert.equal(gamma2.t(1), 0);
        assert.approximately(gamma2.t(2.5), 0.15, Number.EPSILON);
        assert.approximately(gamma2.t(3), 0.2, Number.EPSILON);
    });

    it("Generators", function () {
        let phi = BufferTrajectory.discrete([Vector3.ex, Vector3.ey, Vector3.ex.opp()], 0.1);
        assert(phi.isEqual(gamma0));
    });
});
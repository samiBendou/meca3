const assert = require("chai").assert;

describe("BufferTrajectory Tests", function () {
    const Vector3 = require("../Vector3.mjs");
    const PointPair = require("../PointPair.mjs");
    const Trajectory = require("../Trajectory.mjs");
    const BufferTrajectory = require("../BufferTrajectory.mjs");

    let step = 0.1;
    let org = Vector3.zeros;

    let om0 = new PointPair(org, Vector3.ex);
    let om1 = new PointPair(org, Vector3.ey);
    let om2 = new PointPair(org, Vector3.ex.opp);

    let gamma = Trajectory.cstStep([om0, om1, om2], step);

    let gamma0 = new BufferTrajectory(3, gamma);
    let gamma1 = new BufferTrajectory(2, gamma);
    let gamma2 = new BufferTrajectory(4, gamma);

    it("Bufferize", function () {
        assert(gamma0.isEqual(gamma));
        assert(gamma1.isEqual(Trajectory.cstStep([om1, om2], step)));
        assert(gamma2.isEqual(Trajectory.cstStep([om0, om1, om2, PointPair.zeros()], step)));
    });

    it("At", function () {
        assert(gamma1.at(0).isEqual(om1));
        assert(gamma2.at(0).isEqual(PointPair.zeros()));
    });

    it("Add", function () {
        gamma1.add(om2);
        assert(gamma1.isEqual(Trajectory.cstStep([om2, om2], step)));

        gamma2.add(om2);
        gamma2.add(om1);
        assert(gamma2.isEqual(Trajectory.cstStep([om1, om1, om2, om2], step)));
    });
});
const assert = require("chai").assert;

describe("BufferTrajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");
    const BufferTrajectory = require("../BufferTrajectory.js");

    let dt;
    let org, om0, om1, om2;
    let gamma, gamma0, gamma1, gamma2;

    function setUp() {
        dt = 0.1;
        org = Vector3.zeros;

        om0 = new PointPair(org, Vector3.ex);
        om1 = new PointPair(org, Vector3.ey);
        om2 = new PointPair(org, Vector3.ex.opp());

        gamma = new Trajectory([om0, om1, om2], dt);

        gamma0 = new BufferTrajectory(gamma, 3);
        gamma1 = new BufferTrajectory(gamma, 2);
        gamma2 = new BufferTrajectory(gamma, 4);
    }

    it("Bufferize", function () {
        setUp();
        assert(gamma0.isEqual(gamma));
        assert(gamma1.isEqual(new Trajectory([om1, om2], dt)));
        assert(gamma2.isEqual(new Trajectory([om0, om1, om2, PointPair.zeros()], dt)));
    });

    it("At", function () {
        setUp();
        assert(gamma1.at(0).isEqual(om1));
        assert(gamma2.at(0).isEqual(PointPair.zeros()));
    });

    it("Add", function () {
        setUp();
        gamma1.add(om2);
        assert(gamma1.isEqual(new Trajectory([om2, om2], dt)));
        gamma1 = new BufferTrajectory(gamma, 2);

        gamma2.add(om2);
        gamma2.add(om1);
        assert(gamma2.isEqual(new Trajectory([om1, om1, om2, om2], dt)));
        gamma2 = new BufferTrajectory(gamma, 4);
    });

    it("First/Last/Nexto", function () {
        setUp();
        assert(gamma1.first.isEqual(om1));
        assert(gamma1.nexto.isEqual(om1));
        assert(gamma1.last.isEqual(om2));

        assert(gamma2.first.isEqual(PointPair.zeros()));
        assert(gamma2.nexto.isEqual(om1));
        assert(gamma2.last.isEqual(om2));

        gamma1.first = om1;
        gamma1.last = om0;
        gamma2.nexto = org;

        assert(gamma1.first.isEqual(om1));
        assert(gamma1.last.isEqual(om0));
        assert(gamma2.nexto.isEqual(org));
    });

    it("At/Get", function() {
        setUp();
        assert(gamma1.get(0).isEqual(om1));
        assert(gamma1.at(0).isEqual(om1));

        assert(gamma1.get(1).isEqual(om2));
        assert(gamma1.at(0.5).vector.isEqual(new Vector3(-0.5, 0.5, 0)));

        assert(gamma2.get(0).isEqual(PointPair.zeros()));
        assert(gamma2.at(0).isEqual(PointPair.zeros()));

        assert(gamma2.get(1).isEqual(om0));
        assert(gamma2.at(0.5).vector.isEqual(new Vector3(0.5, 0.5, 0)));
    });

    it("Time", function(){
        setUp();
        assert.approximately(gamma1.duration(0), 0, Number.EPSILON);
        assert.approximately(gamma1.duration(1), 0.1, Number.EPSILON);

        assert.approximately(gamma0.t(0), 0, Number.EPSILON);
        assert.approximately(gamma0.t(0.25), 0.05, Number.EPSILON);
        assert.approximately(gamma0.t(0.5), 0.1, Number.EPSILON);
        assert.approximately(gamma0.t(0.75), 0.15, Number.EPSILON);
        assert.approximately(gamma0.t(1), 0.2, Number.EPSILON);

        assert.approximately(gamma1.duration(0), 0, Number.EPSILON);
        assert.approximately(gamma1.duration(1), 0.1, Number.EPSILON);

        assert.approximately(gamma1.t(0), 0, Number.EPSILON);
        assert.approximately(gamma1.t(0.5), 0.05, Number.EPSILON);
        assert.approximately(gamma1.t(1), 0.1, Number.EPSILON);

        assert.approximately(gamma2.duration(0), 0, Number.EPSILON);
        assert.approximately(gamma2.duration(1), 0, Number.EPSILON);

        assert.approximately(gamma2.t(0), 0, Number.EPSILON);
        assert.approximately(gamma2.t(0.25), 0.0, Number.EPSILON);
        assert.approximately(gamma2.t(0.5), 0.05, Number.EPSILON);
        assert.approximately(gamma2.t(1), 0.2, Number.EPSILON);
    });

    it("Generators", function () {
        setUp();
        let phi = BufferTrajectory.discrete([Vector3.ex, Vector3.ey, Vector3.ex.opp()], 0.1);
        assert(phi.isEqual(gamma0));
    });
});
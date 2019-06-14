const assert = require("./common.js");

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
        assert.meca3.equal(gamma0, gamma);
        assert.meca3.equal(gamma1, new Trajectory([om1, om2], dt));
        assert.meca3.equal(gamma2, new Trajectory([om0, om1, om2, PointPair.zeros()], dt));

        assert.equal(gamma0.dt.length, 2);
        assert.equal(gamma1.dt.length, 1);
        assert.equal(gamma2.dt.length, 3);
    });

    it("At", function () {
        setUp();
        assert.meca3.equal(gamma1.at(0), om1);
        assert.meca3.equal(gamma2.at(0), PointPair.zeros());
    });

    it("Add", function () {
        setUp();
        gamma1.add(om2);
        assert.meca3.equal(gamma1, new Trajectory([om2, om2], dt));

        gamma2.add(om2);
        gamma2.add(om1);
        assert.meca3.equal(gamma2, new Trajectory([om1, om1, om2, om2], dt));
        gamma2 = new BufferTrajectory(gamma, 4);
    });

    it("Resize", function () {
        setUp();
        gamma1.size++;
        gamma1.add(om0);
        assert.meca3.equal(gamma1, new Trajectory([om1, om2, om0], dt));

        gamma1.add(om0);
        assert.meca3.equal(gamma1, new Trajectory([om0, om2, om0], dt));
    });

    it("Clear", function () {
        setUp();
        gamma0.clear();
        assert.equal(gamma0.addIndex, 0);
    });

    it("First/Last/Nexto", function () {
        setUp();
        assert.meca3.equal(gamma1.first, om1);
        assert.meca3.equal(gamma1.nexto, om1);
        assert.meca3.equal(gamma1.last, om2);

        assert.meca3.equal(gamma2.first, PointPair.zeros());
        assert.meca3.equal(gamma2.nexto, om1);
        assert.meca3.equal(gamma2.last, om2);

        gamma1.first = om1;
        gamma1.last = om0;
        gamma2.nexto = org;

        assert.meca3.equal(gamma1.first, om1);
        assert.meca3.equal(gamma1.last, om0);
        assert.meca3.equal(gamma2.nexto, org);
    });

    it("At/Get", function() {
        setUp();
        assert.meca3.equal(gamma1.get(0), om1);
        assert.meca3.equal(gamma1.at(0), om1);

        assert.meca3.equal(gamma1.get(1), om2);
        assert.meca3.equal(gamma1.at(0.5).vector, new Vector3(-0.5, 0.5, 0));

        assert.meca3.equal(gamma2.get(0), PointPair.zeros());
        assert.meca3.equal(gamma2.at(0), PointPair.zeros());

        assert.meca3.equal(gamma2.get(1), om0);
        assert.meca3.equal(gamma2.at(0.5).vector, new Vector3(0.5, 0.5, 0));
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
        assert.meca3.equal(phi, gamma0);
    });
});
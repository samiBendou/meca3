import {assert} from "chai";
import {check} from "./common";
import {Vector3} from "../src/Vector3";
import {Pair3} from "../src/Pair3";
import {Trajectory} from "../src/Trajectory";
import {BufferTrajectory} from "../src/BufferTrajectory";

describe("BufferTrajectory Tests", function () {
    let dt: number;
    let org: Vector3, om0: Pair3, om1: Pair3, om2: Pair3;
    let gamma: Trajectory, gamma0: BufferTrajectory, gamma1: BufferTrajectory, gamma2: BufferTrajectory;

    function setUp() {
        dt = 0.1;
        org = Vector3.zeros;

        om0 = new Pair3(org, Vector3.ex);
        om1 = new Pair3(org, Vector3.ey);
        om2 = new Pair3(org, Vector3.ex.opp());

        gamma = new Trajectory([om0, om1, om2], dt);

        gamma0 = new BufferTrajectory(gamma, 3);
        gamma1 = new BufferTrajectory(gamma, 2);
        gamma2 = new BufferTrajectory(gamma, 4);
    }

    it("Bufferize", function () {
        setUp();
        check.equal(gamma0, gamma);
        check.equal(gamma1, new Trajectory([om1, om2], dt));
        check.equal(gamma2, new Trajectory([om0, om1, om2, Pair3.zeros()], dt));

        assert.equal(gamma0.dt.length, 2);
        assert.equal(gamma1.dt.length, 1);
        assert.equal(gamma2.dt.length, 3);
    });

    it("At", function () {
        setUp();
        check.equal(gamma1.at(0), om1);
        check.equal(gamma2.at(0), Pair3.zeros());
    });

    it("Add", function () {
        setUp();
        gamma1.add(om2);
        check.equal(gamma1, new Trajectory([om2, om2], dt));

        gamma2.add(om2);
        gamma2.add(om1);
        check.equal(gamma2, new Trajectory([om1, om1, om2, om2], dt));
        gamma2 = new BufferTrajectory(gamma, 4);
    });

    it("Resize", function () {
        setUp();
        gamma1.size++;
        gamma1.add(om0);
        check.equal(gamma1, new Trajectory([om1, om2, om0], dt));

        gamma1.add(om0);
        check.equal(gamma1, new Trajectory([om0, om2, om0], dt));
    });

    it("Clear", function () {
        setUp();
        gamma0.clear();
        assert.equal(gamma0.addIndex, 0);
    });

    it("First/Last/Nexto", function () {
        setUp();
        check.equal(gamma1.first, om1);
        check.equal(gamma1.nexto, om1);
        check.equal(gamma1.last, om2);

        check.equal(gamma2.first, Pair3.zeros());
        check.equal(gamma2.nexto, om1);
        check.equal(gamma2.last, om2);

        gamma1.first = om1;
        gamma1.last = om0;
        gamma2.nexto = Pair3.zeros(org);

        check.equal(gamma1.first, om1);
        check.equal(gamma1.last, om0);
        check.equal(gamma2.nexto, Pair3.zeros(org));
    });

    it("At/Get", function() {
        setUp();
        check.equal(gamma1.get(0), om1);
        check.equal(gamma1.at(0), om1);

        check.equal(gamma1.get(1), om2);
        check.equal(gamma1.at(0.5).position, new Vector3(-0.5, 0.5, 0));

        check.equal(gamma2.get(0), Pair3.zeros());
        check.equal(gamma2.at(0), Pair3.zeros());

        check.equal(gamma2.get(1), om0);
        check.equal(gamma2.at(0.5).position, new Vector3(0.5, 0.5, 0));
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
        check.equal(phi, gamma0);
    });
});
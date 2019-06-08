const chai = require("chai");
const assert = chai.assert;

describe("Trajectory Tests", function () {
    const Vector3 = require("../Vector3.js");
    const PointPair = require("../PointPair.js");
    const Trajectory = require("../Trajectory.js");


    let dt;
    let om0, om1, om2, om3, om4;
    let gamma0, gamma1, gamma2;

    function setUp() {
        dt = 0.1;
        om0 = PointPair.vect(Vector3.ex);
        om1 = PointPair.vect(Vector3.ey);
        om2 = PointPair.vect(Vector3.ex.opp());
        om3 = om0.copy().translate(Vector3.ex);
        om4 = om0.copy().translate(Vector3.ey);

        gamma0 = new Trajectory([om0, om1, om2], dt);
        gamma1 = new Trajectory([om0, om3, om4], dt);
        gamma2 = new Trajectory([om0]);
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
        let pp = new PointPair(om1.origin.copy(), om1.vector.oppc());
        assert(gamma0.add(pp).isEqual(new Trajectory([om0, om1, om2, pp], dt)));
        assert(gamma2.add(om1).isEqual(new Trajectory([om0, om1], 1)));
    });

    it("Clear", function () {
        setUp();
        gamma0.clear();
        assert.equal(gamma0.pairs.length, 0);
        assert.equal(gamma0.dt.length, 0);
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

    it("Generate linear", function () {
        let gamma2 = Trajectory.linear(3);
        let expect2 = Trajectory.discrete([Vector3.zeros, Vector3.ex, Vector3.ex.mul(2)]);
        assert(gamma2.isEqual(expect2), `\n${gamma2}!=\n${expect2}`);
    });

    it("Generate circle", function () {
        let gamma2 = Trajectory.circular(0.25);
        let expect2 = Trajectory.discrete([Vector3.ex, Vector3.ey, Vector3.ex.opp(), Vector3.ey.opp()]);
        assert(gamma2.isEqual(expect2), `\n${gamma2}!=\n${expect2}`);

        let gamma3 = Trajectory.circular(0.25, 1, Vector3.ex);
        let expect3 = Trajectory.discrete([Vector3.ey, Vector3.ez, Vector3.ey.opp(), Vector3.ez.opp()]);
        assert(gamma3.isEqual(expect3), `\n${gamma3}!=\n${expect3}`);

        let gamma4 = Trajectory.circular(0.25, 1, Vector3.ey);
        let expect4 = Trajectory.discrete([Vector3.ex.opp(), Vector3.ez, Vector3.ex, Vector3.ez.opp()]);
        assert(gamma4.isEqual(expect4), `\n${gamma4}!=\n${expect4}`);
    });

    it("Generate ellipse", function () {
        let tol = 1.3 * Number.EPSILON;
        let gamma2 = Trajectory.elliptic(0.25, 1.5);
        let expect2 = [Vector3.ex.mul(1.5), Vector3.ey, Vector3.ex.mul(-1.5), Vector3.ey.opp()];
        gamma2.relative.forEach((u, index) => {
            assert.approximately(u.dist(expect2[index]), 0, tol, `\n${gamma2}!=\n${expect2}\n index=${index}`);
        })
    });

    it("Generate hyperbola", function () {
        let tol = 1e-10;
        let gamma2 = Trajectory.hyperbolic(0.25);
        gamma2.relative.forEach((u, index) => {
            assert.approximately(u.x ** 2 - u.y ** 2, 1, tol, `\n${u}\n index=${index}`);
        });
    });
});
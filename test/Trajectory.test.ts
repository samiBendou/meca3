import {assert} from "chai";
import {assets} from "./common";
import Vector3 from "../src/Vector3";
import Pair3 from "../src/Pair3";
import Trajectory from "../src/Trajectory";


describe("Trajectory Tests", function () {

    let dt: number;
    let om0: Pair3, om1: Pair3, om2: Pair3, om3: Pair3, om4: Pair3;
    let gamma0: Trajectory, gamma1: Trajectory, gamma2: Trajectory;

    function setUp() {
        dt = 0.1;
        om0 = Pair3.vect(Vector3.ex);
        om1 = Pair3.vect(Vector3.ey);
        om2 = Pair3.vect(Vector3.ex.opp());
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
        assets.equal(gamma0, Trajectory.discrete([om0.relative, om1.relative, om2.relative], dt));
        assets.equal(gamma1, Trajectory.discrete([Vector3.ex, Vector3.ex, Vector3.ex], dt));
    });

    it("Add", function () {
        setUp();
        let pp = new Pair3(om1.origin.copy(), om1.position.oppc());
        assets.equal(gamma0.add(pp), new Trajectory([om0, om1, om2, pp], dt));
        assets.equal(gamma2.add(om1), new Trajectory([om0, om1], 1));
    });

    it("Clear", function () {
        setUp();
        gamma0.clear();
        assert.equal(gamma0.pairs.length, 0);
        assert.equal(gamma0.dt.length, 0);
    });

    it("Origins", function () {
        setUp();
        let originToSet = [Vector3.zeros, Vector3.zeros, Vector3.zeros];
        assets.arrayEqual(gamma1.origin, [om0.origin, om3.origin, om4.origin]);

        gamma1.origin = originToSet;
        assets.arrayEqual(gamma1.origin, originToSet);
    });

    it("First/Last/Nexto", function () {
        setUp();
        assets.equal(gamma0.first, om0);
        assets.equal(gamma0.nexto, om1);
        assets.equal(gamma0.last, om2);

        gamma0.first = om1;
        gamma0.nexto = om4;
        gamma0.last = om0;

        assets.equal(gamma0.first, om1);
        assets.equal(gamma0.nexto, om4);
        assets.equal(gamma0.last, om0);
    });

    it("At/Get", function () {
        setUp();
        assets.equal(gamma0.get(0), om0);
        assets.equal(gamma0.at(0), om0);
        assets.equal(gamma0.get(1), om1);
        assets.equal(gamma0.at(0.5).position, Vector3.ey);
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
        assets.equal(
            gamma0,
            Trajectory.discrete([om0.position, om1.position, om2.position], 0.1, Vector3.zeros));
    });

    it("Generate linear", function () {
        let gamma2 = Trajectory.linear(3);
        let expect2 = Trajectory.discrete([Vector3.zeros, Vector3.ex, Vector3.ex.mul(2)]);
        assets.equal(gamma2, expect2);
    });

    it("Generate circle", function () {
        let gamma2 = Trajectory.circular(1, Vector3.ez, Vector3.zeros, 0.25);
        let expect2 = Trajectory.discrete([Vector3.ex, Vector3.ey, Vector3.ex.opp(), Vector3.ey.opp()]);
        assets.equal(gamma2, expect2);

        let gamma3 = Trajectory.circular(1, Vector3.ex, Vector3.zeros, 0.25);
        let expect3 = Trajectory.discrete([Vector3.ey, Vector3.ez, Vector3.ey.opp(), Vector3.ez.opp()]);
        assets.equal(gamma3, expect3);

        let gamma4 = Trajectory.circular(1, Vector3.ey, Vector3.zeros, 0.25);
        let expect4 = Trajectory.discrete([Vector3.ex.opp(), Vector3.ez, Vector3.ex, Vector3.ez.opp()]);
        assets.equal(gamma4, expect4);
    });

    it("Generate ellipse", function () {
        let tol = 1.3 * Number.EPSILON;
        let gamma2 = Trajectory.elliptic(1.5, 1, Vector3.ez, Vector3.zeros, 0.25);
        let expect2 = [Vector3.ex.mul(1.5), Vector3.ey, Vector3.ex.mul(-1.5), Vector3.ey.opp()];
        assets.arrayEqual(gamma2.relative, expect2, tol);
    });

    it("Generate hyperbola", function () {
        let tol = 1e-10;
        let gamma2 = Trajectory.hyperbolic(1, 1, Vector3.ez, Vector3.zeros, 0.25);
        gamma2.relative.forEach((u, index) => {
            assert.approximately(u.x ** 2 - u.y ** 2, 1, tol, `\n${u}\n index=${index}`);
        });
    });
});
import {assert} from "chai";
import {check} from "./common";
import Vector3 from "../src/Vector3";
import Point from "../src/Point";
import Pair3 from "../src/Pair3";

describe("Point Tests", function () {

    let p: Point, q: Point;

    function setUp() {
        p = Point.zeros(10, Vector3.zeros, 0);
        q = Point.zeros(2, Vector3.zeros, 0);
        p.trajectory.add(Pair3.vect(new Vector3(1, 0, 1)));
        q.trajectory.add(Pair3.zeros(Vector3.ones));
    }

    it("Get position", function () {
        setUp();

        assert.equal(p.x, 1);
        assert.equal(p.y, 0);
        assert.equal(p.z, 1);

        assert.equal(q.x, 0);
        assert.equal(q.y, 0);
        assert.equal(q.z, 0);

        assert.equal(p.r, Math.sqrt(2));
        assert.equal(p.theta, 0);
        assert.equal(p.phi, Math.PI / 4);

        assert.equal(q.r, 0);
        assert.equal(q.theta, 0);
        assert.equal(q.phi, 0);
        assert.equal(q.lat, Math.PI / 2);
        assert.equal(q.lon, 0);

        check.equal(p.position, Vector3.ex.add(Vector3.ez));
    });

    it("Get speed", function () {
        setUp();
        p.trajectory.add(Pair3.vect(Vector3.ex));
        q.trajectory.add(Pair3.zeros(Vector3.ex));

        assert.equal(p.vx, 0);
        assert.equal(p.vz, -1);
        assert.equal(p.vr, 1 - Math.sqrt(2));
        assert.equal(p.vtheta, 0);
        assert.equal(p.vphi, Math.PI / 4);

        assert.equal(q.vx, 0);
        assert.equal(q.vz, 0);
        assert.equal(q.vr, 0);
        assert.equal(q.vtheta, 0);
        assert.equal(q.vphi, 0);

        check.equal(p.speed, new Vector3(0, 0, -1));
    });

    it("Set position", function () {
        setUp();

        p.x = 2;
        assert.equal(p.x, 2);

        p.r = 2;
        assert.equal(p.r, 2);

        p.theta = Math.PI / 2;
        assert.equal(p.theta, Math.PI / 2);

        p.phi = Math.PI / 2;
        assert.equal(p.theta, Math.PI / 2);

        p.position = Vector3.ey;
        check.equal(p.position, Vector3.ey);
    });

    it("Initialization", function () {
        setUp();
        p.init(Vector3.ones);
        check.equal(p.trajectory.nexto.relative, Vector3.ones);
        p.update();
        check.equal(p.position, Vector3.ones);
        check.equal(p.trajectory.nexto.relative, Vector3.ones);
    });

    it("Rebase", function () {
        setUp();
        p.trajectory.add(Pair3.vect(Vector3.ex));
        q.trajectory.add(Pair3.zeros(Vector3.ex));
        p.reframe(q);

        check.arrayEqual([Vector3.ones, Vector3.ex], p.trajectory.origin);

    });

    it("Update", function () {
        setUp();
        p.update();
        check.equal(p.position, new Vector3(2, 0, 2));
    });
});
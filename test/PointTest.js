const assert = require("chai").assert;

describe("Point Tests", function () {
    const Vector3 = require("../Vector3.js");
    const BufferTrajectory = require("../BufferTrajectory.js");
    const Point = require("../Point.js");

    let p, q;

    function setUp() {
        p = Point.zeros(0, Vector3.zeros, 10);
        q = Point.zeros(0, Vector3.zeros, 2);
        p.trajectory.add(PointPair.vect(new Vector3(1, 0, 1)));
        q.trajectory.add(PointPair.zeros(Vector3.ones));
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

        assert(p.position.isEqual(Vector3.ex.add(Vector3.ez)));
    });

    it("Get speed", function () {
        setUp();
        p.trajectory.add(PointPair.vect(Vector3.ex));
        q.trajectory.add(PointPair.zeros(Vector3.ex));

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

        assert(p.speed.isEqual(new Vector3(0, 0, -1)));
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
        assert(p.position.isEqual(Vector3.ey));
    });

    it("Rebase", function () {
        setUp();
        p.trajectory.add(PointPair.vect(Vector3.ex));
        q.trajectory.add(PointPair.zeros(Vector3.ex));
        p.reframe(q);

        let expected = [Vector3.ones, Vector3.ex];
        let result = p.trajectory.origin;

        expected.forEach(function (u, index) {
            assert(u.isEqual(result[index]));
        });
    });
});
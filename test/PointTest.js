const assert = require("chai").assert;

describe("Point Tests", function () {
    const BufferTrajectory = require("../BufferTrajectory.js");
    const Point = require("../Point.js");

    let p = new Point(0, new BufferTrajectory(10));
    let q = new Point(0, new BufferTrajectory(10));
    p.trajectory.add(PointPair.vect(Vector3.ex.add(Vector3.ez)));
    q.trajectory.add(PointPair.zeros(Vector3.ones));

    it("Get position", function () {
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
    });
    it("Set position", function () {
        p.x = 2;
        assert.equal(p.x, 2);

        p.r = 2;
        assert.equal(p.r, 2);

        p.theta = Math.PI / 2;
        assert.equal(p.theta, Math.PI / 2);

        p.phi = Math.PI / 2;
        assert.equal(p.theta, Math.PI / 2);

        p = new Point(0, new BufferTrajectory(10));
    });
});
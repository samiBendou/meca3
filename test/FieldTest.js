const assert = require("./common.js");

describe("Point Tests", function () {
    const Point = require("../Point.js");
    const Field = require("../Field.js");

    let points, opoints;
    let field, ofield;

    function setUp() {
        points = [Point.zeros(10), Point.zeros(20), Point.zeros(30)];
        opoints = [Point.zeros(10), Point.zeros(20), Point.zeros(30)];
        let makeField = function (points) {
            return function (u) {
                return points.reduce(function (acc, point) {
                    return acc.add(point.trajectory.last.vector.subc(u).sub(Vector3.ones).div(points.length));
                }, Vector3.zeros);
            }
        };
        field = new Field(points); // zero field
        ofield = new Field(opoints, new Solver(makeField(opoints))); // dependent harmonic oscillator
    }

    it("Rebase", function () {
        setUp();
        field.reframe(points[1]);
        field.points.forEach((p) => {
            assert.meca3.arrayEqual(points[1].trajectory.origin, p.trajectory.origin);
        });
    });

    it("Update", function () {
        setUp();
        field.update();
        field.points.forEach((point) => {
            assert.meca3.equal(point.position, Vector3.zeros);
        });

        ofield.update();
        ofield.points.forEach((point) => {
            assert.meca3.equal(point.position, Vector3.ones.opp());
        });
    });

    it("Barycenter", function () {
        setUp();
        assert.meca3.equal(field.barycenter, Vector3.zeros);

        ofield.update();
        assert.meca3.equal(ofield.barycenter, Vector3.ones.opp());

        ofield.barycenter = Vector3.zeros;
        assert.meca3.equal(ofield.barycenter, Vector3.zeros);

        ofield.points.forEach((point) => {
            assert.meca3.equal(point.position, Vector3.zeros);
        });
    })
});
const assert = require("chai").assert;

describe("Point Tests", function () {
    const Point = require("../Point.js");
    const Field = require("../Field.js");

    let points;
    let field, ofield, opoints;

    function setUp() {
        points = [Point.zeros(10), Point.zeros(20), Point.zeros(30)];
        opoints = [Point.zeros(10), Point.zeros(20), Point.zeros(30)];
        let makeField = function (points) {
            return function (u) {
                return points.reduce(function (acc, point) {
                    return acc.add(point.trajectory.last.vector.copy().sub(u).sub(Vector3.ones).div(points.length));
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
            let origin = p.trajectory.origin;
            points[1].trajectory.origin.forEach((u, index) => {
                assert(u.isEqual(origin[index]));
            });
            assert(p.trajectory.origin);
        });
    });

    it("Update", function () {
        setUp();
        field.update();
        field.points.forEach((point) => {
            assert(point.position.isZero())
        });

        ofield.update();
        ofield.points.forEach((point) => {
            assert(point.position.isEqual(Vector3.ones.opp()))
        });
    });
});
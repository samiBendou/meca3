const assert = require("chai").assert;

describe("Point Tests", function () {
    const Point = require("../Point.js");
    const Field = require("../Field.js");

    let points;
    let field;

    function setUp() {
        points = [Point.zeros(10), Point.zeros(20), Point.zeros(30)];
        field = new Field(points);
    }

    it("Rebase", function () {
        setUp();
        field.reframe(points[1]);
        field.points.forEach(function (p) {
            let origin = p.trajectory.origin;
            points[1].trajectory.origin.forEach(function (u, index) {
                assert(u.isEqual(origin[index]));
            });
            assert(p.trajectory.origin);
        });
    });
});
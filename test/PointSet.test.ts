import {check} from "./common";
import {Vector3} from "../src/Vector3";
import {Point} from "../src/Point";
import {PointSet} from "../src/PointSet";
import {Solver} from "../src/Solver";

describe("Point Set Tests", function () {

    let points: Point[], opoints: Point[];
    let field: PointSet, ofield: PointSet;

    function setUp() {
        points = [
            Point.origin({mass: 10}),
            Point.origin({mass: 20}),
            Point.origin({mass: 30})
        ];
        opoints = [
            Point.origin(),
            Point.origin(),
            Point.origin()
        ];

        let makeField = (points: Point[]) => {
            return (u: Vector3) => {
                return points.reduce((acc, point) => {
                    return acc.add(point.trajectory.last.position.subc(u));
                }, Vector3.zeros).sub(Vector3.ones);
            }
        };
        field = new PointSet(points); // zero f
        ofield = new PointSet(opoints, new Solver(makeField(opoints))); // dependent harmonic oscillator
    }

    it("Rebase", function () {
        setUp();
        field.reframe(points[1]);
        field.points.forEach((p) => {
            check.arrayEqual(points[1].trajectory.origin, p.trajectory.origin);
        });
    });

    it("Update", function () {
        setUp();
        field.update();
        field.points.forEach((point) => {
            check.equal(point.position, Vector3.zeros);
        });

        ofield.update();
        ofield.points.forEach((point) => {
            check.equal(point.position, Vector3.ones.opp());
        });
    });

    it("Centers", function () {
        setUp();
        check.equal(field.barycenter, Vector3.zeros);

        ofield.update();
        check.equal(ofield.center, Vector3.ones.opp());

        ofield.center = Vector3.zeros;
        check.equal(ofield.center, Vector3.zeros);

        ofield.points.forEach((point) => {
            check.equal(point.position, Vector3.zeros);
        });
    })
});
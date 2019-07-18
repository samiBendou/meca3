import {check} from "./common";
import {Vector3} from "../src/Vector3";
import {Point} from "../src/Point";
import {Field} from "../src/Field";
import {Solver} from "../src/Solver";

describe("Point Tests", function () {

    let points: Point[], opoints: Point[];
    let field: Field, ofield: Field;

    function setUp() {
        points = [
            Point.zeros(2, Vector3.zeros, 10),
            Point.zeros(2, Vector3.zeros, 20),
            Point.zeros(2, Vector3.zeros, 30)
        ];
        opoints = [
            Point.zeros(2, Vector3.zeros, 10),
            Point.zeros(2, Vector3.zeros, 20),
            Point.zeros(2, Vector3.zeros, 30)
        ];

        let makeField = function (points: Point[]) {
            return function (u: Vector3) {
                return points.reduce(function (acc, point) {
                    return acc.add(point.trajectory.last.position.subc(u).sub(Vector3.ones).div(points.length));
                }, Vector3.zeros);
            }
        };
        field = new Field(points); // zero f
        ofield = new Field(opoints, new Solver(makeField(opoints))); // dependent harmonic oscillator
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

    it("Barycenter", function () {
        setUp();
        check.equal(field.barycenter, Vector3.zeros);

        ofield.update();
        check.equal(ofield.barycenter, Vector3.ones.opp());

        ofield.barycenter = Vector3.zeros;
        check.equal(ofield.barycenter, Vector3.zeros);

        ofield.points.forEach((point) => {
            check.equal(point.position, Vector3.zeros);
        });
    })
});
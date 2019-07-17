import {assert} from "chai";
import {assets} from "./common";
import {epsilon} from "../src/Algebra";
import Vector3 from "../src/Vector3";
import Matrix3 from "../src/Matrix3";
import Pair3 from "../src/Pair3";

describe("Pair3 Tests", function () {

    let om: Pair3, op: Pair3;

    function setUp() {
        om = new Pair3(Vector3.ex, Vector3.ey);
        op = Pair3.vect(Vector3.ex);
    }

    it("Relative", function () {
        setUp();
        assets.equal(om.relative, new Vector3(-1, 1, 0));

        om.relative = Vector3.ex;
        assets.equal(om.relative, Vector3.ex);
        assets.equal(om.position, Vector3.ex.mul(2));
    });

    it("Length", function () {
        setUp();
        assert.approximately(om.length, Math.SQRT2, epsilon);

        op.length = 2;
        assets.equal(op.position, Vector3.ex.mul(2));
    });

    it("Affine", function () {
        setUp();
        let affOM = om.copy().affine(Matrix3.rotZ(Math.PI / 4), Vector3.ones);
        assert.approximately(affOM.length, om.length, epsilon);
        assert.approximately(affOM.origin.y, affOM.position.y, epsilon);
    });
});
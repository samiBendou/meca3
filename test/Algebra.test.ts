import {check} from "./common";
import * as Algebra from "../src/Algebra";
import Vector3 from "../src/Vector3";
import Matrix3 from "../src/Matrix3";

describe("Algebra Tests", function () {

    let vectors = [Vector3.ex, Vector3.ey, Vector3.ez];
    let matrices = [Matrix3.eye, Matrix3.ones, Matrix3.scal(5)];
    let scalars = [1, 2, 3];

    it("Sum", function () {
        check.equal(Algebra.sum(vectors), new Vector3(1, 1, 1));
        check.equal(Algebra.sum(matrices), new Matrix3(
            7, 1, 1,
            1, 7, 1,
            1, 1, 7
        ));
        check.equal(vectors[0], Vector3.ex);
    });

    it("Comb", function () {
        check.equal(Algebra.comb(scalars, vectors), new Vector3(1, 2, 3));
        check.equal(Algebra.comb(scalars, matrices), new Matrix3(
            18, 2, 2,
            2, 18, 2,
            2, 2, 18
        ));
        check.equal(vectors[0], Vector3.ex);
    });
});
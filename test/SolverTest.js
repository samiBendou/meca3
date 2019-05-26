const assert = require("chai").assert;

describe("Solver Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Solver = require("../Solver.js");

    let oSolver = new Solver(function(u, t) {
        return u.copy().opp;
    });
    let gSolver = new Solver(function (u, t) {
        return Vector3.ez.mul(2);
    });

    it("Solve", function () {
        let count = 20;

        let oExpected = [
            Vector3.zeros,
            Vector3.ones.mul(0.5),
            Vector3.ones.mul(0.5),
            Vector3.zeros,
            Vector3.ones.opp.mul(0.5),
            Vector3.ones.opp.mul(0.5),
        ];

        let oSolved = oSolver.solve(Vector3.zeros, Vector3.ones, 200);
        let gSolved = gSolver.solve(Vector3.zeros, Vector3.zeros, 200);

        oSolved.forEach(function(u, index){
            assert(u.isEqual(oExpected[index % oExpected.length]));
        });

        gSolved.forEach(function (u, index) {
            assert(u.isEqual(Vector3.ez.mul(index * index)));
        })
    });

    it("Trajectory", function () {
        let oExpected = [
            Vector3.zeros,
            Vector3.ones.mul(0.5),
            Vector3.ones.mul(0.5),
            Vector3.zeros,
            Vector3.ones.opp.mul(0.5),
            Vector3.ones.opp.mul(0.5),
        ];

        let oSolved = oSolver.trajectory(Vector3.zeros, Vector3.ones, 200);

        oSolved.pairs.forEach(function (pair, index) {
            assert(pair.vector.isEqual(oExpected[index % oExpected.length]));
            assert(pair.origin.isEqual(Vector3.zeros));
        });
    });
});

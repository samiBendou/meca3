const assert = require("chai").assert;

describe("Solver Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Solver = require("../Solver.js");
    const BufferTrajectory = require("../BufferTrajectory.js");

    let oSolver = new Solver(function (u) {
        return u.copy().opp();
    });
    let gSolver = new Solver(function () {
        return Vector3.ez.mul(2);
    });

    let oExpected = [
        Vector3.zeros,
        Vector3.ones.mul(0.5),
        Vector3.ones.mul(0.5),
        Vector3.zeros,
        Vector3.ones.opp().mul(0.5),
        Vector3.ones.opp().mul(0.5),
    ];

    it("Solve", function () {
        let oSolved = oSolver.solve(Vector3.zeros, Vector3.ones, 200);
        let gSolved = gSolver.solve(Vector3.zeros, Vector3.zeros, 200);

        oSolved.forEach(function(u, index){
            assert(u.isEqual(oExpected[index % oExpected.length]));
        });

        gSolved.forEach(function (u, index) {
            assert(u.isEqual(Vector3.ez.mul(index * index)));
        })
    });

    it("Buffer step", function () {
        let u0 = Vector3.zeros, u1 = oSolver.initialTransform(Vector3.zeros, Vector3.ones, 1);
        let trajectory = BufferTrajectory.discrete([u0, u1]);
        oSolver.buffer(trajectory, 1);

        trajectory.pairs.forEach(function (pair) {
            assert(pair.vector.isEqual(Vector3.scal(0.5)));
        });
    });

    it("Variable step", function () {
        let oSolved = oSolver.solve(Vector3.zeros, Vector3.ones, 5, [1, 1, 1, 1]);
        oSolved.forEach(function (u, index) {
            assert(u.isEqual(oExpected[index % oExpected.length]));
        });

    });

    it("Trajectory", function () {
        let oSolved = oSolver.trajectory(Vector3.zeros, Vector3.ones, 200);
        oSolved.pairs.forEach(function (pair, index) {
            assert(pair.vector.isEqual(oExpected[index % oExpected.length]));
            assert(pair.origin.isEqual(Vector3.zeros));
        });
    });

    it("Max duration solve", function () {
        let oSolved = oSolver.solveMax(Vector3.zeros, Vector3.ones, 5, 1);
        oSolved.forEach(function (u, index) {
            assert(u.isEqual(oExpected[index % oExpected.length]));
        });
    });

    it("Max duration trajectory", function () {
        let oSolved = oSolver.trajectoryMax(Vector3.zeros, Vector3.ones, 5, 1);
        oSolved.pairs.forEach(function (pair, index) {
            assert(pair.vector.isEqual(oExpected[index % oExpected.length]));
            assert(pair.origin.isEqual(Vector3.zeros));
        });
    });
});

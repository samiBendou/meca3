const assert = require("chai").assert;

describe("Solver Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Solver = require("../Solver.js");
    const BufferTrajectory = require("../BufferTrajectory.js");

    let osolver, gsolver;

    function setUp() {
        osolver = new Solver((u) => u.copy().opp()); // harmonic oscillator d2u/dt2 = -u
        gsolver = new Solver(() => new Vector3(0, 0, 2)); // constant gravity d2u/dt2 = k
    }

    let oExpected = [
        Vector3.zeros,
        Vector3.ones.mul(0.5),
        Vector3.ones.mul(0.5),
        Vector3.zeros,
        Vector3.ones.opp().mul(0.5),
        Vector3.ones.opp().mul(0.5),
    ];

    it("Solve", function () {
        setUp();
        let oSolved = osolver.solve(Vector3.zeros, Vector3.ones, 200);
        let gSolved = gsolver.solve(Vector3.zeros, Vector3.zeros, 200);

        oSolved.forEach((u, index) => {
            assert(u.isEqual(oExpected[index % oExpected.length]))
        });
        gSolved.forEach((u, index) => {
            assert(u.isEqual(Vector3.ez.mul(index * index)))
        });
    });

    it("Buffer step", function () {
        setUp();
        let u0 = Vector3.zeros, u1 = osolver.initialTransform(Vector3.zeros, Vector3.ones, 1);
        let trajectory = BufferTrajectory.discrete([u0, u1]);

        osolver.buffer(trajectory, 1);
        trajectory.pairs.forEach((pair) => {
            assert(pair.vector.isEqual(Vector3.scal(0.5)))
        });
    });

    it("Variable step", function () {
        setUp();
        let oSolved = osolver.solve(Vector3.zeros, Vector3.ones, 5, [1, 1, 1, 1]);
        oSolved.forEach((u, index) => {
            assert(u.isEqual(oExpected[index % oExpected.length]))
        });
    });

    it("Trajectory", function () {
        setUp();
        let oSolved = osolver.trajectory(Vector3.zeros, Vector3.ones, 200);
        oSolved.pairs.forEach((pair, index) => {
            assert(pair.vector.isEqual(oExpected[index % oExpected.length]));
            assert(pair.origin.isEqual(Vector3.zeros));
        });
    });

    it("Max duration solve", function () {
        setUp();
        let oSolved = osolver.solveMax(Vector3.zeros, Vector3.ones, 5, 1);
        oSolved.forEach((u, index) => {
            assert(u.isEqual(oExpected[index % oExpected.length]));
        });
    });

    it("Max duration trajectory", function () {
        setUp();
        let oSolved = osolver.trajectoryMax(Vector3.zeros, Vector3.ones, 5, 1);
        oSolved.pairs.forEach((pair, index) => {
            assert(pair.vector.isEqual(oExpected[index % oExpected.length]));
            assert(pair.origin.isEqual(Vector3.zeros));
        });
    });
});

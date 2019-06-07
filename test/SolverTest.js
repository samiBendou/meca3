const assert = require("chai").assert;

describe("Solver Tests", function () {
    const Vector3 = require("../Vector3.js");
    const Solver = require("../Solver.js");
    const BufferTrajectory = require("../BufferTrajectory.js");

    let osolver, gsolver;
    let pulse, amp, freq;
    let k;
    let tol, count;
    let dt = 0.1;

    function setUp() {
        freq = 1 / 10;
        pulse = freq * 2 * Math.PI;
        amp = Vector3.ones;

        k = 1;

        tol = 0.01;
        count = Math.floor(1 / (freq * dt));

        osolver = new Solver((u) => u.oppc().mul(pulse ** 2), dt); // harmonic oscillator d2u/dt2 = -u
        gsolver = new Solver(() => new Vector3(0, 0, k), dt); // constant gravity d2u/dt2 = k
    }

    let o = (t) => amp.mulc(Math.sin(pulse * t * osolver.dt1) / pulse);
    let g = (t) => Vector3.ez.mul(0.5 * k * (t * gsolver.dt1) ** 2);

    it("Solve", function () {
        setUp();
        let oSolved = osolver.solve(Vector3.zeros, Vector3.ones, count);
        let gSolved = gsolver.solve(Vector3.zeros, Vector3.zeros, count);

        oSolved.forEach((u, index) => {
            assert.approximately(u.dist(o(index)), 0, tol, `${u} != ${o(index)} index : ${index}`);
        });
        gSolved.forEach((u, index) => {
            assert.approximately(u.dist(g(index)), 0, tol, `${u} != ${g(index)} index : ${index}`);
        });
    });

    it("Variable step", function () {
        setUp();
        let oSolved = osolver.solve(Vector3.zeros, Vector3.ones, count, new Array(count).fill(dt));
        oSolved.forEach((u, index) => {
            assert.approximately(u.dist(o(index)), 0, tol, `${u} != ${o(index)} index : ${index}`);
        });
    });

    it("Buffer step", function () {
        setUp();
        let u0 = Vector3.zeros, u1 = osolver.initialTransform(Vector3.zeros, Vector3.ones, dt);
        let trajectory = BufferTrajectory.discrete([u0, u1]);

        osolver.buffer(trajectory, dt);
        osolver.buffer(trajectory, dt);
        trajectory.pairs.forEach((pair, index) => {
            let str = `${pair.relative} != ${o(index)} index : ${index}`;
            assert.approximately(pair.relative.dist(o(index + 2)), 0, tol, str);
        });
    });

    it("Trajectory", function () {
        setUp();
        let oSolved = osolver.trajectory(Vector3.zeros, Vector3.ones, count, dt);
        oSolved.pairs.forEach((pair, index) => {
            assert.approximately(pair.vector.dist(o(index)), 0, tol, `${pair.vector} != ${o(index)} index : ${index}`);
            assert(pair.origin.isZero(), `${pair.origin}`);
        });
    });

    it("Max duration solve", function () {
        setUp();
        let oSolved = osolver.solveMax(Vector3.zeros, Vector3.ones, count * dt, dt);
        oSolved.forEach((u, index) => {
            assert.approximately(u.dist(o(index)), 0, tol, `${u} != ${o(index)} index : ${index}`);
        });
    });

    it("Max duration trajectory", function () {
        setUp();
        let oSolved = osolver.trajectoryMax(Vector3.zeros, Vector3.ones, count * dt, dt);
        oSolved.pairs.forEach((pair, index) => {
            assert.approximately(pair.vector.dist(o(index)), 0, tol, `${pair.vector} != ${o(index)} index : ${index}`);
            assert(pair.origin.isZero(), `${pair.origin}`);
        });
    });
});

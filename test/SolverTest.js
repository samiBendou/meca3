const assert = require("./common.js");

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
        freq = 1 / 15;
        pulse = freq * 2 * Math.PI;
        amp = Vector3.ones;

        k = 9.81;

        tol = 0.01;
        count = Math.floor(5 / (freq * dt));

        osolver = new Solver((u) => u.oppc().mul(pulse ** 2), dt); // harmonic oscillator d2u/dt2 = -u
        gsolver = new Solver(() => new Vector3(0, 0, k), dt); // constant gravity d2u/dt2 = k
    }

    let o = (t) => amp.mulc(Math.sin(pulse * t * osolver.dt1) / pulse);
    let g = (t) => Vector3.ez.mul(0.5 * k * (t * gsolver.dt1) ** 2);

    it("Solve", function () {
        setUp();
        assert.meca3.solve(osolver.solve(Vector3.zeros, Vector3.ones, count), o, tol);
        assert.meca3.solve(gsolver.solve(Vector3.zeros, Vector3.zeros, count), g, tol);
    });

    it("Variable step", function () {
        setUp();
        assert.meca3.solve(osolver.solve(Vector3.zeros, Vector3.ones, count, new Array(count).fill(dt)), o, tol);
    });

    it("Buffer step", function () {
        setUp();
        let u0 = Vector3.zeros, u1 = osolver.initialTransform(Vector3.zeros, Vector3.ones, dt);
        let trajectory = BufferTrajectory.discrete([u0, u1]);

        osolver.buffer(trajectory, dt);
        osolver.buffer(trajectory, dt);
        assert.meca3.solve(trajectory, o, tol, 2);
    });

    it("Trajectory", function () {
        setUp();
        assert.meca3.solve(osolver.trajectory(Vector3.zeros, Vector3.ones, count, dt), o, tol);
    });

    it("Max duration solve", function () {
        setUp();
        assert.meca3.solve(osolver.solveMax(Vector3.zeros, Vector3.ones, count * dt, dt), o, tol);
    });

    it("Max duration trajectory", function () {
        setUp();
        assert.meca3.solve(osolver.trajectoryMax(Vector3.zeros, Vector3.ones, count * dt, dt), o, tol);
    });
});

import {check} from "./common";
import Vector3 from "../src/Vector3";
import BufferTrajectory from "../src/BufferTrajectory";
import Solver from "../src/Solver";

describe("Solver Tests", function () {

    let osolver: Solver, gsolver: Solver;
    let pulse: number, amp: Vector3, freq: number;
    let k: number;
    let tol: number, count: number;
    let dt = 0.1;

    let o = (t: number) => amp.mulc(Math.sin(pulse * t * osolver.dt1) / pulse);
    let g = (t: number) => Vector3.ez.mul(0.5 * k * (t * gsolver.dt1) ** 2);

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

    it("Solve", function () {
        setUp();
        check.solve(osolver.solve(Vector3.zeros, Vector3.ones, count), o, tol);
        check.solve(gsolver.solve(Vector3.zeros, Vector3.zeros, count), g, tol);
    });

    it("Buffer step", function () {
        setUp();
        let u0 = Vector3.zeros, u1 = osolver.initialTransform(Vector3.zeros, Vector3.ones, dt);
        let trajectory = BufferTrajectory.discrete([u0, u1]);

        osolver.buffer(trajectory, dt);
        osolver.buffer(trajectory, dt);
        check.solve(trajectory, o, tol, 2);
    });

    it("Trajectory", function () {
        setUp();
        check.solve(osolver.trajectory(Vector3.zeros, Vector3.ones, count, dt), o, tol);
    });

    it("Max duration solve", function () {
        setUp();
        check.solve(osolver.solveMax(Vector3.zeros, Vector3.ones, count * dt, dt), o, tol);
    });

    it("Max duration trajectory", function () {
        setUp();
        check.solve(osolver.trajectoryMax(Vector3.zeros, Vector3.ones, count * dt, dt), o, tol);
    });
});

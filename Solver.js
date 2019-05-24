/**
 *
 * @type {module.Solver}
 * @date 09/05/2019
 * @author samiBendou sbdh75@gmail.com
 * @brief Solve second order differential equation
 * @details Solve equations with the form  d2u/dt2 = f(u, t) where :
 *          - u is the unknown vector function
 *          - d2u / dt2 denotes the second order derivative of u
 *          - f(u, t) is a smooth function depending only on coordinates of u and time t
 *          - v = du/dt is the derivative of u
 *
 *          This solver is designed to be used in two ways :
 *          1. Step by step solving. Get the next value of u giving the current and previous values of u
 *          2. Trajectory solving. Give the number of steps, u0 and v0 and get an array containing u at each step
 *
 *          Only explicit Euler's method is available for the moment.
 *
 * @property {function} field Javascript function representing the output of the f(., .) function.
 * @property {Number} step Constant time step between two solving instant.
 */

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    Vector3 = require("./Vector3.js");

class Solver {
    constructor(field, step = 1) {
        this.field = field;
        this.step = step;
    }

    eulerStep(cur, prev, t) {
        let step2 = this.step * this.step;
        return cur.copy().mul(2).sub(prev).add(this.field(cur, t).mul(step2));
    }

    initialTransform(u0, v0) {
        let u1 = v0.copy().mul(this.step).add(u0);
        return u1.add(this.field(u1, 0).mul(this.step * this.step / 2));
    }

    solve(u0, v0, count) {
        let u = new Array(count);

        u[0] = u0.copy();
        u[1] = this.initialTransform(u0, v0);
        for (let i = 2; i < count; i++) {
            u[i] = this.eulerStep(u[i - 1], u[i - 2], i * this.step);
        }

        return u;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Solver;
else
    window.Solver = Solver;
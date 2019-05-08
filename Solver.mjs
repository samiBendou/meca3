const Vector3 = require("./Vector3.mjs");

module.exports = class Solver {
    constructor(field, step = 1) {
        this.field = field;
        this.step = step;
    }

    eulerStep(cur, prev, t) {
        var step2 = this.step * this.step;
        return cur.copy().mul(2).sub(prev).add(this.field(cur, t).mul(step2));
    }

    solve(u0, v0, count) {
        var u = new Array(count);
        var step2 = this.step * this.step;

        u[0] = u0.copy();
        u[1] = v0.copy().mul(this.step).add(u0);
        u[1].add(this.field(u[1], 0).mul(step2 / 2));

        for(var i = 2; i < count; i++) {
            u[i] = this.eulerStep(u[i - 1], u[i - 2], i * this.step);
        }

        return u;
    }
}
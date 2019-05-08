const
     Vector3 = require("./Vector3.mjs");

module.exports = class Matrix3 {

    constructor(xx = 0, xy = 0, xz = 0,
                yx = 0, yy = 0, yz = 0,
                zx = 0, zy = 0, zz = 0) {
                    
        this.x = new Vector3(xx, xy, xz);
        this.y = new Vector3(yx, yy, yz);
        this.z = new Vector3(zx, zy, zz);
    }

    row(i) {
        var labels = ["x", "y", "z"];
        return this[labels[i]].copy();
    }

    col(j) {
        var labels = ["x", "y", "z"];
        return new Vector3(this.x[labels[j]], this.y[labels[j]], this.z[labels[j]]);
    }

    fill(s) {
        this.x.fill(s); this.y.fill(s); this.z.fill(s);
        return this;
    }

    add(m) {
        this.x.add(m.x); this.y.add(m.y); this.z.add(m.z);
        return this;
    }

    sub(m) {
        this.x.sub(m.x); this.y.sub(m.y); this.z.sub(m.z);
        return this;
    }

    get opp() {
        this.x.opp(); this.y.opp(); this.z.opp();
        return this;
    }

    mul(s) {
        this.x.mul(s); this.y.mul(s); this.z.mul(s);
        return this;
    }

    div(s) {
        this.x.div(s); this.y.div(s); this.z.div(s);
        return this;
    }

    get trans() {
        var copy = this.copy();

        copy.x.y = this.y.x;
        copy.x.z = this.z.x;

        copy.y.x = this.x.y;
        copy.y.z = this.z.y;

        copy.z.x = this.x.z;
        copy.z.y = this.y.z;

        return copy;
    }

    prod(m) {
        var mTrs = m.copy().trans;
        var copy = this.copy();

        copy.x.x = this.x.scal(mTrs.x); copy.x.y = this.x.scal(mTrs.y); copy.x.z = this.x.scal(mTrs.z);

        copy.y.x = this.y.scal(mTrs.x); copy.y.y = this.y.scal(mTrs.y); copy.y.z = this.y.scal(mTrs.z);

        copy.z.x = this.z.scal(mTrs.x); copy.z.y = this.z.scal(mTrs.y); copy.z.z = this.z.scal(mTrs.z);

        return copy;
    }

    map(u) {
        var copy = u.copy();

        copy.x = this.x.scal(u); copy.y = this.y.scal(u); copy.z = this.z.scal(u);

        return copy;
    }

    get det() {
        return      this.x.x * this.y.y * this.z.z + this.x.y * this.y.z * this.z.x + this.x.z * this.y.x * this.z.y 
                -   this.x.z * this.y.y * this.z.x - this.x.y * this.y.x * this.z.z - this.x.x * this.y.z * this.z.y;
    }

    get inv() {
        return (new Matrix3(this.y.y * this.z.z - this.y.z * this.z.y,
                            this.x.z * this.z.y - this.x.y * this.z.z, 
                            this.x.y * this.y.z - this.x.z * this.y.y,

                            this.y.z * this.z.x - this.y.x * this.z.z,
                            this.x.x * this.z.z - this.x.z * this.z.x,
                            this.x.z * this.y.x - this.x.x * this.y.z,

                            this.y.x * this.z.y - this.y.y * this.z.x,
                            this.x.y * this.z.x - this.x.x * this.z.y,
                            this.x.x * this.y.y - this.x.y * this.y.x)).div(this.det);
    }

    copy() {
        var copy = new Matrix3();

        copy.x = this.x.copy(); copy.y = this.y.copy(); copy.z = this.z.copy();

        return copy;
    }

    isEqual(m) {
        return this.x.isEqual(m.x) && this.y.isEqual(m.y) && this.z.isEqual(m.z);
    }

    isZero() {
        return this.x.isZero() && this.y.isZero() && this.z.isZero();
    }

    toString() {
        return this.x.toString() + "\n" + this.y.toString() + "\n" + this.z.toString();
    }

    toArray() {
        return [this.x.toArray(), this.y.toArray(), this.z.toArray()];
    }

    static get zeros() {
        return new Matrix3();
    }

    static get ones() {
        return Matrix3.scal(1);
    }

    
    static get eye() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    static scal(s) {
        return new Matrix3(s, s, s, s, s, s, s, s, s);
    }
    
    static can(i, j) {
        var labels = ["x", "y", "z"];
        var can = Matrix3.zeros;

        can[labels[i]][labels[j]] = 1;
        return can;
    }

    static sum(matrices) {
        return matrices.reduce(function(prev, cur) {return prev.copy().add(cur);});
    }

    static comb(scalars, matrices) {
        return matrices.reduce(function(prev, cur, index) {
            return prev.copy().mul(scalars[index - 1]).add(cur.copy().mul(scalars[index]));
        });
    }

    static prod(matrices) {
        return matrices.reduce(function(prev, cur) {return prev.copy().prod(cur);});
    }
    
    
    static rotX(theta) {
        return new Matrix3( 1,                  0,                  0,
                            0,                  Math.cos(theta),    -Math.sin(theta),
                            0,                  Math.sin(theta),    Math.cos(theta));
    }

    static rotY(theta) {
        return new Matrix3( Math.cos(theta),    0,                  Math.sin(theta),
                            0,                  1,                  0,
                            -Math.sin(theta),   0,                  Math.cos(theta));
    }

    static rotZ(theta) {
        return new Matrix3(Math.cos(theta),     -Math.sin(theta),   0,
                            Math.sin(theta),    Math.cos(theta),    0,
                            0,                  0,                  1);
    }

    static rot(axis, theta) {
        //R = P + cos(theta) * (I - P) + sin(theta) * Q

        var id = Matrix3.eye; // antisymetric representation of u
        var q = Matrix3.zeros;
        var u = axis.copy().div(axis.r); // normalized axis
        var p = Matrix3.tens(u); // projection on rotation axis
        var r = p.copy();

        q.x = u.cross(Vector3.ex); q.y = u.cross(Vector3.ey); q.z = u.cross(Vector3.ez);
        q = q.trans;

        r.add(id.sub(p).mul(Math.cos(theta))).add(q.mul(Math.sin(theta)));

        return r;
    }

    static fromArray(arr) {
        return new Matrix3( arr[0][0], arr[0][1], arr[0][2],
                            arr[1][0], arr[1][1], arr[1][2],
                            arr[2][0], arr[2][1], arr[2][2]);
    }

    static tens(u) {
        return new Matrix3(
            u.x * u.x, u.x * u.y, u.x * u.z,
            u.y * u.x, u.y * u.y, u.y * u.z,
            u.z * u.x, u.z * u.y, u.z * u.z,
        );
    }

    static aff(m, u, v) {
        return m.map(u).add(v);
    }
};
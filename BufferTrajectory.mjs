const PointPair = require("./PointPair.mjs");
const Trajectory = require("./Trajectory.mjs");

module.exports = class BufferTrajectory extends Trajectory{
    constructor(size, trajectory) {
        super(new Array(size), new Array(size));
        this.size = size;
        this.addIndex = 0;
        if(trajectory !== undefined) {
            this.bufferize(trajectory);
        }
    }

    bufferize(trajectory) {
        var delta = (trajectory.pairs.length - this.size);
        var end = delta >= 0 ? this.size : trajectory.pairs.length;

        for(var i = 0; i < end ; i++) {
            var index = delta >= 0 ? (i + delta) : i;
            this.pairs[i] = trajectory.pairs[index].copy();
            this.steps[i] = trajectory.steps[index];
        }

        for(var i = end; i < this.size; i++) {
            this.pairs[i] = PointPair.zeros();
            this.steps[i] = 0.0;
        }
        this.addIndex = delta >= 0 ? 0 : trajectory.pairs.length;
    }

    at(t) {
        return this.pairs[(t + this.addIndex) % this.size];
    }

    add(pair, step) {
        if(step !== undefined) {
            this.steps[this.addIndex] = step;
        } else if(this.steps.length > 0){
            this.steps[this.addIndex] = this.steps[this.steps.length - 1];
        } else {
            return this;
        }
        this.pairs[this.addIndex] = pair;
        this.addIndex = (this.addIndex + 1) % this.size;
        
        return this;
    }

    clear() {
        this.pairs = new Array(this.size);
        this.steps = new Array(this.steps);
    }
};
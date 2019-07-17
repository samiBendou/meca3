if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    const VSpace = require("./VSpace.js");
    const Vector3 = require("./Vector3.js");
    const Matrix3 = require("./Matrix3.js");
    const PointPair = require("./PointPair.js");
    const Trajectory = require("./Trajectory.js");
    const BufferTrajectory = require("./BufferTrajectory.js");
    const Solver = require("./Solver.js");
    const Point = require("./Point.js");
    const Field = require("./Field.js");

    module.exports.VSpace = VSpace;
    module.exports.Vector3 = Vector3;
    module.exports.Matrix3 = Matrix3;
    module.exports.PointPair = PointPair;
    module.exports.Trajectory = Trajectory;
    module.exports.BufferTrajectory = BufferTrajectory;
    module.exports.Solver = Solver;
    module.exports.Point = Point;
    module.exports.Field = Field;
}
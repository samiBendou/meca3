let assert = require("chai").assert;

assert.meca3 = {
    equal: function (actual,
                     expected,
                     message = `${actual.constructor.name} equality \n${actual}\n!=\n${expected}`) {
        if (typeof actual == "number") {
            assert.equal(actual, expected, message);
        } else {
            assert(actual.isEqual(expected), message);
        }
    },

    approximately: function (actual,
                             expected,
                             tol,
                             message = `${actual.constructor.name} equality \n${actual}\n!=\n${expected}`) {
        if (typeof actual == "number") {
            assert.approximately(actual, expected, tol, message);
        } else {
            assert.approximately(actual.dist(expected), 0, tol, message);
        }
    },

    arrayEqual: function (actual, expected, tol) {

        actual.forEach((value, index) => {
            let message = `\n${actual}\n${expected}\nindex: ${index}`;
            if (tol === undefined)
                assert.meca3.equal(value, expected[index], message);
            else
                assert.meca3.approximately(value, expected[index], tol, message);
        });
    },

    arrayEqual2D: function (actual, expected, tol) {
        actual.forEach((row, i) => {
            row.forEach((value, j) => {
                let message = `\n${actual}\n${expected}\nindex: ${i}, ${j}`;
                if (tol === undefined)
                    assert.meca3.equal(value, expected[i][j], message);
                else
                    assert.meca3.approximately(value, expected[i][j], tol, message);
            })
        });
    },

    solve: function (approx, exact, tol, shift = 0) {
        if (approx instanceof Array) {
            approx.forEach((u, index) => {
                assert.approximately(u.dist(exact(index + shift)), 0, tol, `${u} != ${exact(index)} index: ${index}`);
            });
        } else {
            approx.pairs.forEach((pair, index) => {
                let str = `${pair.vector} != ${exact(index + shift)} index : ${index}`;
                assert.approximately(pair.vector.dist(exact(index + shift)), 0, tol, str);
                assert(pair.origin.isZero(), `${pair.origin}`);
            });
        }
    }
};

module.exports = assert;


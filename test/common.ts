import {assert} from "chai";

export const check = {
    equal: function (actual: any,
                     expected: any,
                     message = `${actual.constructor.name} equality \n${actual}\n!=\n${expected}`) {
        if (typeof actual == "number") {
            assert.equal(actual, expected, message);
        } else {
            assert(actual.isEqual(expected), message);
        }
    },

    approximately: function (actual: any,
                             expected: any,
                             tol: number,
                             message = `${actual.constructor.name} equality \n${actual}\n!=\n${expected}`) {
        if (typeof actual == "number") {
            assert.approximately(actual, expected, tol, message);
        } else {
            assert.approximately(actual.dist(expected), 0, tol, message);
        }
    },

    arrayEqual: function (actual: any[], expected: any[], tol?: number) {

        actual.forEach((value: any, index: number) => {
            let message = `\n${actual}\n${expected}\nindex: ${index}`;
            if (tol === undefined)
                check.equal(value, expected[index], message);
            else
                check.approximately(value, expected[index], tol, message);
        });
    },

    arrayEqual2D: function (actual: any[], expected: any[], tol?: number) {
        actual.forEach((row: any[], i: number) => {
            row.forEach((value: any, j: number) => {
                let message = `\n${actual}\n${expected}\nindex: ${i}, ${j}`;
                if (tol === undefined)
                    check.equal(value, expected[i][j], message);
                else
                    check.approximately(value, expected[i][j], tol, message);
            })
        });
    },

    solve: function (approx: any, exact: any, tol: number, shift = 0) {
        if (approx instanceof Array) {
            approx.forEach((u: any, index: number) => {
                assert.approximately(u.dist(exact(index + shift)), 0, tol, `${u} != ${exact(index)} index: ${index}`);
            });
        } else {
            approx.pairs.forEach((pair: any, index: number) => {
                let str = `${pair.vector} != ${exact(index + shift)} index : ${index}`;
                assert.approximately(pair.vector.dist(exact(index + shift)), 0, tol, str);
                assert(pair.origin.isZero(), `${pair.origin}`);
            });
        }
    }
};
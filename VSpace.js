if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    Vector3 = require("./Vector3.js");
Matrix3 = require("./Matrix3.js");

/**
 * @class VSpace
 * @author samiBendou
 * @brief operations in vector space
 * @details This static class represents operations provided on a vector and matrix array
 */

class VSpace {
    /**
     * @brief sums vectors in array
     * @param vectors {Array} array of vectors
     * @returns {Vector3|Matrix3} value of the sum
     */
    static sum(vectors) {
        if (vectors.length === 0)
            return undefined;

        return vectors.reduce(function (prev, cur) {
            return prev.copy().add(cur);
        });
    }

    /**
     * @brief linear combination of vectors in array
     * @param scalars {Array} array of numbers
     * @param vectors {Array} array of vectors
     * @returns {Vector3|Matrix3} value of linear combination
     */
    static comb(scalars, vectors) {
        if (vectors.length === 0 || scalars.length === 0)
            return undefined;

        let initializer = vectors[0].constructor.name === "Vector3" ? Vector3.zeros : Matrix3.zeros;
        return vectors.reduce(function (acc, cur, index) {
            return acc.add(cur.copy().mul(scalars[index]));
        }, initializer);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = VSpace;
else
    window.VSpace = VSpace;
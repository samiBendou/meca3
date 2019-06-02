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
        return vectors.reduce(function (acc, cur, index) {
            return acc.add(cur.copy().mul(scalars[index]));
        }, Vector3.zeros);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = VSpace;
else
    window.VSpace = VSpace;
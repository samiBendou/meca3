if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Vector3 = require("./Vector3.js");
    Matrix3 = require("./Matrix3.js");
}


/**
 * @class VSpace
 * @author samiBendou
 * @brief operations in _vector space_
 * @details This static class represents operations provided on a vector and matrix array such as **addition** and
 * **linear combination**
 */

class VSpace {
    /**
     * @brief sums vectors in array
     * @param vectors {Array} array of `Vector3` or `Matrix3`
     * @returns {Vector3|Matrix3} value of the sum
     */
    static sum(vectors) {
        let initializer = VSpace.initializer(vectors[0]);
        return vectors.reduce((acc, u) => acc.add(u), initializer);
    }

    /**
     * @brief linear combination of vectors in array
     * @param scalars {Array} array of numbers
     * @param vectors {Array} array of `Vector3` or `Matrix3`
     * @returns {Vector3|Matrix3} value of linear combination
     */
    static comb(scalars, vectors) {
        let initializer = VSpace.initializer(vectors[0]);
        return vectors.reduce((acc, u, index) => acc.add(u.mulc(scalars[index])), initializer);
    }

    static initializer(vector) {
        return vector instanceof Vector3 ? Vector3.zeros : Matrix3.zeros;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = VSpace;
else
    window.VSpace = VSpace;
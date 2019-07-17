/**
 * @brief abstract vector
 * @details This interface represent a **vector** in an abstract _normal vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * This interface is designed such that each provided algebraical operation must has a similar **copy operation** implemented.
 * The regular operation returns a reference to `this` and the copy operation a new instance of the `Vector`
 * containing the **result of the operation**.
 *
 * The the vectors represented by this interface are **not only vectors** in a strict mathematical meaning. These vectors
 * implements a binary product in order to perform repeated multiplications.
 */
export interface Vector {
    /**
     * @brief clone a vector by creating a new instance with same values
     * @returns cloned vector
     */
    copy(): Vector;

    /**
     * @brief fills the vector with a single value
     * @param s value used to fill
     * @returns reference to `this`
     */
    fill(s: number): Vector;

    fillc(s: number): Vector;

    /**
     * @brief usual addition between two vectors
     * @param vector vector to add
     * @returns reference to `this`
     */
    add(vector: Vector): Vector;

    addc(vector: Vector): Vector;

    /**
     * @brief usual subtraction between two vectors
     * @param vector vector to subtract
     * @returns reference to `this`
     */
    sub(vector: Vector): Vector;

    subc(vector: Vector): Vector;

    /**
     * @brief usual opposite of the vector
     * @returns reference to `this`
     */
    opp(): Vector;

    oppc(): Vector;

    /**
     * @brief usual scalar multiplication of the vector
     * @param s scalar to multiply
     * @returns reference to `this`
     */
    mul(s: number): Vector;

    mulc(s: number): Vector;

    /**
     * @brief usual scalar division of the vector
     * @param s scalar to divide
     * @returns reference to `this`
     */
    div(s: number): Vector;

    divc(s: number): Vector;

    /**
     * @brief meaningful product between two vectors
     * @param vector vector to multiply
     * @returns reference to `this`
     */
    prod(vector: Vector): Vector;

    prodc(vector: Vector): Vector;

    /**
     * @brief usual scalar product of two vector
     * @param vector vector to multiply
     * @returns value of scalar multiplication
     */
    scal(vector: Vector): number;

    /**
     * @brief usual distance between two vector
     * @param vector other vector
     * @returns value of the distance
     */
    dist(vector: Vector): number;
}

const initializer = (vector: Vector): Vector => vector.copy().fill(0);

/**
 * @brief sums vectors in array
 * @param vectors array of objects that implements `Vector` interface
 * @returns value of the sum
 */
export const sum = (vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.add(u), initializer(vectors[0]));

/**
 * @brief multiplies vectors in array
 * @param vectors array of objects that implements `Vector` interface
 * @returns value of the product
 */
export const prod = (vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.prod(u), initializer(vectors[0]));

/**
 * @brief linear combination of vectors in array
 * @param scalars array of coefficient of the combination
 * @param vectors array of objects that implements `Vector` interface
 * @returns value of linear combination
 */
export const comb = (scalars: number[], vectors: Vector[]): Vector =>
    vectors.reduce((acc, u, index) => acc.add(u.mulc(scalars[index])), initializer(vectors[0]));

export const epsilon = 2.2204460492503130808472633361816e-16;
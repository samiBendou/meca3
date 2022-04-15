import { Interpolable, List, Metrical, Numerical, Vectorial } from "../common/";

/**
 * ## Brief
 * [[Vector]] represents a **vector** in a  _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * ### Main Features
 * - **Copy and Clone** `copy`, `clone`, `assign`, ...
 * - **Manipulators** `floor`, `fill`, `abs`, ...
 * - **Algebra** `add`, `sub`, `inv`, `mul`, `prod`,  ...
 * - Linear, cubic and Bezier's **Interpolation** `lerp`, `herp`, ...
 * - **Equality**, zeros and distance methods `equal2`, `mag`, `dist1`, ...
 * - Provide **immutable operations** by cloning `addc`, `subc`, ...
 *
 * #### Example
 *
 * ```js
 * let u = Vector3.ex.mul(5.5), v = u.clone();
 * u.floor(); // u = (5, 0, 0)
 * u.lerp(v, 0.5) // u = (5.25, 0, 0);
 * u.comb(2, v) // u = (16.25, 0, 0);
 * ```
 *
 * ## Getting Started
 *
 * ### Algebra and interpolation
 *
 * Perform additions, scalar multiplication, linear interpolation and many other common operations.
 * Take a look at the [glossary of operations](https://samibendou.github.io/space3/) to have an exhaustive list.
 *
 * #### Example
 * ```js
 * u.add(v).sub(w).comb(lambda, w);
 * a.prod(b).inv();
 * ```
 *
 * Theses operations are the core of **space3** framework. Almost all classes of the framework
 * provide or use theses.
 *
 * if you need a little refresh on algebra,
 * I recommend you to watch the great algebra curse on [3Blue1Brown](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) channel.
 *
 * The operations are defined in the reference by mentioning two vectors `u` and `v`. it's admitted that :
 * - `u` refers to `this` in the code
 * - `v` refers to the parameter `vector` in the code
 * - The result is stored in `this`
 * - If the method is suffixed by `c`, the result is a newly created [[Vector]]
 *
 * ### Comparison and zeros
 * In order to avoid float precision errors and allow you to choose the most pertinent comparison,
 * a [[Vector]] provides three different ways to compare to another one :
 * - Using the norm 1, manhattan distance
 * - Using the norm 2, dot product distance
 * - Using exact comparison coordinates by coordinates.
 *
 * The first two comparison are based on the following definition of norms :
 *
 * ![Norm](media://norm.png)
 *
 * Given a norm the distance between two vector is defined by :
 *
 * ![Distance](media://distance.png)
 *
 * #### Example
 * ```js
 * let ex = Vector3.ex, ey = Vector3.ey, zeros = Vector3.zeros;
 * ex.equal2(ey) // false
 * ex.equal1(ey) // false
 * ex.exact(ex) // true
 * ex.zero1() // false
 * zeros.nil() // true
 * zeros.add(ex.mul(0.5 * Number.EPSILON)).nil() // false
 * ```
 * **Note** `mag`, `mag2` accessors uses the norm 2
 *
 * If you don't know which comparison to use, I recommend you `dist`, `equal2` and `zero2` to compare objects by default.
 */
export default interface Vector
  extends List,
    Numerical,
    Vectorial,
    Metrical,
    Interpolable {}

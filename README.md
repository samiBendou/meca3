[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# meca3

## Represent 3D space and movement

### Introduction
_meca3_ is a **mechanics framework**. It represents **3D space** and provides a **solver**
to compute **trajectory** of **moving bodies**.

##### Featuring :
- **object oriented** memory efficient syntax to perform mathematical operations.
- **3D optimized implementation** of common vectors and matrix operations to provide fast computation.
- **lightweight solver** to perform either step by step or global ODE solving
- **geometrical transformations** such as translation of affine transform

### Install
Use `npm i meca3` in terminal to import package into your `node_modules` directory.
Import each class you want use the following syntax :

```js
const Vector3 = require(Vector3.js);
```

### Run unit tests
Unit testing is performed using **mocha** and **chai** frameworks. 
Install the framework and go to the test directory. 
For each class .mjs file a unit test file is provided.

## Documentation

### Getting Started

#### Basic concepts

meca3 library is designed to :
- Represent a _vector_ and a _point_ in 3D space
- Represent the _trajectory_ of a point in 3D space
- Represent a _3x3 matrix_
- Perform _geometrical transformations_
- Solve ODE representing a point moving into a time dependant _field_

##### Structure of package

The package has an object oriented structure as follows :

![Class Diagram](https://github.com/samiBendou/meca3/blob/master/classdiagram.png?raw=true)

**Notes :** 
- This diagram represents **only the main features** of the package.
- Red relationships means that a strong reference is used.
- Properties suffixed by `()` are Javascript **method property**

Each class and method is documented within the code so you can precisely determine the
inputs and outputs of a function.

##### Object oriented syntax

The object oriented structure allows to perform operations chaining with manual copy management.
```js
    u = v.copy().add(w); // Creates a new Vector3 : u = v + w
    v.add(w); // Add w into v : v = v + w
```
**Note :**  The first line does not change v or w.

##### 3D space representation

The `Matrix3` and `Vector3` classes are using a cartesian coordinates syntax.
```js
    let u = Vector3.ex; // u = (1, 0, 0)
    u.y = 2; // u = (1, 2, 0)
    
    let m = Matrix3.eye; // m = identity 3x3 matrix
    m.x.x = 2; // m00 = 2
    m.x.y = 2; // m01 = 2
    m.y.x = 2; // m10 = 2
```

The `Vector3` can be represented in commons different modes such as cylindrical and spherical.
```js
let u = Vector3.ones;
console.log(u.r); // outputs +sqrt(3), the norm of u
console.log(u.theta); // outputs +pi/4, the angle between u and ex
console.log(u.phi); // outputs +pi/4, the angle between u and ez
```

Operations can be performed between `Matrix3` and `Vector3`.
```js
let m = Matrix3.ones; // m = matrix filled with ones
let u = Vector3.ey; // u = (0, 1, 0)
console.log(m.map(u).toString()) // outputs (1, 1, 1)
```

### Additional informations
**Copyright** © 2019 Sami Dahoux [Github](https://github.com/samiBendou/), All Rights Reserved


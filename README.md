[![Version](https://img.shields.io/npm/v/meca3.svg?style=flat-square)](https://www.npmjs.com/package/meca3)
[![Build status](https://img.shields.io/travis/samiBendou/meca3.svg?style=flat-square)](https://travis-ci.org/samiBendou/meca3)
[![Coverage](https://img.shields.io/coveralls/github/samiBendou/meca3.svg?style=flat-square)](https://coveralls.io/github/samiBendou/meca3)
[![Issues](https://img.shields.io/github/issues-raw/samiBendou/meca3.svg?style=flat-square)](https://github.com/samiBendou/meca3/issues)
[![License](https://img.shields.io/npm/l/meca3.svg?style=flat-square)](https://www.npmjs.com/package/meca3)

# meca3

## _meca3_ is a **mechanics framework** :rocket:

It designed to be an **advanced physics engine** for animation of **moving material points** 
:heavy_plus_sign::heavy_multiplication_x::heavy_minus_sign:

It can also be used as a **3D maths** general purpose toolbox :coffee:

- **Object oriented** and written in typescript

- **3D optimized implementation** of common algebraical operations to provide fast computation

- **Complete documentation** with **examples** that can be found on the [wiki](https://github.com/samiBendou/meca3/wiki/)

## Contribute to the project : [guide](https://github.com/samiBendou/meca3/blob/master/CONTRIBUTING.md) :satellite:

## Main features

**Note : Classes Vector3, Matrix3 and Point3 have been extended and are now available in the [space3](https://www.npmjs.com/package/space3) framework**

**Note : Theses classes will be removed from code base in next release**

### Linear algebra
Common abstraction such as matrix and vectors and usual operations between theses

```javascript
let m = Matrix3.id, u = Vector3.ones;
console.log(m.add(m)); 
console.log(m.map(u)); 
console.log(m.det); 
```


### Geometrical transformations
Translation or affine transform for various geometrical objects

```javascript
let gamma = Trajectory.elliptic(1, 2);
gamma.translate(Vector3.ex);
```

### Coordinates systems
Spherical and cylindrical coordinates manipulations

```javascript
let u = Vector3.cylindrical(1, Math.PI / 2, 0.5);
```

### Trajectory bufferization
Trajectory of fixed size for trajectory
```javascript
let gamma = BufferTrajectory.discrete([Vector3.ex, Vector3.ey]); // trajectory of size 2
```

### Lightweight solver
Step by step or iterative ODE solving, outputs arrays and trajectories

### Points systems mechanics
Move a point according to dynamic equation and represent dependent points field
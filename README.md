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

Install with the following command
```
npm install meca3
```

Use the provided modules with require
```js
const Vector3 = require("meca3").Vector3;
```

**Browser**: the module is compatible with browser. Install the module and import each file as follows
```html
<script src="path/to/meca3/Vector3.js"></script>
```
You can then use the modules in your browser js files.

### Run unit tests
Unit testing is performed using **mocha** and **chai** frameworks. 
Install the framework and go to the test directory. Run the following command

```
npm test
``` 

### Documenation
The module has a GitHub wiki as full documentation, it can be founded [here](https://github.com/samiBendou/meca3/wiki).

# pH Scale - implementation notes

This document contains notes related to the implementation of pH Scale. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents). 

Before reading this document, please read:
* [model.md](https://github.com/phetsims/ph-scale/blob/master/doc/model.md), a high-level description of the simulation model
 
## Core Model

All core model computations are in [PHModel.js](https://github.com/phetsims/ph-scale/blob/master/js/common/model/PHModel.js).

## Mixin Design Pattern

See [SolutionMixin.js](https://github.com/phetsims/ph-scale/blob/master/js/common/model/SolutionMixin.js) for details about
how the [mixin design pattern](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md#mixin-and-trait) is used.  It adds Properties related to concentration and quantity to solution classes. The solution model class hierachy has this structure:

```
class MacroSolution

class MicroSolution extends MacroSolution mixes SolutionMixin

class MySolution mixes SolutionMixin
```
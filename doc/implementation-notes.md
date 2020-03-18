# pH Scale - implementation notes

This document contains notes related to the implementation of pH Scale. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents). 

Before reading this document, please read:
* [model.md](https://github.com/phetsims/ph-scale/blob/master/doc/model.md), a high-level description of the simulation model
 
All core model computations are in [PHModel.js](https://github.com/phetsims/ph-scale/blob/master/js/common/model/PHModel.js).

## Mixin Design Pattern

See [SolutionMixin](https://github.com/phetsims/ph-scale/blob/master/js/common/model/SolutionMixin.js) for details about
how the mixin design pattern is used in this sim.  It adds Properties related to concentration and quantities to solution classes. The solution model class hierachy looks like this:

```
MacroModel
  MicroModel, mixes SolutionMixin
MySolution, mixes SolutionMixin
```

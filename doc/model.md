# pH Scale - model description

This document is a high-level description of the model used in PhET's _pH Scale_ simulation.

See [PHModel.js](https://github.com/phetsims/ph-scale/blob/master/js/common/model/PHModel.js) for implementation.

## Limits

* pH range = [-1,15]
* volume range = [0,1.2] L

## Definitions

* H<sub>2</sub>O = water
* H3O<sup>+</sup> = hydronium
* OH<sup>-</sup> = hydroxide
* A = Avogadro's number (6.023E23)
* V = volume in liters (L)
* N = number of molecules

## Computations

Given a volume of liquid with some pH...

Concentration of H3O = 10<sup>-pH</sup>.

Concentration of OH = 10<sup>-pOH</sup>, where pOH = 14 - pH.

Concentration of H2O = 55 / V

Number of molecules of H3O = 10<sup>-pHM</sup> * A * V

Number of molecules of OH = 10<sup>-pOH</sup> *A * V or 10<sup>pH-14</sup> * A * V

Number of molecules of H2O = 55 * A * V

If two volumes of liquid 1 & 2 are added, the new volume = V1 + V2

If combining 2 acids (or acid and water), pH = -log(((10^-pH1)*V1 + (10^-pH2)*V2) / (V1 + V2))

If combining 2 bases (or base and water), pH = 14 + log(((10^(pH1 - 14)*V1)+(10^(14-pH2)*V2)) / (V1 + V2))

If concentration of H30 is changed, volume is unchanged, and pH = -log(concentration of H3O)

If concentration of OH is changed, volume is unchanged, and pH = 14 - (-log(concentration of OH))

If #moles of H30 is changed, volume is unchanged, and pH = -log ((new #moles H30) / V)

If #moles of OH is changed,, volume is unchanged, and pH = 14 - (-log((new # moles OH) / V))

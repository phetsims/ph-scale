# pH Scale - model description

This document is a high-level description of the model used in PhET's _pH Scale_ simulation.

See [PHModel.js](https://github.com/phetsims/ph-scale/blob/master/js/common/model/PHModel.js) for implementation.

## Limits

* pH range = [-1,15]
* volume range = [0,1.2] L

## Definitions

* H<sub>2</sub>O = water
* H<sub>3</sub>O<sup>+</sup> = hydronium
* OH<sup>-</sup> = hydroxide
* A = Avogadro's number (6.023E23)
* V = volume in liters (L)
* N = number of molecules

## Computations

Given a volume of liquid with some pH...

Concentration of H<sub>3</sub>O<sup>+</sup> = 10<sup>-pH</sup>

Concentration of OH = 10<sup>pH-14</sup>

Concentration of H<sub>2</sub>O = 55 / V

Number of molecules of H<sub>3</sub>O<sup>+</sup> = 10<sup>-pH</sup> * A * V

Number of molecules of OH = 10<sup>pH-14</sup> * A * V

Number of molecules of H<sub>2</sub>O = 55 * A * V

If two volumes of liquid 1 & 2 are added, the total volume V<sub>T</sub> = V<sub>1</sub> + V<sub>2</sub>

If combining 2 acids (or acid and water), pH = -log(((10^-pH1)*V<sub>1</sub> + (10^-pH2)*V<sub>2</sub>) / (V<sub>1</sub> + V<sub>2</sub>))

If combining 2 bases (or base and water), pH = 14 + log(((10^(pH1 - 14)*V<sub>1</sub>)+(10^(14-pH2)*V<sub>2</sub>)) / (V<sub>1</sub> + V<sub>2</sub>))

If concentration of H<sub>3</sub>O<sup>+</sup> is changed, volume is unchanged, and pH = -log(concentration of H<sub>3</sub>O<sup>+</sup>)

If concentration of OH is changed, volume is unchanged, and pH = 14 - (-log(concentration of OH))

If #moles of H<sub>3</sub>O<sup>+</sup> is changed, volume is unchanged, and pH = -log ((new #moles H<sub>3</sub>O<sup>+</sup>) / V)

If #moles of OH is changed,, volume is unchanged, and pH = 14 - (-log((new # moles OH) / V))

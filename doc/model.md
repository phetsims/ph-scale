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
* V = volume

## Units

* Quantity: moles (mol)
* Volume: literes (L)
* Concentration: moles per liter (mol/L)

## Computations

Given a volume of liquid with some pH...

Concentration of hydronium is [H<sub>3</sub>O<sup>+</sup>] = 10<sup>-pH</sup>

Concentration of hydroxide is [OH] = 10<sup>pH-14</sup>

Concentration of water is [H<sub>2</sub>O] = 55

Number of moles of H<sub>3</sub>O<sup>+</sup> = [H<sub>3</sub>O<sup>+</sup>] * V

Number of moles of OH = [OH] * V

Number of moles of H<sub>2</sub>O = [H<sub>2</sub>O] * V

Number of molecules of H<sub>3</sub>O<sup>+</sup> = [H<sub>3</sub>O<sup>+</sup>] * V * A

Number of molecules of OH = [OH] * V * A

Number of molecules of H<sub>2</sub>O = [H<sub>2</sub>O] * V * A

If two volumes of liquid 1 & 2 are added, the total volume is V<sub>T</sub> = V<sub>1</sub> + V<sub>2</sub>

If combining 2 acids (or acid and water), then pH = -log( ( (10<sup>-pH<sub>1</sub></sup> * V<sub>1</sub> ) + ( 10<sup>-pH<sub>2</sub></sup> * V<sub>2</sub>) ) / V<sub>T</sub>)

If combining 2 bases (or base and water), then pH = 14 + log( ( (10<sup>pH<sub>1</sub>-14</sup> * V<sub>1</sub> ) + ( 10<sup>14-pH<sub>2</sub></sup> *V <sub>2</sub> ) ) / V<sub>T</sub> )

If concentration of H<sub>3</sub>O<sup>+</sup> is changed, then pH = -log( [H<sub>3</sub>O<sup>+</sup>] )

If concentration of OH is changed, then pH = 14 + log( [OH] )

If #moles of H<sub>3</sub>O<sup>+</sup> is changed, then pH = -log( (#moles H<sub>3</sub>O<sup>+</sup>) / V<sub>T</sub> )

If #moles of OH is changed,, then pH = 14 + log( (#moles OH) / V<sub>T</sub>))

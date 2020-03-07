// Copyright 2013-2020, University of Colorado Boulder

/**
 * Water, the solvent in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import phScaleStrings from '../../ph-scale-strings.js';
import phScale from '../../phScale.js';
import PHScaleColors from '../PHScaleColors.js';

const choiceWaterString = phScaleStrings.choice.water;

const Water = Object.freeze( {
  name: choiceWaterString,
  pH: 7,
  concentration: 55, // mol/L
  color: PHScaleColors.WATER
} );

phScale.register( 'Water', Water );
export default Water;
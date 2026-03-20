// Copyright 2013-2026, University of Colorado Boulder

/**
 * Water, the solvent in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhScaleStrings from '../../PhScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';

const Water = Object.freeze( {
  nameProperty: PhScaleStrings.choice.waterStringProperty,
  pH: 7,
  concentration: 55, // mol/L
  color: PHScaleColors.WATER
} );

export default Water;

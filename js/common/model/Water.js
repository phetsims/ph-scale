// Copyright 2013-2015, University of Colorado Boulder

/**
 * Water, the solvent in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );

  // strings
  const choiceWaterString = require( 'string!PH_SCALE/choice.water' );

  const Water = Object.freeze( {
    name: choiceWaterString,
    pH: 7,
    color: PHScaleColors.WATER
  } );

  phScale.register( 'Water', Water );

  return Water;
} );

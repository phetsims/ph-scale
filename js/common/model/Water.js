// Copyright 2013-2015, University of Colorado Boulder

/**
 * Water, the solvent in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var phScale = require( 'PH_SCALE/phScale' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );

  // strings
  var choiceWaterString = require( 'string!PH_SCALE/choice.water' );

  var Water = Object.freeze( {
    name: choiceWaterString,
    pH: 7,
    color: PHScaleColors.WATER
  } );

  phScale.register( 'Water', Water );

  return Water;
} );

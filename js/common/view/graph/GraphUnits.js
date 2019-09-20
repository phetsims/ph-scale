// Copyright 2013-2019, University of Colorado Boulder

/**
 * Units used on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  const phScale = require( 'PH_SCALE/phScale' );

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  const GraphUnits = Object.freeze( {
    MOLES_PER_LITER: 'molesPerLiter',
    MOLES: 'moles'
  } );

  phScale.register( 'GraphUnits', GraphUnits );

  return GraphUnits;
} );
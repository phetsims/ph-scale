// Copyright 2013-2020, University of Colorado Boulder

/**
 * Type of graph (log or linear).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const phScale = require( 'PH_SCALE/phScale' );

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  const GraphScale = Object.freeze( {
    LOGARITHMIC: 'logarithmic',
    LINEAR: 'linear'
  } );

  return phScale.register( 'GraphScale', GraphScale );
} );
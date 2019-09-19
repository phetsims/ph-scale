// Copyright 2013-2015, University of Colorado Boulder

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
  var GraphScale = Object.freeze( {
    LOGARITHMIC: 'logarithmic',
    LINEAR: 'linear'
  } );

  phScale.register( 'GraphScale', GraphScale );

  return GraphScale;
} );
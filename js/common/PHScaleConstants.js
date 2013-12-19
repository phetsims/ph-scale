// Copyright 2002-2013, University of Colorado Boulder

/**
 * Constants used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var Range = require( 'DOT/Range' );

  return {

    // ScreenView
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1100, 700 ),

    // pH
    PH_RANGE: new Range( -1, 15, 7 ),
    PH_METER_DECIMAL_PLACES: 2,
    PH_COMBO_BOX_DECIMAL_PLACES: 1,

    // volume
    VOLUME_DECIMAL_PLACES: 2,
    MIN_SOLUTION_VOLUME: 0.015,  // L, minimum non-zero volume for solution, so it's visible and measurable

    // concentration
    CONCENTRATION_EXPONENT_RANGE: new Range( -16, 2 )
  };
} );

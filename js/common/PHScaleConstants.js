// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Range = require( 'DOT/Range' );

  return {
    // pH
    PH_RANGE: new Range( -1, 15, 7 ),
    PH_METER_DECIMAL_PLACES: 2,
    PH_COMBO_BOX_DECIMAL_PLACES: 1,

    // beaker
    BEAKER_VOLUME: 1.2, // L
    VOLUME_DECIMAL_PLACES: 2,
    MIN_SOLUTION_VOLUME: 0.015,  // L, minimum non-zero volume for solution, so it's visible and measurable

    // faucets
    SPOUT_WIDTH: 45, // pixels, dependent on image file
    MAX_SOLVENT_FLOW_RATE: 0.25, // L/sec
    MAX_DRAIN_FLOW_RATE: 0.25, // L/sec

    // dropper
    DROPPER_FLOW_RATE: 0.05 // L/sec
  };
} );

// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Range = require( 'DOT/Range' );

  return {
    PH_RANGE: new Range( -1, 15, 7 ),
    BEAKER_VOLUME: 1.2, // L
    VOLUME_DECIMAL_PLACES: 2,
    PH_METER_DECIMAL_PLACES: 2,
    PH_COMBOBOX_DECIMAL_PLACES: 1,
    MIN_SOLUTION_VOLUME: 0.015  // L, minimum non-zero volume for solution, so it's visible and measurable
  };
} );

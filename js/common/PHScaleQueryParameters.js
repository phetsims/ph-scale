// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var phScale = require( 'PH_SCALE/phScale' );

  var PHScaleQueryParameters = QueryStringMachine.getAll( {

    // enables developer-only features
    dev: { type: 'flag' }
  } );

  phScale.register( 'PHScaleQueryParameters', PHScaleQueryParameters );

  return PHScaleQueryParameters;
} );

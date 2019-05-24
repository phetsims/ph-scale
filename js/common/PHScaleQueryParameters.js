// Copyright 2016-2017, University of Colorado Boulder

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

    // shows the ratio (molecule counts) in the bottom of the beaker for the 'ratio' view
    showRatio: { type: 'flag' }
  } );

  phScale.register( 'PHScaleQueryParameters', PHScaleQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( PHScaleQueryParameters, null, 2 ) );

  return PHScaleQueryParameters;
} );
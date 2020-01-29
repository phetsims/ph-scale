// Copyright 2013-2020, University of Colorado Boulder

/**
 * Type of graph (log or linear).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const phScale = require( 'PH_SCALE/phScale' );

  const GraphScale = Enumeration.byKeys( [ 'LOGARITHMIC', 'LINEAR' ] );

  return phScale.register( 'GraphScale', GraphScale );
} );
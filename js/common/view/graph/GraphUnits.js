// Copyright 2013-2020, University of Colorado Boulder

/**
 * Units used on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const phScale = require( 'PH_SCALE/phScale' );

  const GraphUnits = Enumeration.byKeys( [ 'MOLES_PER_LITER', 'MOLES' ] );

  return phScale.register( 'GraphUnits', GraphUnits );
} );
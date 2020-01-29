// Copyright 2013-2020, University of Colorado Boulder

/**
 * Oxygen atom.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  class OxygenNode extends ShadedSphereNode {

    constructor() {
      super( 30, {
        mainColor: PHScaleColors.OXYGEN,
        highlightColor: new Color( 255, 255, 255 )
      } );
    }
  }

  return phScale.register( 'OxygenNode', OxygenNode );
} );

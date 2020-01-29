// Copyright 2013-2020, University of Colorado Boulder

/**
 * Hydrogen atom.
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

  class HydrogenNode extends ShadedSphereNode {

    constructor() {
      super( 15, {
        mainColor: PHScaleColors.HYDROGEN,
        highlightColor: new Color( 255, 255, 255 )
      } );
    }
  }

  return phScale.register( 'HydrogenNode', HydrogenNode );
} );

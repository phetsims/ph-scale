// Copyright 2013-2019, University of Colorado Boulder

/**
 * Hydrogen atom.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @constructor
   */
  function HydrogenNode() {
    ShadedSphereNode.call( this, 15, {
      mainColor: PHScaleColors.HYDROGEN,
      highlightColor: new Color( 255, 255, 255 )
    } );
  }

  phScale.register( 'HydrogenNode', HydrogenNode );

  return inherit( ShadedSphereNode, HydrogenNode );
} );

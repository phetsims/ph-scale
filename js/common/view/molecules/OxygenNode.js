// Copyright 2013-2019, University of Colorado Boulder

/**
 * Oxygen atom.
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
  function OxygenNode() {
    ShadedSphereNode.call( this, 30, {
      mainColor: PHScaleColors.OXYGEN,
      highlightColor: new Color( 255, 255, 255 )
    } );
  }

  phScale.register( 'OxygenNode', OxygenNode );

  return inherit( ShadedSphereNode, OxygenNode );
} );

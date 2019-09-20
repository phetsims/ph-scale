// Copyright 2013-2019, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Faucet} faucet
   * @param {Property.<Color>} colorProperty
   * @param {number} height in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function FaucetFluidNode( faucet, colorProperty, height, modelViewTransform ) {

    const self = this;
    Rectangle.call( this, 0, 0, 0, 0, { lineWidth: 1, pickable: false } );

    // Set the color of the fluid coming out of the spout.
    colorProperty.link( function( color ) {
      self.fill = color;
      self.stroke = color.darkerColor();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {number} flowRate
     */
    const viewLocation = modelViewTransform.modelToViewPosition( faucet.location );
    const viewHeight = modelViewTransform.modelToViewDeltaY( height );
    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        self.setRect( -1, -1, 0, 0 ); // empty rectangle, at a location where we won't intersect with it
      }
      else {
        const viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        self.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y, viewWidth, viewHeight );
      }
    } );
  }

  phScale.register( 'FaucetFluidNode', FaucetFluidNode );

  return inherit( Rectangle, FaucetFluidNode );
} );

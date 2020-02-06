// Copyright 2013-2020, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class FaucetFluidNode extends Rectangle {

    /**
     * @param {Faucet} faucet
     * @param {Property.<Color>} colorProperty
     * @param {number} height in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( faucet, colorProperty, height, modelViewTransform, options ) {

      options = merge( {

        lineWidth: 1,
        pickable: false
      }, options );

      super( 0, 0, 0, 0, options );

      // Set the color of the fluid coming out of the spout.
      colorProperty.link( color => {
        this.fill = color;
        this.stroke = color.darkerColor();
      } );

      /*
       * Set the width of the shape to match the flow rate.
       * @param {number} flowRate
       */
      const viewPosition = modelViewTransform.modelToViewPosition( faucet.position );
      const viewHeight = modelViewTransform.modelToViewDeltaY( height );
      faucet.flowRateProperty.link( flowRate => {
        if ( flowRate === 0 ) {
          this.setRect( -1, -1, 0, 0 ); // empty rectangle, at a position where we won't intersect with it
        }
        else {
          const viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
          this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y, viewWidth, viewHeight );
        }
      } );
    }
  }

  return phScale.register( 'FaucetFluidNode', FaucetFluidNode );
} );

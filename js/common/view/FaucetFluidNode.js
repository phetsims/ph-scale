// Copyright 2013-2015, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var phScale = require( 'PH_SCALE/phScale' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Faucet} faucet
   * @param {Property.<Color>} colorProperty
   * @param {number} height in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function FaucetFluidNode( faucet, colorProperty, height, modelViewTransform ) {

    var self = this;
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
    var viewLocation = modelViewTransform.modelToViewPosition( faucet.location );
    var viewHeight = modelViewTransform.modelToViewDeltaY( height );
    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        self.setRect( -1, -1, 0, 0 ); // empty rectangle, at a location where we won't intersect with it
      }
      else {
        var viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        self.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y, viewWidth, viewHeight );
      }
    } );
  }

  phScale.register( 'FaucetFluidNode', FaucetFluidNode );

  return inherit( Rectangle, FaucetFluidNode );
} );

// Copyright 2002-2014, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Faucet} faucet
   * @param {Property<Color>} colorProperty
   * @param {Number} height in model coordinates
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetFluidNode( faucet, colorProperty, height, mvt ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1, pickable: false } );

    // Set the color of the fluid coming out of the spout.
    colorProperty.link( function( color ) {
      thisNode.fill = color;
      thisNode.stroke = color.darkerColor();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {Number} flowRate
     */
    var viewLocation = mvt.modelToViewPosition( faucet.location );
    var viewHeight = mvt.modelToViewDeltaY( height );
    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        thisNode.setRect( 0, 0, 0, 0 ); // empty rectangle
      }
      else {
        var viewWidth = mvt.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        thisNode.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y, viewWidth, viewHeight );
      }
    } );
  }

  return inherit( Rectangle, FaucetFluidNode );
} );

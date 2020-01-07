// Copyright 2013-2019, University of Colorado Boulder

/**
 * Fluid (stock solution) coming out of the dropper.
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
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {number} tipWidth
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DropperFluidNode( dropper, beaker, tipWidth, modelViewTransform ) {

    const self = this;
    Rectangle.call( this, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and position
    const updateShapeAndPosition = function() {
      // path
      if ( dropper.flowRateProperty.get() > 0 ) {
        self.setRect( -tipWidth / 2, 0, tipWidth, beaker.position.y - dropper.positionProperty.get().y );
      }
      else {
        self.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's position
      self.translation = modelViewTransform.modelToViewPosition( dropper.positionProperty.get() );
    };
    dropper.positionProperty.link( updateShapeAndPosition );
    dropper.flowRateProperty.link( updateShapeAndPosition );

    // set color to match solute
    dropper.soluteProperty.link( function( solute ) {
      self.fill = solute.stockColor;
      self.stroke = solute.stockColor.darkerColor();
    } );

    // hide this node when the dropper is invisible
    dropper.visibleProperty.link( function( visible ) {
      self.setVisible( visible );
    } );
  }

  phScale.register( 'DropperFluidNode', DropperFluidNode );

  return inherit( Rectangle, DropperFluidNode );
} );
// Copyright 2013-2016, University of Colorado Boulder

/**
 * Fluid (stock solution) coming out of the dropper.
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
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {number} tipWidth
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DropperFluidNode( dropper, beaker, tipWidth, modelViewTransform ) {

    var self = this;
    Rectangle.call( this, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and location
    var updateShapeAndLocation = function() {
      // path
      if ( dropper.flowRateProperty.get() > 0 ) {
        self.setRect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.locationProperty.get().y );
      }
      else {
        self.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's location
      self.translation = modelViewTransform.modelToViewPosition( dropper.locationProperty.get() );
    };
    dropper.locationProperty.link( updateShapeAndLocation );
    dropper.flowRateProperty.link( updateShapeAndLocation );

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
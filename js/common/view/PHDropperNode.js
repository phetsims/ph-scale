// Copyright 2013-2015, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var phScale = require( 'PH_SCALE/phScale' );

  /**
   * @param {Dropper} dropper
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function PHDropperNode( dropper, modelViewTransform, options ) {

    var self = this;

    EyeDropperNode.call( this, _.extend( {
      dispensingProperty: dropper.dispensingProperty,
      enabledProperty: dropper.enabledProperty,
      emptyProperty: dropper.emptyProperty
    }, options ) );

    // location
    dropper.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // visibility
    dropper.visibleProperty.link( function( visible ) {
      self.visible = visible;
      if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
    } );

    // change fluid color when the solute changes
    dropper.soluteProperty.link( function( solute ) {
      self.fluidColor = solute.stockColor;
    } );

    // dilate touch area
    this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

    // move the dropper
    this.addInputListener( new MovableDragHandler( dropper.locationProperty, {
      dragBounds: dropper.dragBounds,
      modelViewTransform: modelViewTransform
    } ) );
  }

  phScale.register( 'PHDropperNode', PHDropperNode );

  return inherit( EyeDropperNode, PHDropperNode );
} );

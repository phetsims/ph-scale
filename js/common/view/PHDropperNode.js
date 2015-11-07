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

  /**
   * @param {Dropper} dropper
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function PHDropperNode( dropper, modelViewTransform, options ) {

    var thisNode = this;

    EyeDropperNode.call( thisNode, _.extend( {
      dispensingProperty: dropper.dispensingProperty,
      enabledProperty: dropper.enabledProperty,
      emptyProperty: dropper.emptyProperty
    }, options ) );

    // location
    dropper.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // visibility
    dropper.visibleProperty.link( function( visible ) {
      thisNode.visible = visible;
      if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
    } );

    // change fluid color when the solute changes
    dropper.soluteProperty.link( function( solute ) {
      thisNode.fluidColor = solute.stockColor;
    } );

    // dilate touch area
    thisNode.touchArea = thisNode.localBounds.dilatedX( 0.25 * thisNode.width );

    // move the dropper
    thisNode.addInputListener( new MovableDragHandler( dropper.locationProperty, {
      dragBounds: dropper.dragBounds,
      modelViewTransform: modelViewTransform
    } ) );
  }

  return inherit( EyeDropperNode, PHDropperNode );
} );

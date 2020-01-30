// Copyright 2013-2020, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  const merge = require( 'PHET_CORE/merge' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PHDropperNode extends EyeDropperNode {

    /**
     * @param {Dropper} dropper
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( dropper, modelViewTransform, options ) {

      super( merge( {
        dispensingProperty: dropper.dispensingProperty,
        enabledProperty: dropper.enabledProperty,
        emptyProperty: dropper.emptyProperty,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options ) );

      // position
      dropper.positionProperty.link( position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

      // visibility
      dropper.visibleProperty.link( visible => {
        this.visible = visible;
        if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
      } );

      // change fluid color when the solute changes
      dropper.soluteProperty.link( solute => {
        this.fluidColor = solute.stockColor;
      } );

      // dilate touch area
      this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

      // move the dropper
      this.addInputListener( new MovableDragHandler( dropper.positionProperty, {
        dragBounds: dropper.dragBounds,
        modelViewTransform: modelViewTransform,
        tandem: options.tandem.createTandem( 'dragHandler' )
      } ) );
    }
  }

  return phScale.register( 'PHDropperNode', PHDropperNode );
} );

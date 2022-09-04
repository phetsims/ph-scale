// Copyright 2013-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';

class PHDropperNode extends EyeDropperNode {

  /**
   * @param {Dropper} dropper
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( dropper, modelViewTransform, options ) {

    super( merge( {

      // EyeDropperNode options
      isDispensingProperty: dropper.isDispensingProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty
      },

      cursor: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options ) );

    // position
    dropper.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // change fluid color when the solute changes
    dropper.soluteProperty.link( solute => {
      this.setFluidColor( solute.stockColor );
    } );

    // dilate touch area
    this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

    // move the dropper
    this.addInputListener( new DragListener( {
      useInputListenerCursor: true,
      positionProperty: dropper.positionProperty,
      dragBoundsProperty: new Property( dropper.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' ),
      phetioEnabledPropertyInstrumented: true
    } ) );
  }
}

phScale.register( 'PHDropperNode', PHDropperNode );
export default PHDropperNode;
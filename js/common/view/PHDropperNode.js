// Copyright 2013-2020, University of Colorado Boulder

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
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
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
      dispensingProperty: dropper.dispensingProperty,
      buttonEnabledProperty: dropper.enabledProperty,

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true } // see https://github.com/phetsims/ph-scale/issues/178
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
      positionProperty: dropper.positionProperty,
      dragBoundsProperty: new Property( dropper.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );
  }
}

phScale.register( 'PHDropperNode', PHDropperNode );
export default PHDropperNode;
// Copyright 2013-2021, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeDropperNode, { EyeDropperNodeOptions } from '../../../../scenery-phet/js/EyeDropperNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';
import Dropper from '../model/Dropper.js';

type SelfOptions = EmptySelfOptions;

export type PHDropperNodeOptions = SelfOptions & PickRequired<EyeDropperNodeOptions, 'tandem'>;

export default class PHDropperNode extends EyeDropperNode {

  public constructor( dropper: Dropper, modelViewTransform: ModelViewTransform2, providedOptions: PHDropperNodeOptions ) {

    const options = optionize<PHDropperNodeOptions, SelfOptions, EyeDropperNodeOptions>()( {

      // EyeDropperNodeOptions
      isDispensingProperty: dropper.isDispensingProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty
      },
      cursor: null
    }, providedOptions );

    super( options );

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
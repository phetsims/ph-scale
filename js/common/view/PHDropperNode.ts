// Copyright 2013-2022, University of Colorado Boulder

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
import { DragListener, KeyboardDragListener, KeyboardDragListenerOptions, KeyboardUtils } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';
import Dropper from '../model/Dropper.js';

type SelfOptions = EmptySelfOptions;

type PHDropperNodeOptions = SelfOptions & PickRequired<EyeDropperNodeOptions, 'tandem' | 'visibleProperty'>;

export default class PHDropperNode extends EyeDropperNode {

  public constructor( dropper: Dropper, modelViewTransform: ModelViewTransform2, providedOptions: PHDropperNodeOptions ) {

    const options = optionize<PHDropperNodeOptions, SelfOptions, EyeDropperNodeOptions>()( {

      // EyeDropperNodeOptions
      isDispensingProperty: dropper.isDispensingProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty
      },
      cursor: null,
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true
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
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.addInputListener( new PHDropperKeyboardDragListener( {
      dragVelocity: 300, // velocity of the Node being dragged, in view coordinates per second
      shiftDragVelocity: 20, // velocity with the Shift key pressed, typically slower than dragVelocity
      positionProperty: dropper.positionProperty,
      dragBoundsProperty: new Property( dropper.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } ) );
  }
}

//TODO https://github.com/phetsims/ph-scale/issues/249 delete this class, replace overrides with KeyboardDragListener options
class PHDropperKeyboardDragListener extends KeyboardDragListener {

  public constructor( providedOptions?: KeyboardDragListenerOptions ) {
    super( providedOptions );
  }

  // Dragging is constrained to up/down, but we want the left/right arrows to do something.
  // For now, override these methods.  Eventually, this will be supported by KeyboardDragListener.
  // See https://github.com/phetsims/scenery/issues/1460

  public override leftMovementKeysDown(): boolean {
    return this.keyInListDown( [
      KeyboardUtils.KEY_LEFT_ARROW, KeyboardUtils.KEY_DOWN_ARROW,
      KeyboardUtils.KEY_A, KeyboardUtils.KEY_S
    ] );
  }

  public override rightMovementKeysDown(): boolean {
    return this.keyInListDown( [
      KeyboardUtils.KEY_RIGHT_ARROW, KeyboardUtils.KEY_UP_ARROW,
      KeyboardUtils.KEY_W, KeyboardUtils.KEY_D
    ] );
  }

  public override upMovementKeysDown(): boolean {
    return false;
  }

  public override downMovementKeysDown(): boolean {
    return false;
  }
}

phScale.register( 'PHDropperNode', PHDropperNode );
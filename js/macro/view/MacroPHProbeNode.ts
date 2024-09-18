// Copyright 2024, University of Colorado Boulder

/**
 * MacroPHProbeNode is the probe for the pH meter in the Macro screen. The origin is at the center of crosshairs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { DragListener, InteractiveHighlighting, KeyboardDragListener, Node } from '../../../../scenery/js/imports.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import PHMovable from '../../common/model/PHMovable.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import phScale from '../../phScale.js';
import PHScaleQueryParameters from '../../common/PHScaleQueryParameters.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/grab-drag/GrabDragInteraction.js';
import WASDCueNode from '../../../../scenery-phet/js/accessibility/nodes/WASDCueNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type MacroPHProbeNodeOptions = SelfOptions & PickRequired<ProbeNodeOptions, 'tandem'>;

export class MacroPHProbeNode extends InteractiveHighlighting( Node ) {

  public readonly isInSolution: () => boolean;
  public readonly isInWater: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInDropperSolution: () => boolean;

  private readonly grabDragInteraction?: GrabDragInteraction;

  public constructor( probe: PHMovable, modelViewTransform: ModelViewTransform2, solutionNode: Node,
                      dropperFluidNode: Node, waterFluidNode: Node, drainFluidNode: Node,
                      providedOptions: MacroPHProbeNodeOptions ) {

    //TODO https://github.com/phetsims/ph-scale/issues/292 GrabDragInteraction is very buggy for any Node whose
    // matrix is rotated, like our ProbeNode. The grabCueNode and dragCueNode will both be positioned incorrectly.
    // Work around that problem by using composition instead of inheritance for the pH probe.
    const probeNode = new ProbeNode( {
      rotation: Math.PI / 2,
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 0.85 * Math.PI,
      color: 'rgb( 35, 129, 0 )'
    } );

    const options = optionize<MacroPHProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
      children: [ probeNode ],
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      visiblePropertyOptions: {
        phetioReadOnly: true
      },
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.touchArea = this.localBounds.dilated( 20 );

    const dragBoundsProperty = new Property( probe.dragBounds );

    this.addInputListener( new DragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    const keyboardDragListener = new KeyboardDragListener( {
      dragSpeed: 300, // drag speed, in view coordinates per second
      shiftDragSpeed: 20, // slower drag speed
      positionProperty: probe.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
    } );

    //TODO https://github.com/phetsims/ph-scale/issues/292 Keep one of these interaction patterns, delete the other.
    if ( PHScaleQueryParameters.grabDragProbe ) {

      const dragCueNode = new WASDCueNode( this.boundsProperty );

      const grabDragInteraction = new GrabDragInteraction( this, keyboardDragListener, {
        dragCueNode: dragCueNode,
        tandem: Tandem.OPT_OUT //TODO https://github.com/phetsims/ph-scale/issues/292 Add tandem when GrabDragInteraction is no longer created conditionally.
      } );
      this.grabDragInteraction = grabDragInteraction;

      //TODO https://github.com/phetsims/ph-scale/issues/292 Move this into GrabDragInteraction?
      keyboardDragListener.isPressedProperty.lazyLink( isPressed => {
        if ( isPressed ) {
          grabDragInteraction.grabDragModel.grabDragUsageTracker.shouldShowDragCue = false;
        }
      } );

      //TODO https://github.com/phetsims/ph-scale/issues/292 This should be unnecessary if matrix stuff is fixed in GrabDragInteraction.
      this.boundsProperty.link( () => {
        grabDragInteraction.grabCueNode.centerTop = probeNode.centerBottom.plusXY( 0, 6 );
        dragCueNode.center = probeNode.center;
      } );
    }
    else {
      this.addInputListener( keyboardDragListener );
    }

    const isInNode = ( node: Node ) => node.getBounds().containsPoint( probe.positionProperty.value );
    this.isInSolution = () => isInNode( solutionNode );
    this.isInWater = () => isInNode( waterFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInDropperSolution = () => isInNode( dropperFluidNode );
  }

  public reset(): void {
    this.grabDragInteraction && this.grabDragInteraction.reset();
  }
}

phScale.register( 'MacroPHProbeNode', MacroPHProbeNode );
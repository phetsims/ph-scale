// Copyright 2024-2025, University of Colorado Boulder

/**
 * MacroPHProbeNode is the probe for the pH meter in the Macro screen. The origin is at the center of crosshairs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/grab-drag/GrabDragInteraction.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PHMovable from '../../common/model/PHMovable.js';
import phScale from '../../phScale.js';
import PHScaleColors from '../../common/PHScaleColors.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';

type SelfOptions = EmptySelfOptions;
type MacroPHProbeNodeOptions = SelfOptions & PickRequired<ProbeNodeOptions, 'tandem'>;

export class MacroPHProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public readonly isInSolution: () => boolean;
  public readonly isInWater: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInDropperSolution: () => boolean;

  private readonly grabDragInteraction?: GrabDragInteraction;

  public constructor( probe: PHMovable, modelViewTransform: ModelViewTransform2, solutionNode: Node,
                      dropperFluidNode: Node, waterFluidNode: Node, drainFluidNode: Node,
                      providedOptions: MacroPHProbeNodeOptions ) {

    const options = optionize<MacroPHProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
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
      color: PHScaleColors.pHProbeColorProperty,
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

    this.addInputListener( new SoundRichDragListener( {
      keyboardDragListenerOptions: {
        dragSpeed: 300, // drag speed, in view coordinates per second
        shiftDragSpeed: 20 // slower drag speed
      },
      positionProperty: probe.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

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
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

type SelfOptions = EmptySelfOptions;
type MacroPHProbeNodeOptions = SelfOptions & PickRequired<ProbeNodeOptions, 'tandem'>;

export class MacroPHProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public readonly isInSolution: () => boolean;
  public readonly isInWater: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInDropperSolution: () => boolean;

  public constructor( probe: PHMovable, modelViewTransform: ModelViewTransform2, solutionNode: Node,
                      dropperFluidNode: Node, waterFluidNode: Node, drainFluidNode: Node,
                      providedOptions: MacroPHProbeNodeOptions ) {

    const options = optionize<MacroPHProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 0.85 * Math.PI,
      color: 'rgb( 35, 129, 0 )',
      rotation: Math.PI / 2,
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      visiblePropertyOptions: {
        phetioReadOnly: true
      },
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    // probe position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // touch area
    this.touchArea = this.localBounds.dilated( 20 );

    const dragBoundsProperty = new Property( probe.dragBounds );

    // drag listener
    this.addInputListener( new DragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.addInputListener( new KeyboardDragListener( {
      dragSpeed: 300, // drag speed, in view coordinates per second
      shiftDragSpeed: 20, // slower drag speed
      positionProperty: probe.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
    } ) );

    const isInNode = ( node: Node ) => node.getBounds().containsPoint( probe.positionProperty.value );
    this.isInSolution = () => isInNode( solutionNode );
    this.isInWater = () => isInNode( waterFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInDropperSolution = () => isInNode( dropperFluidNode );
  }
}

phScale.register( 'MacroPHProbeNode', MacroPHProbeNode );
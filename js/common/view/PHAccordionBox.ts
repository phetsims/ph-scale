// Copyright 2014-2025, University of Colorado Boulder

/**
 * PHAccordionBox is the base class for the pH meter in the 'Micro' and 'My Solution' screens.
 * - Origin is at top left.
 * - Can be expanded and collapsed.
 * - Has a probe that extends down into the solution.
 * - Subclass is responsible for how the pH value is displayed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// constants
const Y_MARGIN = 10;

type SelfOptions = {

  probeCenterXRatio?: number; // centerX of the probe, relative to the accordion box where 0 is the left edge and 1 is the right edge.
  accordionBoxOptions: PickRequired<AccordionBoxOptions, 'tandem'>;
};
type PHAccordionBoxOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;
export default class PHAccordionBox extends Node {

  protected readonly accordionBox: AccordionBox;
  private readonly expandedProperty: Property<boolean>;

  protected static readonly CORNER_RADIUS = 8;

  /**
   * @param contentNode - Node that displays the pH value
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param providedOptions - options for the Node and associated AccordionBox
   */
  protected constructor( contentNode: Node, probeYOffset: number, providedOptions: PHAccordionBoxOptions ) {

    const expandedProperty = new BooleanProperty( true, {
      tandem: providedOptions.accordionBoxOptions.tandem.createTandem( 'expandedProperty' ),
      phetioFeatured: true
    } );

    const accordionBoxOptions = combineOptions<AccordionBoxOptions>( {
      fill: PHScaleColors.panelFillProperty,
      lineWidth: 2,
      cornerRadius: PHAccordionBox.CORNER_RADIUS,
      contentYSpacing: 10,
      titleAlignX: 'left',
      titleXMargin: 15,
      titleNode: new Text( PhScaleStrings.pHStringProperty, {
        fill: 'black',
        font: new PhetFont( { size: 28, weight: 'bold' } ),
        maxWidth: 50
      } ),
      buttonAlign: 'right',
      buttonXMargin: 14,
      buttonYMargin: Y_MARGIN,
      expandCollapseButtonOptions: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS,
      contentYMargin: Y_MARGIN,
      expandedProperty: expandedProperty,
      accessibleName: PhScaleStrings.a11y.pHMeter.headingStringProperty
    }, providedOptions.accordionBoxOptions );

    // This class was rewritten to use AccordionBox via composition instead of inheritance. The class was not renamed
    // because we did not want to change the PhET-iO API by having to rename 'pHAccordionBox' elements.
    // See https://github.com/phetsims/sun/issues/860
    const accordionBox = new AccordionBox( contentNode, accordionBoxOptions );

    const options = optionize<PHAccordionBoxOptions, SelfOptions, NodeOptions>()( {
      probeCenterXRatio: 0.75
    }, providedOptions );

    const probeNode = new ProbeNode( probeYOffset, {
      visibleProperty: expandedProperty,
      centerX: accordionBox.left + ( options.probeCenterXRatio * accordionBox.width ),
      top: accordionBox.top
    } );

    options.children = [ probeNode, accordionBox ];
    super( options );

    this.accordionBox = accordionBox;
    this.expandedProperty = expandedProperty;
  }

  public reset(): void {
    this.expandedProperty.reset();
  }
}

/**
 * Probe that extends out the bottom of the meter.
 */
type ProbeNodeSelfOptions = EmptySelfOptions;
type ProbeNodeOptions = ProbeNodeSelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'visibleProperty'>;

class ProbeNode extends Node {

  public constructor( probeHeight: number, providedOptions?: ProbeNodeOptions ) {

    const PROBE_WIDTH = 20;
    const TIP_HEIGHT = 50;
    const TIP_CORNER_RADIUS = 4;
    const OVERLAP = 10;

    const shaftWidth = 0.5 * PROBE_WIDTH;
    const shaftHeight = probeHeight - TIP_HEIGHT + OVERLAP;
    const shaftNode = new Rectangle( 0, 0, shaftWidth, shaftHeight, {
      fill: new LinearGradient( 0, 0, shaftWidth, 0 )
        .addColorStop( 0, 'rgb( 150, 150, 150 )' )
        .addColorStop( 0.35, 'rgb( 220, 220, 220 )' )
        .addColorStop( 1, 'rgb( 120, 120, 120 )' )
    } );

    // clockwise from tip of probe
    const tipNode = new Path( new Shape()
      .moveTo( PROBE_WIDTH / 2, TIP_HEIGHT )
      .lineTo( 0, 0.6 * TIP_HEIGHT )
      .lineTo( 0, TIP_CORNER_RADIUS )
      .arc( TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, Math.PI, 1.5 * Math.PI )
      .lineTo( TIP_CORNER_RADIUS, 0 )
      .lineTo( PROBE_WIDTH - TIP_CORNER_RADIUS, 0 )
      .arc( PROBE_WIDTH - TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, -0.5 * Math.PI, 0 )
      .lineTo( PROBE_WIDTH, 0.6 * TIP_HEIGHT )
      .close(), {
      fill: 'black',
      centerX: shaftNode.centerX,
      top: shaftNode.bottom - OVERLAP
    } );

    const options = optionize<ProbeNodeOptions, ProbeNodeSelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ shaftNode, tipNode ]
    }, providedOptions );

    super( options );
  }
}

phScale.register( 'PHAccordionBox', PHAccordionBox );
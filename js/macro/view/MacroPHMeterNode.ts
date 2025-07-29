// Copyright 2013-2025, University of Colorado Boulder

/**
 * pH meter for the 'Macro' screen.
 *
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * - solution in the beaker
 * - output of the water faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import Dropper from '../../common/model/Dropper.js';
import { PHValue } from '../../common/model/PHModel.js';
import PHMovable from '../../common/model/PHMovable.js';
import Solution from '../../common/model/Solution.js';
import Water from '../../common/model/Water.js';
import PHScaleColors from '../../common/PHScaleColors.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import MacroPHMeter from '../model/MacroPHMeter.js';
import { MacroPHProbeNode } from './MacroPHProbeNode.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { linear } from '../../../../dot/js/util/linear.js';
import JumpPosition from '../model/JumpPosition.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const BACKGROUND_ENABLED_FILL_PROPERTY = PHScaleColors.pHProbeColorProperty;
const BACKGROUND_DISABLED_FILL_PROPERTY = PHScaleColors.pHMeterDisabledColorProperty;
const SCALE_SIZE = new Dimension2( 55, 450 );
const SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
const TICK_LENGTH = 15;
const TICK_FONT = new PhetFont( 22 );
const NEUTRAL_TICK_LENGTH = 40;
const TICK_LABEL_X_SPACING = 5;
const CORNER_RADIUS = 12;

type SelfOptions = EmptySelfOptions;

type MacroPHMeterNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class MacroPHMeterNode extends Node {

  private readonly probeNode: MacroPHProbeNode;

  public constructor( meter: MacroPHMeter,
                      solution: Solution,
                      dropper: Dropper,
                      solutionNode: Node,
                      dropperFluidNode: Node,
                      waterFluidNode: Node,
                      drainFluidNode: Node,
                      modelViewTransform: ModelViewTransform2,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number>,
                      providedOptions: MacroPHMeterNodeOptions ) {

    const options = providedOptions;

    super( options );

    // the vertical scale, positioned at the meter 'body' position
    const scaleNode = new ScaleNode( {
      size: SCALE_SIZE,
      accessibleParagraph: PhScaleStrings.a11y.pHMeter.descriptionStringProperty
    } );
    scaleNode.translation = modelViewTransform.modelToViewPosition( meter.bodyPosition );

    // indicator that slides vertically along scale
    const pHIndicatorNode = new PHIndicatorNode( meter.pHProperty, SCALE_SIZE.width, {
      tandem: options.tandem.createTandem( 'pHIndicatorNode' )
    } );
    pHIndicatorNode.left = scaleNode.x;

    // interactive probe
    const probeNode = new MacroPHProbeNode( meter.probe, modelViewTransform, solutionNode, dropperFluidNode,
      waterFluidNode, drainFluidNode, jumpPositions, jumpPositionIndexProperty, {
        accessibleName: PhScaleStrings.a11y.probe.accessibleNameStringProperty,
        accessibleHelpText: PhScaleStrings.a11y.probe.accessibleHelpTextStringProperty,
        tandem: options.tandem.createTandem( 'probeNode' )
      } );
    this.probeNode = probeNode;

    // wire that connects the probe to the meter
    const wireNode = new WireNode( meter.probe, scaleNode, probeNode );

    // rendering order
    this.children = [ wireNode, probeNode, scaleNode, pHIndicatorNode ];

    // vertical position of the indicator
    meter.pHProperty.link( pH => {
      pHIndicatorNode.centerY = scaleNode.y + linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, pH || 7 );
    } );

    const updateValue = () => {
      let pH;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        pH = solution.pHProperty.value;
      }
      else if ( probeNode.isInWater() ) {
        pH = Water.pH;
      }
      else if ( probeNode.isInDropperSolution() ) {
        pH = dropper.soluteProperty.value.pH;
      }
      else {
        pH = null;
      }
      meter.pHProperty.value = pH;
    };
    Multilink.multilink( [
      meter.probe.positionProperty,
      solution.soluteProperty,
      solution.pHProperty,
      solutionNode.boundsProperty,
      dropperFluidNode.boundsProperty,
      waterFluidNode.boundsProperty,
      drainFluidNode.boundsProperty
    ], () => updateValue() );

    // Create a link to pHProperty, so it's easier to find in Studio.
    this.addLinkedElement( meter.pHProperty, {
      tandemName: 'pHProperty'
    } );
  }

  public reset(): void {
    this.probeNode.reset();
  }

  // Create the qualitative pH description used in the pdom.
  public static createPHDescriptionStringProperty( pHProperty: Property<PHValue> ): TReadOnlyProperty<string> {
    return new DerivedProperty( [ pHProperty,
        PhScaleStrings.a11y.qualitativePHDescription.extremelyBasicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.highlyBasicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.moderatelyBasicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.slightlyBasicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.neutralStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.slightlyAcidicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.moderatelyAcidicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.highlyAcidicStringProperty,
        PhScaleStrings.a11y.qualitativePHDescription.extremelyAcidicStringProperty ],
      ( pHValue, extremelyBasic, highlyBasic, moderatelyBasic, slightlyBasic, neutral, slightlyAcidic, moderatelyAcidic, highlyAcidic, extremelyAcidic ) => {
        if ( pHValue === null ) {
          return 'undefined';
        }
        else if ( pHValue <= 14 && pHValue >= 13 ) {
          return extremelyBasic;
        }
        else if ( pHValue < 13 && pHValue >= 11 ) {
          return highlyBasic;
        }
        else if ( pHValue < 11 && pHValue >= 9 ) {
          return moderatelyBasic;
        }
        else if ( pHValue < 9 && pHValue > 7 ) {
          return slightlyBasic;
        }
        else if ( pHValue === 7 ) {
          return neutral;
        }
        else if ( pHValue < 7 && pHValue >= 5 ) {
          return slightlyAcidic;
        }
        else if ( pHValue < 5 && pHValue >= 3 ) {
          return moderatelyAcidic;
        }
        else if ( pHValue < 3 && pHValue >= 1 ) {
          return highlyAcidic;
        }
        else if ( pHValue < 1 && pHValue >= 0 ) {
          return extremelyAcidic;
        }
        else {
          return 'undefined';
        }
      } );
  }
}

/**
 * The meter's vertical scale.
 */
type ScaleNodeSelfOptions = {
  range?: Range;
  size?: Dimension2;
};
type ScaleNodeOptions = ScaleNodeSelfOptions & NodeOptions;

export class ScaleNode extends Node {

  public constructor( providedOptions?: ScaleNodeOptions ) {

    const options = optionize<ScaleNodeOptions, ScaleNodeSelfOptions, NodeOptions>()( {
      range: PHScaleConstants.PH_RANGE,
      size: new Dimension2( 75, 450 )
    }, providedOptions );

    super( options );

    // gradient background
    const backgroundStrokeWidth = 2;
    const backgroundNode = ScaleNode.createBackground( options.size, backgroundStrokeWidth );
    this.addChild( backgroundNode );

    // 'Acidic' label
    const textOptions = { fill: 'black', font: SCALE_LABEL_FONT, maxWidth: 0.45 * options.size.height };
    const acidicText = new Text( PhScaleStrings.acidicStringProperty, textOptions );
    acidicText.rotation = -Math.PI / 2;
    this.addChild( acidicText );
    acidicText.boundsProperty.link( bounds => {
      acidicText.centerX = backgroundNode.centerX;
      acidicText.centerY = 0.75 * backgroundNode.height;
    } );

    // 'Basic' label
    const basicText = new Text( PhScaleStrings.basicStringProperty, textOptions );
    basicText.rotation = -Math.PI / 2;
    this.addChild( basicText );
    basicText.boundsProperty.link( bounds => {
      basicText.centerX = backgroundNode.centerX;
      basicText.centerY = 0.25 * backgroundNode.height;
    } );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    let y = options.size.height;
    const dy = -options.size.height / options.range.getLength();
    for ( let pH = options.range.min; pH <= options.range.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        const lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.right = backgroundNode.left;
        lineNode.centerY = y;
        this.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          const tickText = new Text( pH, { font: TICK_FONT } );
          tickText.right = lineNode.left - TICK_LABEL_X_SPACING;
          tickText.centerY = lineNode.centerY;
          this.addChild( tickText );
        }
      }
      y += dy;
    }

    // 'Neutral' tick mark
    const neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 3 } );
    neutralLineNode.right = backgroundNode.left;
    neutralLineNode.centerY = options.size.height / 2;
    this.addChild( neutralLineNode );
    const neutralText = new Text( '7', {
      fill: 'black',
      font: new PhetFont( { family: 'Arial black', size: 28, weight: 'bold' } )
    } );
    this.addChild( neutralText );
    neutralText.right = neutralLineNode.left - TICK_LABEL_X_SPACING;
    neutralText.centerY = neutralLineNode.centerY;
  }

  public static createBackground( size: Dimension2, lineWidth: number ): Node {
    return new Rectangle( 0, 0, size.width, size.height, {
      fill: new LinearGradient( 0, 0, 0, size.height )
        .addColorStop( 0, PHScaleColors.basicColorProperty )
        .addColorStop( 0.5, PHScaleColors.neutralColorProperty )
        .addColorStop( 1, PHScaleColors.acidicColorProperty ),
      stroke: 'black',
      lineWidth: lineWidth
    } );
  }
}

/**
 * Wire that connects the body and probe.
 */
class WireNode extends Path {

  public constructor( probe: PHMovable, bodyNode: Node, probeNode: Node ) {

    super( new Shape(), {
      stroke: 'rgb( 80, 80, 80 )',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    const updateCurve = () => {

      const scaleCenterX = bodyNode.x + ( SCALE_SIZE.width / 2 );

      // Connect bottom-center of body to right-center of probe.
      const bodyConnectionPoint = new Vector2( scaleCenterX, bodyNode.bottom - 10 );
      const probeConnectionPoint = new Vector2( probeNode.left, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, linear( 0, 800, 0, 300, probeNode.left - scaleCenterX ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( -50, 0 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      this.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    probe.positionProperty.link( updateCurve );
  }
}

/**
 * pH indicator that slides vertically along scale.
 * When there is no pH value, it points to 'neutral' but does not display a value.
 */
type PHIndicatorNodeSelfOptions = EmptySelfOptions;
type PHIndicatorNodeOptions = PHIndicatorNodeSelfOptions & WithRequired<NodeOptions, 'tandem'> & StrictOmit<NodeOptions, 'children'>;

class PHIndicatorNode extends Node {

  public constructor( pHProperty: Property<PHValue>, scaleWidth: number, providedOptions: PHIndicatorNodeOptions ) {

    const pHValuePatternStringProperty = new PatternStringProperty( PhScaleStrings.a11y.pHValuePatternStringProperty, {
      pHValue: pHProperty,
      pHDescription: MacroPHMeterNode.createPHDescriptionStringProperty( pHProperty )
    } );

    const options = optionize<PHIndicatorNodeOptions, PHIndicatorNodeSelfOptions, NodeOptions>()( {
      accessibleParagraph: pHValuePatternStringProperty
    }, providedOptions );

    // dashed line that extends across the scale
    const lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // pH display
    const numberDisplay = new NumberDisplay( pHProperty, PHScaleConstants.PH_RANGE, {
      decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
      align: 'right',
      noValueAlign: 'center',
      cornerRadius: CORNER_RADIUS,
      xMargin: 8,
      yMargin: 5,
      textOptions: {
        font: new PhetFont( 28 ),
        stringPropertyOptions: { phetioHighFrequency: true }
      },
      tandem: options.tandem.createTandem( 'numberDisplay' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // label above the value
    const pHText = new Text( PhScaleStrings.pHStringProperty, {
      fill: 'white',
      font: new PhetFont( { size: 28, weight: 'bold' } ),
      maxWidth: 100
    } );

    // background
    const backgroundXMargin = 14;
    const backgroundYMargin = 10;
    const backgroundYSpacing = 6;
    const backgroundWidth = Math.max( pHText.width, numberDisplay.width ) + ( 2 * backgroundXMargin );
    const backgroundHeight = pHText.height + numberDisplay.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    const backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      cornerRadius: CORNER_RADIUS,
      fill: BACKGROUND_ENABLED_FILL_PROPERTY
    } );

    // highlight around the background
    const highlightLineWidth = 3;
    const outerHighlight = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      cornerRadius: CORNER_RADIUS,
      stroke: 'black',
      lineWidth: highlightLineWidth
    } );
    const innerHighlight = new Rectangle( highlightLineWidth, highlightLineWidth,
      backgroundWidth - ( 2 * highlightLineWidth ), backgroundHeight - ( 2 * highlightLineWidth ), {
        cornerRadius: CORNER_RADIUS,
        stroke: 'white', lineWidth: highlightLineWidth
      } );
    const highlight = new Node( {
      children: [ innerHighlight, outerHighlight ],
      visible: false
    } );

    // arrow head pointing at the scale
    const arrowSize = new Dimension2( 21, 28 );
    const arrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowSize.width, -arrowSize.height / 2 )
      .lineTo( arrowSize.width, arrowSize.height / 2 )
      .close();
    const arrowNode = new Path( arrowShape, { fill: 'black' } );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
    backgroundRectangle.left = arrowNode.right - 1; // overlap to hide seam
    backgroundRectangle.centerY = arrowNode.centerY;
    highlight.center = backgroundRectangle.center;

    options.children = [
      arrowNode,
      backgroundRectangle,
      highlight,
      pHText,
      numberDisplay,
      lineNode
    ];

    super( options );

    pHText.boundsProperty.link( bounds => {
      pHText.centerX = backgroundRectangle.centerX;
      pHText.top = backgroundRectangle.top + backgroundYMargin;
    } );

    numberDisplay.centerX = backgroundRectangle.centerX;
    numberDisplay.top = pHText.bottom + backgroundYSpacing;

    pHProperty.link( pH => {

      // make the indicator look enabled or disabled
      const enabled = ( pH !== null );
      backgroundRectangle.fill = enabled ? BACKGROUND_ENABLED_FILL_PROPERTY : BACKGROUND_DISABLED_FILL_PROPERTY;
      arrowNode.visible = lineNode.visible = enabled;

      // Highlight the indicator when displayed pH === 7
      highlight.visible = ( pH !== null ) && ( toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ) === 7 );
    } );
  }
}

phScale.register( 'MacroPHMeterNode', MacroPHMeterNode );
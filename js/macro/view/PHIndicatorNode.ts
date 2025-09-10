// Copyright 2024, University of Colorado Boulder

/**
 * pH indicator that slides vertically along scale.
 * When there is no pH value, it points to 'neutral' but does not display a value.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { PHValue } from '../../common/model/PHModel.js';
import PHScaleColors from '../../common/PHScaleColors.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';

// constants
const BACKGROUND_ENABLED_FILL_PROPERTY = PHScaleColors.pHProbeColorProperty;
const BACKGROUND_DISABLED_FILL_PROPERTY = PHScaleColors.pHMeterDisabledColorProperty;
const CORNER_RADIUS = 12;

type PHIndicatorNodeSelfOptions = EmptySelfOptions;
type PHIndicatorNodeOptions = PHIndicatorNodeSelfOptions & WithRequired<NodeOptions, 'tandem'> & StrictOmit<NodeOptions, 'children'>;

export default class PHIndicatorNode extends Node {

  public constructor( pHProperty: Property<PHValue>, scaleWidth: number, providedOptions: PHIndicatorNodeOptions ) {
    const pHDescriptionStringProperty = new DynamicProperty( new DerivedProperty( [ pHProperty ], pH => PHIndicatorNode.getQualitativePHValue( pH ) ) );
    const qualitativePHValueStringProperty = new PatternStringProperty( PhScaleStrings.a11y.qualitativePHValuePatternStringProperty, {
      pHValue: PHScaleConstants.CREATE_PH_VALUE_FIXED_PROPERTY( pHProperty ),
      pHDescription: pHDescriptionStringProperty
    } );
    const accessibleParagraphStringProperty = new DerivedProperty( [ pHProperty, qualitativePHValueStringProperty, PhScaleStrings.a11y.pHValueUnknownStringProperty ],
      ( pH, qualitativePHValue, pHValueUnknown ) => pH === null ? pHValueUnknown : qualitativePHValue );
    const options = optionize<PHIndicatorNodeOptions, PHIndicatorNodeSelfOptions, NodeOptions>()( {
      accessibleParagraph: accessibleParagraphStringProperty
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

  /**
   * Extremely Basic [13, 14]
   * Highly Basic [11, 13)
   * Moderately Basic [9, 11)
   * Slightly Basic (7, 9)
   * Neutral 7
   * Slightly Acidic (5, 7)
   * Moderately Acidic (3, 5]
   * Highly Acidic (1, 3]
   * Extremely Acidic [0, 1]
   * @param pH
   */
  private static getQualitativePHValue( pH: number | null ): TReadOnlyProperty<string> {
    if ( pH === null ) {
      return PhScaleStrings.a11y.unknownStringProperty;
    }
    else {
      const pHRounded = toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      if ( pHRounded === 7 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.neutralStringProperty;
      }
      else if ( pHRounded > 13 && pHRounded <= 14 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.extremelyBasicStringProperty;
      }
      else if ( pHRounded > 11 && pHRounded <= 13 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.highlyBasicStringProperty;
      }
      else if ( pHRounded > 9 && pHRounded <= 11 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.moderatelyBasicStringProperty;
      }
      else if ( pHRounded > 7 && pHRounded <= 9 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.slightlyBasicStringProperty;
      }
      else if ( pHRounded >= 5 && pHRounded < 7 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.slightlyAcidicStringProperty;
      }
      else if ( pHRounded >= 3 && pHRounded < 5 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.moderatelyAcidicStringProperty;
      }
      else if ( pHRounded >= 1 && pHRounded < 3 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.highlyAcidicStringProperty;
      }
      else if ( pHRounded < 1 && pHRounded >= 0 ) {
        return PhScaleStrings.a11y.qualitativePHDescription.extremelyAcidicStringProperty;
      }
      else {
        affirm( false, `Unexpected pH value: ${pHRounded}` );
        return PhScaleStrings.a11y.unknownStringProperty;
      }
    }
  }
}

phScale.register( 'PHIndicatorNode', PHIndicatorNode );
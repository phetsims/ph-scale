// Copyright 2014-2020, University of Colorado Boulder

/**
 * Graph with a linear scale, for displaying concentration (mol/L) and quantity (moles).
 * Some of the code related to indicators (initialization and updateIndicators) is similar
 * to LogarithmicGraph. But it was difficult to identify a natural pattern for factoring
 * this out, so I chose to leave it as is. See issue #16.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Utils from '../../../../../dot/js/Utils.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import phScaleStrings from '../../../phScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';
import LinearZoomButtonGroup from './LinearZoomButtonGroup.js';

// constants
const MANTISSA_RANGE = PHScaleConstants.LINEAR_MANTISSA_RANGE;

class LinearGraphNode extends Node {

  /**
   * @param {MicroSolution|MySolution} solution
   * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
   * @param {Object} [options]
   */
  constructor( solution, graphUnitsProperty, options ) {

    options = merge( {

      // scale
      scaleHeight: 100,
      minScaleWidth: 100,
      scaleFill: 'rgb( 230, 230, 230 )',
      scaleStroke: 'black',
      scaleLineWidth: 2,
      scaleYMargin: 30,

      // arrow at top of scale
      arrowHeight: 75,

      // major ticks
      majorTickFont: new PhetFont( 18 ),
      majorTickLength: 10,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,
      majorTickXSpacing: 5,

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    }, options );

    super();

    // @private
    this.exponentProperty = new NumberProperty( PHScaleConstants.LINEAR_EXPONENT_RANGE.max, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'exponentProperty' ),
      range: PHScaleConstants.LINEAR_EXPONENT_RANGE,
      phetioReadOnly: true,
      phetioDocumentation: 'exponent on the linear scale'
    } );

    const scaleWidth = options.minScaleWidth;
    const scaleHeight = options.scaleHeight;
    const arrowWidth = 1.5 * scaleWidth;
    const arrowHeight = options.arrowHeight;
    const arrowHeadHeight = 0.85 * arrowHeight;
    const arrowGap = -10; // this controls the vertical gap between the arrow and the scale

    // arrow above scale, starting from arrow tip and moving clockwise
    const arrowNode = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( arrowWidth / 2, arrowHeadHeight )
        .lineTo( scaleWidth / 2, arrowHeadHeight )
        .lineTo( scaleWidth / 2, arrowHeight )
        .cubicCurveTo( -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 2, arrowHeight )
        .lineTo( -scaleWidth / 2, arrowHeadHeight )
        .lineTo( -arrowWidth / 2, arrowHeadHeight )
        .close(),
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth, top: arrowGap }
    );
    this.addChild( arrowNode );

    // scale below the arrow
    const scaleNode = new Path( new Shape()
        .moveTo( -scaleWidth / 2, arrowHeight )
        .cubicCurveTo( scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 2, arrowHeight )
        .lineTo( scaleWidth / 2, scaleHeight )
        .lineTo( -scaleWidth / 2, scaleHeight )
        .close(),
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth }
    );
    this.addChild( scaleNode );

    // 'off scale' label, positioned inside arrow
    const offScaleNode = new Text( phScaleStrings.offScale, {
      font: new PhetFont( 18 ),
      fill: 'black',
      maxWidth: 0.5 * arrowWidth
    } );
    this.addChild( offScaleNode );
    offScaleNode.centerX = arrowNode.centerX;
    offScaleNode.y = arrowNode.top + ( 0.85 * arrowHeadHeight );

    // Create the tick marks. Correct labels will be assigned later.
    const tickLabels = [];
    const numberOfTicks = MANTISSA_RANGE.getLength() + 1;
    const ySpacing = ( scaleHeight - arrowHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    let tickLabel;
    let tickLineLeft;
    let tickLineRight;
    for ( let i = 0; i < numberOfTicks; i++ ) {

      // major lines and label
      tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, {
        stroke: options.majorTickStroke,
        lineWidth: options.majorTickLineWidth
      } );
      tickLineRight = new Line( 0, 0, options.majorTickLength, 0, {
        stroke: options.majorTickStroke,
        lineWidth: options.majorTickLineWidth
      } );
      tickLabel = new ScientificNotationNode( new NumberProperty( i ), {
        font: options.majorTickFont,
        fill: 'black',
        mantissaDecimalPlaces: 0,
        showIntegersAsMantissaOnly: true
      } );

      // rendering order
      this.addChild( tickLineLeft );
      this.addChild( tickLineRight );
      this.addChild( tickLabel );

      // layout
      tickLineLeft.left = scaleNode.left;
      tickLineLeft.centerY = scaleNode.bottom - options.scaleYMargin - ( i * ySpacing );
      tickLineRight.right = scaleNode.right;
      tickLineRight.centerY = tickLineLeft.centerY;
      tickLabel.centerX = scaleNode.centerX;
      tickLabel.centerY = tickLineLeft.centerY;

      // save label so we can update it layer
      tickLabels.push( tickLabel );
    }

    // Values displayed on the indicators
    const valueH2OProperty = new DerivedProperty(
      [ solution.concentrationH2OProperty, solution.quantityH2OProperty, graphUnitsProperty ],
      ( concentration, quantity, graphUnits ) =>
        ( graphUnits === GraphUnits.MOLES_PER_LITER ) ? concentration : quantity
    );
    const valueH3OProperty = new DerivedProperty(
      [ solution.concentrationH3OProperty, solution.quantityH3OProperty, graphUnitsProperty ],
      ( concentration, quantity, graphUnits ) =>
        ( graphUnits === GraphUnits.MOLES_PER_LITER ) ? concentration : quantity
    );
    const valueOHProperty = new DerivedProperty(
      [ solution.concentrationOHProperty, solution.quantityOHProperty, graphUnitsProperty ],
      ( concentration, quantity, graphUnits ) =>
        ( graphUnits === GraphUnits.MOLES_PER_LITER ) ? concentration : quantity
    );

    // indicators
    const indicatorH2ONode = GraphIndicatorNode.createH2OIndicator( valueH2OProperty, {
      x: scaleNode.right - options.majorTickLength,
      tandem: options.tandem.createTandem( 'indicatorH2ONode' )
    } );
    const indicatorH3ONode = GraphIndicatorNode.createH3OIndicator( valueH3OProperty, {
      x: scaleNode.left + options.majorTickLength,
      tandem: options.tandem.createTandem( 'indicatorH3ONode' ),
      pickablePropertyPhetioInstrumented: true
    } );
    const indicatorOHNode = GraphIndicatorNode.createOHIndicator( valueOHProperty, {
      x: scaleNode.right - options.majorTickLength,
      tandem: options.tandem.createTandem( 'indicatorOHNode' ),
      pickablePropertyPhetioInstrumented: true
    } );
    this.addChild( indicatorH2ONode );
    this.addChild( indicatorH3ONode );
    this.addChild( indicatorOHNode );

    /*
     * Given a value, compute it's y position relative to the top of the scale.
     * @param {number|null} value in model coordinates
     * @param {number} offScaleYOffset optional y-offset added to the position if the value is off the scale
     * @returns {number} y position in view coordinates
     */
    const valueToY = ( value, offScaleYOffset ) => {
      const topTickValue = MANTISSA_RANGE.max * Math.pow( 10, this.exponentProperty.get() );
      value = value || 0;
      if ( value > topTickValue ) {
        // values out of range are placed in the arrow
        return arrowNode.top + ( 0.8 * arrowHeadHeight ) + ( offScaleYOffset || 0 );
      }
      else {
        return Utils.linear( 0, topTickValue, tickLabels[ 0 ].centerY, tickLabels[ tickLabels.length - 1 ].centerY, value );
      }
    };

    // updates the tick labels to match the exponent
    const updateTickLabels = exponent => {
      const tickOptions = ( exponent >= 0 ) ? { exponent: 0 } : { exponent: exponent }; // show positive exponents as integers
      for ( let i = 0; i < tickLabels.length; i++ ) {
        tickLabels[ i ].valueProperty.set( i * Math.pow( 10, exponent ), tickOptions );
        tickLabels[ i ].centerX = scaleNode.centerX;
      }
    };

    // When the exponent changes, relabel the tick marks
    this.exponentProperty.link( exponent => updateTickLabels( exponent ) );

    // zoom buttons
    const zoomButtonGroup = new LinearZoomButtonGroup( this.exponentProperty, {
      centerX: scaleNode.centerX,
      top: scaleNode.bottom + 44,
      tandem: options.tandem.createTandem( 'zoomButtonGroup' )
    } );
    this.addChild( zoomButtonGroup );

    // Move the indicators
    Property.multilink( [ valueH2OProperty, graphUnitsProperty, this.exponentProperty ],
      ( valueH2O, graphUnits, exponent ) => {
        // offset the H2O indicator when off scale, so it doesn't butt up again OH indicator
        indicatorH2ONode.y = valueToY( valueH2O, -4 );
      } );
    Property.multilink( [ valueH3OProperty, graphUnitsProperty, this.exponentProperty ],
      ( valueH3O, graphUnits, exponent ) => {
        indicatorH3ONode.y = valueToY( valueH3O );
      } );
    Property.multilink( [ valueOHProperty, graphUnitsProperty, this.exponentProperty ],
      ( valueOH, graphUnits, exponent ) => {
        indicatorOHNode.y = valueToY( valueOH );
      } );

    this.mutate( options );
  }

  /**
   * @public
   */
  reset() {
    this.exponentProperty.reset();
  }
}

phScale.register( 'LinearGraphNode', LinearGraphNode );
export default LinearGraphNode;
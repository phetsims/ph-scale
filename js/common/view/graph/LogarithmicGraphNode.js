// Copyright 2013-2020, University of Colorado Boulder

/**
 * Graph with a logarithmic scale, for displaying concentration (mol/L) and quantity (moles).
 * Assumes that graphing concentration and quantity can be graphed on the same scale.
 * Origin is at the top-left of the scale rectangle.
 *
 * Some of the code related to indicators (initialization and updateIndicators) is similar
 * to LinearGraph. But it was difficult to identify a natural pattern for factoring
 * this out, so I chose to leave it as is. See issue #16.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Utils from '../../../../../dot/js/Utils.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import LinearGradient from '../../../../../scenery/js/util/LinearGradient.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PHModel from '../../model/PHModel.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphIndicatorDragHandler from './GraphIndicatorDragHandler.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';

class LogarithmicGraphNode extends Node {

  /**
   * @param {MicroSolution|MySolution} solution
   * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
   * @param {Object} [options]
   */
  constructor( solution, graphUnitsProperty, options ) {

    options = merge( {
      isInteractive: false, // if true, add drag handlers for changing H3O+ and OH-

      // scale
      scaleHeight: 100,
      minScaleWidth: 100,
      scaleYMargin: 30, // space above/below top/bottom tick marks
      scaleCornerRadius: 20,
      scaleStroke: 'black',
      scaleLineWidth: 2,

      // major ticks
      majorTickFont: new PhetFont( 22 ),
      majorTickLength: 15,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,
      majorTickXSpacing: 5,

      // minor ticks
      minorTickLength: 7,
      minorTickStroke: 'black',
      minorTickLineWidth: 1,

      // indicators
      indicatorXOffset: 10,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: {
        visibleProperty: {
          phetioReadOnly: true
        }
      }
    }, options );

    super();

    // background for the scale, width sized to fit
    const widestTickLabel = createTickLabel( PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min, options.majorTickFont );
    const scaleWidth = Math.max( options.minScaleWidth, widestTickLabel.width + ( 2 * options.majorTickXSpacing ) + ( 2 * options.majorTickLength ) );
    const backgroundNode = new Rectangle( 0, 0, scaleWidth, options.scaleHeight, options.scaleCornerRadius, options.scaleCornerRadius, {
      fill: new LinearGradient( 0, 0, 0, options.scaleHeight ).addColorStop( 0, 'rgb( 200, 200, 200 )' ).addColorStop( 1, 'white' ),
      stroke: options.scaleStroke,
      lineWidth: options.scaleLineWidth
    } );
    this.addChild( backgroundNode );

    // tick marks
    const numberOfTicks = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.getLength() + 1;
    const ySpacing = ( options.scaleHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    let exponent;
    let tickLabel;
    let tickLineLeft;
    let tickLineRight;
    for ( let i = 0; i < numberOfTicks; i++ ) {

      exponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max - i;

      // major ticks at even-numbered exponents
      if ( exponent % 2 === 0 ) {

        // major lines and label
        tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, {
          stroke: options.majorTickStroke,
          lineWidth: options.majorTickLineWidth
        } );
        tickLineRight = new Line( 0, 0, options.majorTickLength, 0, {
          stroke: options.majorTickStroke,
          lineWidth: options.majorTickLineWidth
        } );
        tickLabel = createTickLabel( exponent, options.majorTickFont );

        // rendering order
        this.addChild( tickLineLeft );
        this.addChild( tickLineRight );
        this.addChild( tickLabel );

        // layout
        tickLineLeft.left = backgroundNode.left;
        tickLineLeft.centerY = options.scaleYMargin + ( i * ySpacing );
        tickLineRight.right = backgroundNode.right;
        tickLineRight.centerY = tickLineLeft.centerY;
        tickLabel.centerX = backgroundNode.centerX;
        tickLabel.centerY = tickLineLeft.centerY;
      }
      else {
        // minor lines
        tickLineLeft = new Line( 0, 0, options.minorTickLength, 0, {
          stroke: options.minorTickStroke,
          lineWidth: options.minorTickLineWidth
        } );
        tickLineRight = new Line( 0, 0, options.minorTickLength, 0, {
          stroke: options.minorTickStroke,
          lineWidth: options.minorTickLineWidth
        } );

        // rendering order
        this.addChild( tickLineLeft );
        this.addChild( tickLineRight );

        // layout
        tickLineLeft.left = backgroundNode.left;
        tickLineLeft.centerY = options.scaleYMargin + ( i * ySpacing );
        tickLineRight.right = backgroundNode.right;
        tickLineRight.centerY = tickLineLeft.centerY;
      }
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
      x: backgroundNode.right - options.indicatorXOffset,
      tandem: options.tandem.createTandem( 'indicatorH2ONode' )
    } );
    const indicatorH3ONode = GraphIndicatorNode.createH3OIndicator( valueH3OProperty, {
      x: backgroundNode.left + options.indicatorXOffset,
      isInteractive: options.isInteractive,
      tandem: options.tandem.createTandem( 'indicatorH3ONode' )
    } );
    const indicatorOHNode = GraphIndicatorNode.createOHIndicator( valueOHProperty, {
      x: backgroundNode.right - options.indicatorXOffset,
      isInteractive: options.isInteractive,
      tandem: options.tandem.createTandem( 'indicatorOHNode' )
    } );
    this.addChild( indicatorH2ONode );
    this.addChild( indicatorH3ONode );
    this.addChild( indicatorOHNode );

    /**
     * Given a value, compute it's y position relative to the top of the scale.
     * @param {number|null} value
     * @returns {number}
     */
    const valueToY = value => {
      if ( value === 0 || value === null ) {
        // below the bottom tick
        return options.scaleHeight - ( 0.5 * options.scaleYMargin );
      }
      else {
        // between the top and bottom tick
        const maxHeight = ( options.scaleHeight - 2 * options.scaleYMargin );
        const maxExponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max;
        const minExponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min;
        const valueExponent = Utils.log10( value );
        return options.scaleYMargin + maxHeight - ( maxHeight * ( valueExponent - minExponent ) / ( maxExponent - minExponent ) );
      }
    };

    // Given a y position relative to the top of the scale, compute a value.
    const yToValue = y => {
      const yOffset = y - options.scaleYMargin; // distance between indicator's origin and top tick mark
      const maxHeight = ( options.scaleHeight - 2 * options.scaleYMargin ); // distance between top and bottom tick marks
      const exponent = Utils.linear( 0, maxHeight, PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max, PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min, yOffset );
      return Math.pow( 10, exponent );
    };

    // Move the indicators
    Property.multilink( [ valueH2OProperty, graphUnitsProperty ],
      ( valueH2O, graphUnits ) => {
        // offset the H2O indicator when off scale, so it doesn't butt up again OH indicator
        indicatorH2ONode.y = valueToY( valueH2O, -4  );
      } );
    Property.multilink( [ valueH3OProperty, graphUnitsProperty ],
      ( valueH3O, graphUnits )  => {
        indicatorH3ONode.y = valueToY( valueH3O );
      } );
    Property.multilink( [ valueOHProperty, graphUnitsProperty ],
      ( valueOH, graphUnits )  => {
        indicatorOHNode.y = valueToY( valueOH );
      } );

    // Add drag handlers for H3O+ and OH-
    if ( options.isInteractive ) {

      // H3O+ indicator
      indicatorH3ONode.addInputListener(
        new GraphIndicatorDragHandler( solution.pHProperty, solution.totalVolumeProperty, graphUnitsProperty, yToValue,
          PHModel.concentrationH3OToPH, PHModel.molesH3OToPH,
          indicatorH3ONode.tandem.createTandem( 'dragHandler' )
        ) );
      indicatorH3ONode.cursor = 'pointer';

      // OH- indicator
      indicatorOHNode.addInputListener(
        new GraphIndicatorDragHandler( solution.pHProperty, solution.totalVolumeProperty, graphUnitsProperty, yToValue,
          PHModel.concentrationOHToPH, PHModel.molesOHToPH,
          indicatorOHNode.tandem.createTandem( 'dragHandler' )
        ) );
      indicatorOHNode.cursor = 'pointer';
    }

    this.mutate( options );
  }
}

/**
 * Creates a tick label, '10' to some exponent.
 * @param {number} exponent
 * @param {Font} font
 */
function createTickLabel( exponent, font ) {
  return new RichText( `10<sup>${exponent}</sup>`, {
    font: font,
    fill: 'black'
  } );
}

phScale.register( 'LogarithmicGraphNode', LogarithmicGraphNode );
export default LogarithmicGraphNode;
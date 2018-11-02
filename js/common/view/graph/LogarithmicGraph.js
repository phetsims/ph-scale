// Copyright 2013-2017, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var GraphIndicator = require( 'PH_SCALE/common/view/graph/GraphIndicator' );
  var GraphIndicatorDragHandler = require( 'PH_SCALE/common/view/graph/GraphIndicatorDragHandler' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var phScale = require( 'PH_SCALE/phScale' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Solution} solution
   * @param {Property.<GraphUnits>} graphUnitsProperty
   * @param {Object} [options]
   * @constructor
   */
  function LogarithmicGraph( solution, graphUnitsProperty, options ) {

    options = _.extend( {
      isInteractive: false,
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
      indicatorXOffset: 10
    }, options );

    Node.call( this );

    // background for the scale, width sized to fit
    var widestTickLabel = createTickLabel( PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min, options.majorTickFont );
    var scaleWidth = Math.max( options.minScaleWidth, widestTickLabel.width + ( 2 * options.majorTickXSpacing ) + ( 2 * options.majorTickLength ) );
    var backgroundNode = new Rectangle( 0, 0, scaleWidth, options.scaleHeight, options.scaleCornerRadius, options.scaleCornerRadius, {
      fill: new LinearGradient( 0, 0, 0, options.scaleHeight ).addColorStop( 0, 'rgb(200,200,200)' ).addColorStop( 1, 'white' ),
      stroke: options.scaleStroke,
      lineWidth: options.scaleLineWidth
    } );
    this.addChild( backgroundNode );

    // tick marks
    var numberOfTicks = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.getLength() + 1;
    var ySpacing = ( options.scaleHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    var exponent;
    var tickLabel;
    var tickLineLeft;
    var tickLineRight;
    for ( var i = 0; i < numberOfTicks; i++ ) {

      exponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max - i;

      // major ticks at even-numbered exponents
      if ( exponent % 2 === 0 ) {

        // major lines and label
        tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
        tickLineRight = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
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
        tickLineLeft = new Line( 0, 0, options.minorTickLength, 0, { stroke: options.minorTickStroke, lineWidth: options.minorTickLineWidth } );
        tickLineRight = new Line( 0, 0, options.minorTickLength, 0, { stroke: options.minorTickStroke, lineWidth: options.minorTickLineWidth } );

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

    // indicators & associated properties
    var valueH2OProperty = new NumberProperty( 0 );
    var valueH3OProperty = new NumberProperty( 0 );
    var valueOHProperty = new NumberProperty( 0 );
    var h2OIndicatorNode = new GraphIndicator.createH2OIndicator( valueH2OProperty, {
      x: backgroundNode.right - options.indicatorXOffset
    } );
    var h3OIndicatorNode = new GraphIndicator.createH3OIndicator( valueH3OProperty, {
      x: backgroundNode.left + options.indicatorXOffset,
      isInteractive: options.isInteractive
    } );
    var oHIndicatorNode = new GraphIndicator.createOHIndicator( valueOHProperty, {
      x: backgroundNode.right - options.indicatorXOffset,
      isInteractive: options.isInteractive
    } );
    this.addChild( h2OIndicatorNode );
    this.addChild( h3OIndicatorNode );
    this.addChild( oHIndicatorNode );

    // Given a value, compute it's y position relative to the top of the scale.
    var valueToY = function( value ) {
      if ( value === 0 ) {
        // below the bottom tick
        return options.scaleHeight - ( 0.5 * options.scaleYMargin );
      }
      else {
        // between the top and bottom tick
        var maxHeight = ( options.scaleHeight - 2 * options.scaleYMargin );
        var maxExponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max;
        var minExponent = PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min;
        var valueExponent = Util.log10( value );
        return options.scaleYMargin + maxHeight - ( maxHeight * ( valueExponent - minExponent ) / ( maxExponent - minExponent ) );
      }
    };

    // Given a y position relative to the top of the scale, compute a value.
    var yToValue = function( y ) {
      var yOffset = y - options.scaleYMargin; // distance between indicator's origin and top tick mark
      var maxHeight = ( options.scaleHeight - 2 * options.scaleYMargin ); // distance between top and bottom tick marks
      var exponent = Util.linear( 0, maxHeight, PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max, PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min, yOffset );
      return Math.pow( 10, exponent );
    };

    // Update the indicators
    var updateIndicators = function() {

      var valueH2O;
      var valueH3O;
      var valueOH;
      if ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER ) {
        // concentration
        valueH2O = solution.getConcentrationH2O();
        valueH3O = solution.getConcentrationH3O();
        valueOH = solution.getConcentrationOH();
      }
      else {
        // quantity
        valueH2O = solution.getMolesH2O();
        valueH3O = solution.getMolesH3O();
        valueOH = solution.getMolesOH();
      }

      // move indicators
      h2OIndicatorNode.y = valueToY( valueH2O );
      h3OIndicatorNode.y = valueToY( valueH3O );
      oHIndicatorNode.y = valueToY( valueOH );

      // update indicator values
      valueH2OProperty.set( valueH2O );
      valueH3OProperty.set( valueH3O );
      valueOHProperty.set( valueOH );
    };
    solution.pHProperty.link( updateIndicators.bind( this ) );
    solution.volumeProperty.link( updateIndicators.bind( this ) );
    graphUnitsProperty.link( updateIndicators.bind( this ) );

    // Add optional interactivity
    if ( options.isInteractive ) {

      // H3O+ indicator
      h3OIndicatorNode.addInputListener(
        new GraphIndicatorDragHandler( solution, graphUnitsProperty, yToValue, PHModel.concentrationH3OToPH, PHModel.molesH3OToPH ) );

      // OH- indicator
      oHIndicatorNode.addInputListener(
        new GraphIndicatorDragHandler( solution, graphUnitsProperty, yToValue, PHModel.concentrationOHToPH, PHModel.molesOHToPH ) );
    }
  }

  phScale.register( 'LogarithmicGraph', LogarithmicGraph );

  // Creates a tick label, '10' to some exponent.
  var createTickLabel = function( exponent, font ) {
    return new RichText( '10<sup>' + exponent + '</sup>', { font: font, fill: 'black' } );
  };

  return inherit( Node, LogarithmicGraph );
} );

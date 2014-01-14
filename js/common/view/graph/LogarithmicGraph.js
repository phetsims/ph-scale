// Copyright 2002-2013, University of Colorado Boulder

/**
 * Graph with a logarithmic scale, for displaying concentration (mol/L) and quantity (moles).
 * Assumes that graphing concentration and quantity can be graphed on the same scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var H2OIndicatorNode = require( 'PH_SCALE/common/view/graph/H2OIndicatorNode' );
  var H3OIndicatorNode = require( 'PH_SCALE/common/view/graph/H3OIndicatorNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHIndicatorNode = require( 'PH_SCALE/common/view/graph/OHIndicatorNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Solution} solution
   * @param {GraphUnits} graphUnits
   * @param {*} options
   * @constructor
   */
  function LogConcentrationGraph( solution, graphUnits, options ) {

    options = _.extend( {
      isInteractive: false,
      // scale
      scaleHeight: 100,
      minScaleWidth: 40,
      scaleYMargin: 40, // space above/below top/bottom tick marks
      scaleCornerRadius: 20,
      scaleStroke: 'black',
      scaleLineWidth: 2,
      // major ticks
      majorTickFont: new PhetFont( 22 ),
      majorTickLength: 10,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,
      majorTickXSpacing: 5,
      // minor ticks
      minorTickLength: 7,
      minorTickStroke: 'black',
      minorTickLineWidth: 1
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // background for the scale, width sized to fit
    var widestTickLabel = createTickLabel( PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min, options.majorTickFont );
    var scaleWidth = Math.max( options.minScaleWidth, widestTickLabel.width + ( 2 * options.majorTickXSpacing ) + ( 2 * options.majorTickLength ) );
    var backgroundNode = new Rectangle( 0, 0, scaleWidth, options.scaleHeight, options.scaleCornerRadius, options.scaleCornerRadius, {
      fill: new LinearGradient( 0, 0, 0, options.scaleHeight ).addColorStop( 0, 'rgb(200,200,200)' ).addColorStop( 1, 'white' ),
      stroke: options.scaleStroke,
      lineWidth: options.scaleLineWidth
    } );
    thisNode.addChild( backgroundNode );

    //TODO take advantage of DAG to reuse tick line nodes
    // tick marks
    var numberOfMajorTicks = ( PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.getLength() / 2 ) + 1; // every-other exponent
    var ySpacing = ( options.scaleHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfMajorTicks - 1 ); // vertical space between ticks
    var majorLabel, majorLineLeft, majorLineRight, minorLineLeft, minorLineRight;
    for ( var i = 0; i < numberOfMajorTicks; i++ ) {
      // major lines and label
      majorLineLeft = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      majorLineRight = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      majorLabel = createTickLabel( PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max - ( 2 * i ), options.majorTickFont );
      // rendering order
      thisNode.addChild( majorLineLeft );
      thisNode.addChild( majorLineRight );
      thisNode.addChild( majorLabel );
      // layout
      majorLineLeft.left = backgroundNode.left;
      majorLineLeft.centerY = options.scaleYMargin + ( i * ySpacing );
      majorLineRight.right = backgroundNode.right;
      majorLineRight.centerY = majorLineLeft.centerY;
      majorLabel.left = majorLineLeft.right + options.majorTickXSpacing;
      majorLabel.centerY = majorLineLeft.centerY;
      // minor lines
      if ( i !== 0 ) {
        // minor lines
        minorLineLeft = new Line( 0, 0, options.minorTickLength, 0, { stroke: options.minorTickStroke, lineWidth: options.minorTickLineWidth } );
        minorLineRight = new Line( 0, 0, options.minorTickLength, 0, { stroke: options.minorTickStroke, lineWidth: options.minorTickLineWidth } );
        // rendering order
        thisNode.addChild( minorLineLeft );
        thisNode.addChild( minorLineRight );
        // layout
        minorLineLeft.left = backgroundNode.left;
        minorLineLeft.centerY = majorLineLeft.centerY - ( ySpacing / 2 );
        minorLineRight.right = backgroundNode.right;
        minorLineRight.centerY = minorLineLeft.centerY;
      }
    }

    // indicators & associated properties
    var valueH2OProperty = new Property( null );
    var valueH3OProperty = new Property( null );
    var valueOHProperty = new Property( null );
    var h2OIndicatorNode = new H2OIndicatorNode( valueH2OProperty, {
      decimalPlaces: 0,
      constantExponent: 0,
      x: backgroundNode.right - options.majorTickLength / 2 } );
    var h3OIndicatorNode = new H3OIndicatorNode( valueH3OProperty, {
      x: backgroundNode.left + options.majorTickLength / 2,
      handleVisible: options.isInteractive,
      shadowVisible: options.isInteractive } );
    var oHIndicatorNode = new OHIndicatorNode( valueOHProperty, {
      x: backgroundNode.right - options.majorTickLength / 2,
      handleVisible: options.isInteractive,
      shadowVisible: options.isInteractive } );
    thisNode.addChild( h2OIndicatorNode );
    thisNode.addChild( h3OIndicatorNode );
    thisNode.addChild( oHIndicatorNode );

    // Given a value, compute it's y position relative to the top of the scale.
    var computeIndicatorY = function( value ) {
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

    // Update the indicators
    var updateIndicators = function() {
      var valueH2O, valueH3O, valueOH;
      if ( graphUnits.get() === GraphUnits.MOLES_PER_LITER ) {
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
      h2OIndicatorNode.y = computeIndicatorY( valueH2O );
      h3OIndicatorNode.y = computeIndicatorY( valueH3O );
      oHIndicatorNode.y = computeIndicatorY( valueOH );
      // update indicator values
      valueH2OProperty.set( valueH2O );
      valueH3OProperty.set( valueH3O );
      valueOHProperty.set( valueOH );
    };
    solution.pHProperty.link( updateIndicators.bind( thisNode ) );
    solution.volumeProperty.link( updateIndicators.bind( thisNode ) );
    graphUnits.link( updateIndicators.bind( thisNode ) );

    if ( options.isInteractive ) {
      //TODO add interactivity for H3O and OH indicators
    }
  }

  var createTickLabel = function( exponent, font ) {
    return new HTMLText( '10<span style="font-size:85%"><sup>' + exponent + '</sup></span>', { font: font, fill: 'black' } );
  };

  return inherit( Node, LogConcentrationGraph );
} );

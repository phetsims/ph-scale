// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph with a linear scale, for displaying concentration (mol/L) and quantity (moles).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var H2OIndicator = require( 'PH_SCALE/common/view/graph/H2OIndicator' );
  var H3OIndicator = require( 'PH_SCALE/common/view/graph/H3OIndicator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHIndicator = require( 'PH_SCALE/common/view/graph/OHIndicator' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Solution} solution
   * @param {Property<GraphUnits>} graphUnitsProperty
   * @param {Range} mantissaRange
   * @param {Range} exponentRange
   * @param {Property<Number>} exponentProperty
   * @param {*} options
   * @constructor
   */
  function LinearGraph( solution, graphUnitsProperty, mantissaRange, exponentRange, exponentProperty, options ) {

    options = _.extend( {
      // scale
      scaleHeight: 100,
      minScaleWidth: 80,
      scaleFill: 'white',
      scaleStroke: 'black',
      scaleLineWidth: 2,
      scaleYMargin: 20,
      // arrow at top of scale
      arrowHeight: 20,
      // major ticks
      majorTickFont: new PhetFont( 14 ),
      majorTickLength: 10,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,
      majorTickXSpacing: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    var scaleWidth = options.minScaleWidth;
    var scaleHeight = options.scaleHeight;
    var arrowWidth = 1.5 * scaleWidth;
    var arrowHeight = options.arrowHeight;

    // scale with arrow at top
    var arrowScaleNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowWidth / 2, arrowHeight )
      .lineTo( scaleWidth / 2, arrowHeight )
      .lineTo( scaleWidth / 2, scaleHeight )
      .lineTo( -scaleWidth / 2, scaleHeight )
      .lineTo( -scaleWidth / 2, arrowHeight )
      .lineTo( -arrowWidth / 2, arrowHeight )
      .close(),
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth }
    );
    thisNode.addChild( arrowScaleNode );

    // scale with no arrow
    var scaleNode = new Rectangle( -scaleWidth / 2, arrowHeight, scaleWidth, scaleHeight - arrowHeight,
      { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth }
    );
    thisNode.addChild( scaleNode );

    //TODO restrict to a maximum width
    // 'off scale' label that goes in arrow
    var offScaleNode = new Text( 'off scale', { font: new PhetFont( 14 ), fill: 'black' } );
    thisNode.addChild( offScaleNode );
    offScaleNode.centerX = arrowScaleNode.centerX;
    offScaleNode.centerY = arrowScaleNode.top + ( 0.75 * arrowHeight );

    // Create the tick marks. Correct labels will be assigned later.
    var tickLabels = [];
    var numberOfTicks = mantissaRange.getLength() + 1;
    var ySpacing = ( scaleHeight - arrowHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    var tickLabel, tickLineLeft, tickLineRight;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      // major lines and label
      tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      tickLineRight = new Line( 0, 0, options.majorTickLength, 0, { stroke: options.majorTickStroke, lineWidth: options.majorTickLineWidth } );
      tickLabel = new SubSupText( i, { font: options.majorTickFont, fill: 'black' } );
      // rendering order
      thisNode.addChild( tickLineLeft );
      thisNode.addChild( tickLineRight );
      thisNode.addChild( tickLabel );
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

    // indicators & associated properties
    var valueH2OProperty = new Property( 0 );
    var valueH3OProperty = new Property( 0 );
    var valueOHProperty = new Property( 0 );
    var h2OIndicatorNode = new H2OIndicator( valueH2OProperty, {
      decimalPlaces: 0,
      constantExponent: 0,
      x: scaleNode.right - options.majorTickLength } );
    var h3OIndicatorNode = new H3OIndicator( valueH3OProperty, {
      x: scaleNode.left + options.majorTickLength,
      isInteractive: options.isInteractive } );
    var oHIndicatorNode = new OHIndicator( valueOHProperty, {
      x: scaleNode.right - options.majorTickLength,
      isInteractive: options.isInteractive } );
    thisNode.addChild( h2OIndicatorNode );
    thisNode.addChild( h3OIndicatorNode );
    thisNode.addChild( oHIndicatorNode );

    // Given a value, compute it's y position relative to the top of the scale.
    var valueToY = function( value ) {
      var topTickValue = mantissaRange.max * Math.pow( 10, exponentProperty.get() );
      if ( value > topTickValue ) {
        // values out of range are placed in the arrow
        return offScaleNode.centerY;
      }
      else {
        return Util.linear( 0, topTickValue, tickLabels[0].centerY, tickLabels[tickLabels.length-1].centerY, value );
      }
    };

    // Update the indicators
    var updateIndicators = function() {
      var valueH2O, valueH3O, valueOH;
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
    // Move the indicators when any of these change.
    solution.pHProperty.link( updateIndicators.bind( thisNode ) );
    solution.volumeProperty.link( updateIndicators.bind( thisNode ) );
    graphUnitsProperty.link( updateIndicators.bind( thisNode ) );
    exponentProperty.link( updateIndicators.bind( thisNode ) );

    // updates the tick labels to match the exponent
    var updateTickLabels = function( exponent ) {
      var tickText;
      for ( var i = 0; i < tickLabels.length; i++ ) {
        if ( i == 0 ) {
          tickText = '0';
        }
        else if ( exponent === 0 ) {
          tickText = i;
        }
        else if ( exponent === 1 ) {
          tickText = ( 10 * i );
        }
        else {
          tickText = i + ' x 10<span style="font-size:85%"><sup>' + exponent + '</sup></span>';
        }
        tickLabels[i].text = tickText;
        tickLabels[i].centerX = scaleNode.centerX;
      }
    };

    // When the exponent changes...
    exponentProperty.link( function( exponent ) {
      // show the proper scale background (with or without arrow)
      scaleNode.visible = ( exponent === exponentRange.max );
      arrowScaleNode.visible = offScaleNode.visible = !scaleNode.visible;
      // relabel the tick marks
      updateTickLabels( exponent );
    } );
  }

  return inherit( Node, LinearGraph );
} );

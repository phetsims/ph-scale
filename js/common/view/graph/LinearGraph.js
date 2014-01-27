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
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );

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

    //TODO create the graph indicators

    var updateIndicators = function() {
      if ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER ) {
        //TODO
      }
      else {
        //TODO
      }
    };

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
      arrowScaleNode.visible = !scaleNode.visible;
      // relabel the tick marks
      updateTickLabels( exponent );
      // move the graph indicators
      updateIndicators();
    } );

    // Move the indicators when the units change
    graphUnitsProperty.link( function( graphUnits ) {
      updateIndicators();
    });
  }

  return inherit( Node, LinearGraph );
} );

// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports

  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var SCALE_Y_MARGIN = 40; // space above/below top/bottom tick marks
  var SCALE_CORNER_RADIUS = 20;
  var TICK_FONT = new PhetFont( 22 );
  var TICK_LENGTH = 10;
  var TICK_X_SPACING = 5;

  function LogConcentrationGraph( solution, scaleHeight ) {

    var thisNode = this;
    Node.call( thisNode );

    // background for the scale, width sized to fit
    var widestTickLabel = createTickLabel( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.min );
    var scaleWidth = widestTickLabel.width + ( 2 * TICK_X_SPACING ) + ( 2 * TICK_LENGTH );
    var backgroundNode = new Rectangle( 0, 0, scaleWidth, scaleHeight, SCALE_CORNER_RADIUS, SCALE_CORNER_RADIUS, {
      fill: new LinearGradient( 0, 0, 0, scaleHeight ).addColorStop( 0, 'rgb(200,200,200)' ).addColorStop( 1, 'white' ),
      stroke: 'black'
    });
    thisNode.addChild( backgroundNode );

    // tick marks
    var numberOfTicks = ( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.getLength() / 2 ) + 1; // every-other exponent
    var ySpacing = ( scaleHeight - ( 2 * SCALE_Y_MARGIN ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    var tickLabel, leftLine, rightLine;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      // nodes
      leftLine = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black' } );
      rightLine = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black' } );
      tickLabel = createTickLabel( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.max - ( 2 * i ) );
      // rendering order
      thisNode.addChild( leftLine );
      thisNode.addChild( rightLine );
      thisNode.addChild( tickLabel );
      // layout
      leftLine.left = backgroundNode.left;
      leftLine.centerY = SCALE_Y_MARGIN + ( i * ySpacing );
      rightLine.right = backgroundNode.right;
      rightLine.centerY = leftLine.centerY;
      tickLabel.left = leftLine.right + TICK_X_SPACING;
      tickLabel.centerY = leftLine.centerY;
    }

    //XXX this is a test, to be deleted
    {
      var GraphIndicatorNode = require( 'PH_SCALE/common/view/GraphIndicatorNode' );
      var H2OMoleculeNode = require( 'PH_SCALE/common/view/H2OMoleculeNode' );
      var H3OMoleculeNode = require( 'PH_SCALE/common/view/H3OMoleculeNode' );
      var OHMoleculeNode = require( 'PH_SCALE/common/view/OHMoleculeNode' );
      var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );

      thisNode.addChild( new GraphIndicatorNode( new Property( 0.000000000000012 ),
        new H3OMoleculeNode(),
        new HTMLText( 'H<sub>3</sub>O<sup>+</sup>', { font: new PhetFont( 28 ), fill: 'white' } ),
        PHScaleColors.ACIDIC,
        { pointerLocation: 'topRight', x: 5, y: 300 } ) );

      thisNode.addChild( new GraphIndicatorNode( new Property( 0.000000000000012 ),
        new OHMoleculeNode(),
        new HTMLText( 'OH<sup>-</sup>', { font: new PhetFont( 28 ), fill: 'white' } ),
        PHScaleColors.BASIC,
        { pointerLocation: 'topLeft', x: 75, y: 400 } ) );

      thisNode.addChild( new GraphIndicatorNode( new Property( 55 ),
        new H2OMoleculeNode(),
        new HTMLText( 'H<sub>2</sub>O', { font: new PhetFont( 28 ), fill: 'white' } ),
        PHScaleColors.H2O_BACKGROUND,
        { pointerLocation: 'bottomLeft', x: 75, y: 60 } ) );
    }
  }

  var createTickLabel = function( exponent ) {
    return new HTMLText( '10<span style="font-size:85%"><sup>' + exponent + '</sup></span>', { font: TICK_FONT, fill: 'black' } );
  };

  return inherit( Node, LogConcentrationGraph );
} );

// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
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

  /**
   * @param {Solution} solution
   * @param {*} options
   * @constructor
   */
  function LogConcentrationGraph( solution, options ) {

    options = _.extend( {
      scaleHeight: 100,
      minScaleWidth: 40,
      scaleYMargin: 40, // space above/below top/bottom tick marks
      scaleCornerRadius: 20,
      isInteractive: false,
      tickFont: new PhetFont( 22 ),
      tickLength: 10,
      tickXSpacing: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // background for the scale, width sized to fit
    var widestTickLabel = createTickLabel( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.min, options.tickFont );
    var scaleWidth = Math.max( options.minScaleWidth, widestTickLabel.width + ( 2 * options.tickXSpacing ) + ( 2 * options.tickLength ) );
    var backgroundNode = new Rectangle( 0, 0, scaleWidth, options.scaleHeight, options.scaleCornerRadius, options.scaleCornerRadius, {
      fill: new LinearGradient( 0, 0, 0, options.scaleHeight ).addColorStop( 0, 'rgb(200,200,200)' ).addColorStop( 1, 'white' ),
      stroke: 'black',
      lineWidth: 2
    } );
    thisNode.addChild( backgroundNode );

    // tick marks
    var numberOfTicks = ( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.getLength() / 2 ) + 1; // every-other exponent
    var ySpacing = ( options.scaleHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
    var tickLabel, leftLine, rightLine;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      // nodes
      leftLine = new Line( 0, 0, options.tickLength, 0, { stroke: 'black' } );
      rightLine = new Line( 0, 0, options.tickLength, 0, { stroke: 'black' } );
      tickLabel = createTickLabel( PHScaleConstants.CONCENTRATION_EXPONENT_RANGE.max - ( 2 * i ), options.tickFont );
      // rendering order
      thisNode.addChild( leftLine );
      thisNode.addChild( rightLine );
      thisNode.addChild( tickLabel );
      // layout
      leftLine.left = backgroundNode.left;
      leftLine.centerY = options.scaleYMargin + ( i * ySpacing );
      rightLine.right = backgroundNode.right;
      rightLine.centerY = leftLine.centerY;
      tickLabel.left = leftLine.right + options.tickXSpacing;
      tickLabel.centerY = leftLine.centerY;
    }

    // indicators & associated properties
    var concentrationH2OProperty = new Property( null );
    var concentrationH3OProperty = new Property( null );
    var concentrationOHProperty = new Property( null );
    var h2OIndicatorNode = new H2OIndicatorNode( concentrationH2OProperty, {
      x: backgroundNode.right - options.tickLength / 2 } );
    var h3OIndicatorNode = new H3OIndicatorNode( concentrationH3OProperty, {
      x: backgroundNode.left + options.tickLength / 2,
      handleVisible: options.isInteractive,
      shadowVisible: options.isInteractive } );
    var oHIndicatorNode = new OHIndicatorNode( concentrationOHProperty, {
      x: backgroundNode.right - options.tickLength / 2,
      handleVisible: options.isInteractive,
      shadowVisible: options.isInteractive } );
    thisNode.addChild( h2OIndicatorNode );
    thisNode.addChild( h3OIndicatorNode );
    thisNode.addChild( oHIndicatorNode );

    //XXX delete this block
    {
      h2OIndicatorNode.y = 60;
      h3OIndicatorNode.y = 300;
      oHIndicatorNode.y = 400;
    }

    // Move the indicators and update their values.
    var update = function() {
      concentrationH2OProperty.set( solution.getConcentrationH2O() );
      concentrationH3OProperty.set( solution.getConcentrationH3O() );
      concentrationOHProperty.set( solution.getConcentrationOH() );
      //TODO move indicators
    };
    //TODO which other properties should be linked?
    solution.pHProperty.link( update.bind( thisNode ) );

    if ( options.isInteractive ) {
      //TODO add interactivity for H3O and OH indicators
      //TODO before dragging indicators, assert && assert( solution.soluteProperty.get() === Solute.CUSTOM )
    }
  }

  var createTickLabel = function( exponent, font ) {
    return new HTMLText( '10<span style="font-size:85%"><sup>' + exponent + '</sup></span>', { font: font, fill: 'black' } );
  };

  return inherit( Node, LogConcentrationGraph );
} );

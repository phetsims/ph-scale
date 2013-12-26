// Copyright 2002-2013, University of Colorado Boulder

/**
 * The indicator that points to a value on a graph's vertical scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var POINTER_X_PERCENTAGE = 0.25;
  var POINTER_Y_PERCENTAGE = 0.3;

  //TODO pass in model element
  function GraphIndicatorNode( options ) {

    options = _.extend( {
      backgroundWidth: 150,
      backgroundHeight: 75,
      backgroundCornerRadius: 10,
      backgroundFill: 'yellow',
      backgroundStroke: 'black',
      backgroundLineWidth: 1,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 2,
      ySpacing: 2
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // Shape for the pointer at top-level. Proceed clockwise from the tip of the pointer.
    var backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -POINTER_X_PERCENTAGE * options.backgroundWidth, POINTER_Y_PERCENTAGE * options.backgroundHeight - options.backgroundCornerRadius )
      .arc( ( -POINTER_X_PERCENTAGE * options.backgroundWidth ) - options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, 0, Math.PI / 2, false )
      .lineTo( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.backgroundWidth, options.backgroundCornerRadius )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI, 1.5 * Math.PI, false )
      .close();
    var backgroundNode = new Path( backgroundShape, {
      lineWidth: options.backgroundLineWidth,
      stroke: options.backgroundStroke,
      fill: options.backgroundFill } );

    // Cutout where the value is displayed.
    var valueBackgroundNode = new Rectangle( 0, 0,
      ( ( 1 - POINTER_X_PERCENTAGE ) * options.backgroundWidth ) - ( 2 * options.backgroundXMargin ),
      0.5 * options.backgroundHeight - options.backgroundYMargin - ( options.ySpacing / 2 ),
      0.5 * options.backgroundCornerRadius, 0.5 * options.backgroundCornerRadius, {
      fill: 'white',
      stroke: 'gray'
    } );

    // Value
    var valueNode = new Text( '12345', { font: new PhetFont( 26 ), fill: 'black' } );
    //TODO scale valueNode to fit in valueBackgroundNode.

    //TODO add molecule
    //TODO add formula

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( valueBackgroundNode );
    thisNode.addChild( valueNode );

    // layout
    valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    valueNode.right = valueBackgroundNode.right - options.valueXMargin;
    valueNode.top = valueBackgroundNode.top + options.valueYMargin;
  }

  return inherit( Node, GraphIndicatorNode );
} );
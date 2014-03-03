// Copyright 2002-2013, University of Colorado Boulder

/**
 * The indicator that points to a value on a graph's vertical scale.
 * Origin is at the indicator's pointer, and the pointer can be attached to any corner of the indicator (see options.pointerLocation).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var POINTER_WIDTH_PERCENTAGE = 0.15;
  var POINTER_HEIGHT_PERCENTAGE = 0.5;

  /**
   * @param {Property<Number>} valueProperty
   * @param {Node} moleculeNode
   * @param {Node} formulaNode
   * @param {String|Color} backgroundFill
   * @param {*} options
   * @constructor
   */
  function GraphIndicator( valueProperty, moleculeNode, formulaNode, backgroundFill, options ) {

    options = _.extend( {
      scale: 0.75, // specified by design team
      pointerLocation: 'topRight', // values: topLeft, topRight, bottomLeft, bottomRight
      backgroundWidth: 160,
      backgroundHeight: 80,
      backgroundCornerRadius: 10,
      backgroundStroke: 'black',
      backgroundLineWidth: 2,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 8,
      ySpacing: 4,
      mantissaDecimalPlaces: 1,
      exponent: null, // request a specific exponent
      isInteractive: false,
      arrowFill: 'rgb(0,200,0)',
      arrowXSpacing: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // Transform shapes to support various orientations of pointer.
    var shapeMatrix;
    if ( options.pointerLocation === 'topRight' ) {
      shapeMatrix = Matrix3.identity(); // background shape will be drawn with pointer at top-right
    }
    else if ( options.pointerLocation === 'topLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, 1 );
    }
    else if ( options.pointerLocation === 'bottomRight' ) {
      shapeMatrix = Matrix3.scaling( 1, -1 );
    }
    else if ( options.pointerLocation === 'bottomLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, -1 );
    }
    else {
      throw new Error( 'unsupported options.pointerLocation: ' + options.pointerLocation );
    }

    // Background with the pointer at top-right. Proceed clockwise from the tip of the pointer.
    var backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth, ( POINTER_HEIGHT_PERCENTAGE * options.backgroundHeight ) - options.backgroundCornerRadius )
      .arc( ( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth ) - options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, 0, Math.PI / 2, false )
      .lineTo( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.backgroundWidth, options.backgroundCornerRadius )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI, 1.5 * Math.PI, false )
      .close()
      .transformed( shapeMatrix );
    var backgroundNode = new Path( backgroundShape, {
      lineWidth: options.backgroundLineWidth,
      stroke: options.backgroundStroke,
      fill: backgroundFill } );

    // Cutout where the value is displayed.
    var valueBackgroundNode = new Rectangle( 0, 0,
      ( ( 1 - POINTER_WIDTH_PERCENTAGE ) * options.backgroundWidth ) - ( 2 * options.backgroundXMargin ),
      0.5 * options.backgroundHeight - options.backgroundYMargin - ( options.ySpacing / 2 ),
      0.5 * options.backgroundCornerRadius, 0.5 * options.backgroundCornerRadius, {
        fill: 'white',
        stroke: 'gray'
      } );

    // Value, scaled to fit background height
    var valueNode = new ScientificNotationNode( valueProperty.get(), {
      font: new PhetFont( 28 ),
      fill: 'black',
      mantissaDecimalPlaces: options.mantissaDecimalPlaces,
      exponent: options.exponent
    } );
    valueNode.setScaleMagnitude( 0.7 );

    // molecule and formula, scaled to fit available height
    var moleculeAndFormula = new Node();
    moleculeAndFormula.addChild( moleculeNode );
    moleculeAndFormula.addChild( formulaNode );
    formulaNode.left = moleculeNode.right + options.xSpacing;
    formulaNode.centerY = moleculeNode.centerY;
    moleculeAndFormula.setScaleMagnitude( 0.7 );

    // double-headed arrow
    var arrowNode = new ArrowNode( 0, 0, 0, 0.75 * options.backgroundHeight, {
      doubleHead: true,
      tailWidth: 10,
      headWidth: 28,
      headHeight: 22,
      fill: options.arrowFill,
      stroke: 'black',
      lineWidth: 2
    } );

    // rendering order
    if ( options.isInteractive ) {
      thisNode.addChild( arrowNode );
    }
    thisNode.addChild( backgroundNode );
    thisNode.addChild( valueBackgroundNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( moleculeAndFormula );

    // layout, relative to backgroundNode
    if ( options.pointerLocation === 'topRight' || options.pointerLocation === 'bottomRight' ) {
      arrowNode.right = backgroundNode.left - options.arrowXSpacing;
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      arrowNode.left = backgroundNode.right + options.arrowXSpacing;
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    valueNode.centerY = valueBackgroundNode.centerY;
    arrowNode.centerY = backgroundNode.centerY;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    moleculeAndFormula.centerX = valueBackgroundNode.centerX;
    moleculeAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

    if ( options.isInteractive ) {
      thisNode.cursor = 'pointer';

      // make the entire bounds interactive, so there's no dead space between background and arrows
      thisNode.mouseArea = thisNode.touchArea = thisNode.localBounds;

      // set pickable false for nodes that don't need to be interactive, to improve performance.
      valueNode.pickable = false;
      valueBackgroundNode.pickable = false;
      moleculeAndFormula.pickable = false;
    }

    // sync with value
    valueProperty.link( function( value ) {

      // update the displayed value and center it
      valueNode.setValue( value );
      valueNode.centerX = valueBackgroundNode.centerX;
      valueNode.centerY = valueBackgroundNode.centerY;

      // disabled when value is zero
      var isEnabled = ( value !== 0 );
      thisNode.opacity = isEnabled ? 1.0 : 0.5;
      thisNode.cursor = ( isEnabled && options.isInteractive ) ? 'pointer' : 'default';
    });

    thisNode.mutate( options );
  }

  return inherit( Node, GraphIndicator );
} );
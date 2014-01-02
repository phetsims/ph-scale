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
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHUtils = require( 'PH_SCALE/common/PHUtils' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var POINTER_WIDTH_PERCENTAGE = 0.2;
  var POINTER_HEIGHT_PERCENTAGE = 0.5;

  /**
   * @param {Property<Number>} valueProperty
   * @param {Node} moleculeNode
   * @param {Node} formulaNode
   * @param {*} options
   * @constructor
   */
  function GraphIndicatorNode( valueProperty, moleculeNode, formulaNode, options ) {

    options = _.extend( {
      pointerLocation: 'topRight', // values: topLeft, topRight, bottomLeft, bottomRight
      backgroundWidth: 160,
      backgroundHeight: 80,
      backgroundCornerRadius: 10,
      backgroundFill: 'darkGray',
      backgroundStroke: 'black',
      backgroundLineWidth: 1,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 8,
      ySpacing: 4,
      precision: 2,
      shadowVisible: true,
      shadowFill: 'rgba(220,220,220,0.7)',
      shadowXOffset: 3,
      shadowYOffset: 5
    }, options );

    var thisNode = this;
    Node.call( thisNode );
    thisNode.setScaleMagnitude( 0.75 ); //TODO eliminate this?

    // Transform shapes to support various orientations of pointer.
    var backgroundShapeMatrix;
    if ( options.pointerLocation === 'topRight' ) {
      backgroundShapeMatrix = Matrix3.identity(); // background and handle shapes will be drawn with pointer at top-right
    }
    else if ( options.pointerLocation === 'topLeft' ) {
      backgroundShapeMatrix = Matrix3.scaling( -1, 1 );
    }
    else if ( options.pointerLocation === 'bottomRight' ) {
      backgroundShapeMatrix = Matrix3.scaling( 1, -1 );
    }
    else if ( options.pointerLocation === 'bottomLeft' ) {
      backgroundShapeMatrix = Matrix3.scaling( -1, -1 );
    }
    else {
      throw new Error( 'unsupported options.pointerLocation: ' + options.pointerLocation );
    }

    // Shape for the pointer at top-right. Proceed clockwise from the tip of the pointer.
    var backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth, ( POINTER_HEIGHT_PERCENTAGE * options.backgroundHeight ) - options.backgroundCornerRadius )
      .arc( ( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth ) - options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, 0, Math.PI / 2, false )
      .lineTo( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.backgroundWidth, options.backgroundCornerRadius )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI, 1.5 * Math.PI, false )
      .close()
      .transformed( backgroundShapeMatrix );
    var backgroundNode = new Path( backgroundShape, {
      lineWidth: options.backgroundLineWidth,
      stroke: options.backgroundStroke,
      fill: options.backgroundFill } );

    var shadowNode = new Path( backgroundShape, {
      fill: options.shadowFill
    });

    // Cutout where the value is displayed.
    var valueBackgroundNode = new Rectangle( 0, 0,
      ( ( 1 - POINTER_WIDTH_PERCENTAGE ) * options.backgroundWidth ) - ( 2 * options.backgroundXMargin ),
      0.5 * options.backgroundHeight - options.backgroundYMargin - ( options.ySpacing / 2 ),
      0.5 * options.backgroundCornerRadius, 0.5 * options.backgroundCornerRadius, {
        fill: 'white',
        stroke: 'gray'
      } );

    // Value, scaled to fit background height
    var valueNode = new HTMLText( '?', { font: new PhetFont( 28 ), fill: 'black' } );
    valueNode.setScaleMagnitude( 0.7 ); //TODO compute scale

    // molecule and formula, scaled to fit available height
    var moleculeAndFormula = new Node();
    moleculeAndFormula.addChild( moleculeNode );
    moleculeAndFormula.addChild( formulaNode );
    formulaNode.left = moleculeNode.right + options.xSpacing;
    formulaNode.centerY = moleculeNode.centerY;
    moleculeAndFormula.setScaleMagnitude( 0.7 ); //TODO compute scale

    // rendering order
    if ( options.shadowVisible ) {
      thisNode.addChild( shadowNode );
    }
    thisNode.addChild( backgroundNode );
    thisNode.addChild( valueBackgroundNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( moleculeAndFormula );

    // layout
    shadowNode.x = backgroundNode.x + options.shadowXOffset;
    shadowNode.y = backgroundNode.y + options.shadowYOffset;
    if ( options.pointerLocation === 'topRight' || options.pointerLocation === 'bottomRight' ) {
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    moleculeAndFormula.centerX = valueBackgroundNode.centerX;
    moleculeAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

    // sync with value
    valueProperty.link( function( value ) {
      valueNode.text = PHUtils.toTimesTenString( value, options.precision );
      valueNode.centerX = valueBackgroundNode.centerX;
      valueNode.centerY = valueBackgroundNode.centerY;
    });

    thisNode.mutate( options );
  }

  return inherit( Node, GraphIndicatorNode );
} );
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
   * @param {String|Color} backgroundFill
   * @param {*} options
   * @constructor
   */
  function GraphIndicatorNode( valueProperty, moleculeNode, formulaNode, backgroundFill, options ) {

    options = _.extend( {
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
      decimalPlaces: 1,
      constantExponent: null,
      isInteractive: false,
      shadowFill: 'rgba(200,200,200,0.6)',
      shadowXOffset: 4,
      shadowYOffset: 6
    }, options );

    var thisNode = this;
    Node.call( thisNode );
    thisNode.setScaleMagnitude( 0.75 ); //TODO eliminate this?

    // Transform shapes to support various orientations of pointer.
    var shapeMatrix;
    if ( options.pointerLocation === 'topRight' ) {
      shapeMatrix = Matrix3.identity(); // background and handle shapes will be drawn with pointer at top-right
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

    // Optional background shadow
    var backgroundShadowNode = new Path( backgroundShape, {
      fill: options.shadowFill
    });

    //TODO make this shape look more like the mockups?
    // Optional handle
    var handleWidth = 0.15 * options.backgroundWidth;
    var handleHeight = 0.7 * options.backgroundHeight;
    var handleThickness = 0.1 * options.backgroundHeight;
    var handleRadius = 0.5 * handleThickness;
    var handleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -handleWidth + handleThickness/2, 0 )
      .arc( -handleWidth + handleThickness/2, handleThickness/2, handleRadius, -Math.PI/2, -Math.PI, true )
      .lineTo( -handleWidth, handleHeight - handleThickness/2 )
      .arc( -handleWidth + handleThickness/2, handleHeight - handleThickness/2, handleRadius, Math.PI, Math.PI/2, true )
      .lineTo( 0, handleHeight )
      .lineTo( 0, handleHeight - handleThickness )
      .lineTo( -handleWidth + 1.5 * handleThickness, handleHeight - handleThickness )
      .arc( -handleWidth + 1.5 * handleThickness, handleHeight - 1.5 * handleThickness, handleRadius, Math.PI/2, Math.PI, false )
      .lineTo( -handleWidth + handleThickness, 1.5 * handleThickness )
      .arc( -handleWidth + 1.5 * handleThickness, 1.5 * handleThickness, handleRadius, -Math.PI, -Math.PI/2, false )
      .lineTo( 0, handleThickness )
      .close().
      transformed( shapeMatrix );
    var handleNode = new Path( handleShape, {
      fill: 'rgb(240,240,240)', //TODO use a gradient to make it look like brushed metal?
      stroke: 'black',
      lineWidth: 1
    });

    // Optional handle shadow
    var handleShadowNode = new Path( handleShape, {
      fill: options.shadowFill
    });

    // Invisible rectangle over the handle, so that the hole between the handle and background isn't a 'dead zone' for interactivity.
    var handleOverlay = new Rectangle( 0, 0, handleWidth, handleHeight );

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
    if ( options.isInteractive ) {
      thisNode.cursor = 'pointer';
      // interactive indicators get a drop-shadow and handle
      thisNode.addChild( backgroundShadowNode );
      thisNode.addChild( handleShadowNode );
      thisNode.addChild( handleNode );
      thisNode.addChild( handleOverlay );
    }
    thisNode.addChild( backgroundNode );
    thisNode.addChild( valueBackgroundNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( moleculeAndFormula );

    // layout, relative to backgroundNode
    backgroundShadowNode.right = backgroundNode.right + options.shadowXOffset;
    backgroundShadowNode.bottom = backgroundNode.bottom + options.shadowYOffset;
    if ( options.pointerLocation === 'topRight' || options.pointerLocation === 'bottomRight' ) {
      handleNode.right = backgroundNode.left + 1;
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      handleNode.left = backgroundNode.right - 1;
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    handleNode.centerY = backgroundNode.centerY;
    handleOverlay.left = handleNode.left;
    handleOverlay.top = handleNode.top;
    handleShadowNode.right = handleNode.right + options.shadowXOffset;
    handleShadowNode.bottom = handleNode.bottom + options.shadowYOffset;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    moleculeAndFormula.centerX = valueBackgroundNode.centerX;
    moleculeAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

    // only backgroundNode and handleOverlay need to be pickable, set pickable false for other nodes to improve performance.
    backgroundShadowNode.pickable = false;
    handleNode.pickable = false;
    handleShadowNode.pickable = false;
    valueNode.pickable = false;
    valueBackgroundNode.pickable = false;
    moleculeAndFormula.pickable = false;

    // sync with value
    valueProperty.link( function( value ) {

      // update the displayed value and center it
      valueNode.text = PHUtils.toTimesTenString( value, options.decimalPlaces, options.constantExponent );
      valueNode.centerX = valueBackgroundNode.centerX;
      valueNode.centerY = valueBackgroundNode.centerY;

      // disabled when value is zero
      var isEnabled = ( value != 0 );
      thisNode.opacity = isEnabled ? 1.0 : 0.5;
      thisNode.cursor = ( isEnabled && options.isInteractive ) ? 'pointer' : 'default';
    });

    thisNode.mutate( options );
  }

  return inherit( Node, GraphIndicatorNode );
} );
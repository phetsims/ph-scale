// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Solutions' screen.
 * Origin is at top left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PHScaleNode = require( 'PH_SCALE/common/view/PHScaleNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var SCALE_SIZE = new Dimension2( 55, 450 );
  var DISPLAY_COLOR = 'rgb(135,19,70)';
  var DISPLAY_X_MARGIN = 14;
  var DISPLAY_Y_MARGIN = 10;
  var DISPLAY_CORNER_RADIUS = 12;
  var PH_LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * What is a bit odd is that button is only visible while the meter is expanded,
   * and a totally separate expand/collapse bar is shown when the meter is collapsed.
   * But hey, that's what they wanted.
   *
   * @param {Property<Number>} pHProperty
   * @param {Property<Boolean>} expandedProperty
   * @constructor
   */
  function ValueNode( pHProperty, expandedProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH value
    var valueNode = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), DISPLAY_CORNER_RADIUS, DISPLAY_CORNER_RADIUS,
      { fill: 'white' } );

    // label above the value
    var labelNode = new Text( pHString, { fill: 'white', font: PH_LABEL_FONT } );

    // background
    var backgroundYSpacing = 6;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * DISPLAY_X_MARGIN );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * DISPLAY_Y_MARGIN );
    var backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, DISPLAY_CORNER_RADIUS, DISPLAY_CORNER_RADIUS,
      { fill: DISPLAY_COLOR } );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH, expandedProperty );

    // rendering order
    thisNode.addChild( backgroundRectangle );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = backgroundRectangle.top + DISPLAY_Y_MARGIN;
    valueRectangle.centerX = backgroundRectangle.centerX;
    labelNode.left = valueRectangle.left;
    valueRectangle.top = labelNode.bottom + backgroundYSpacing;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;
    expandCollapseButton.centerY = labelNode.centerY;
    expandCollapseButton.right = valueRectangle.right;

    // pH value
    pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueNode.text = stringNoValue;
        valueNode.centerX = valueRectangle.centerX; // center justified
      }
      else {
        valueNode.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueNode.right = valueRectangle.right - valueXMargin; // right justified
      }
    } );
  }

  inherit( Node, ValueNode );

  /**
   * Arrow and dashed line that points to a value on the pH scale.
   * @param {Property<Number>} scaleWidth
   * @constructor
   */
  function PointerNode( scaleWidth ) {

    var thisNode = this;
    Node.call( thisNode );

    // dashed line that extends across the scale
    var lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // arrow head pointing at the scale
    var arrowSize = new Dimension2( 21, 28 );
    var arrowNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowSize.width, -arrowSize.height / 2 )
      .lineTo( arrowSize.width, arrowSize.height / 2 )
      .close(),
      { fill: 'black' } );

    // rendering order
    thisNode.addChild( arrowNode );
    thisNode.addChild( lineNode );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
  }

  inherit( Node, PointerNode );

  /**
   * @param {Property<Number>} pHProperty
   * @param {*} options
   * @constructor
   */
  function SolutionsPHMeterNode( pHProperty, options ) {

    options = _.extend( { expanded: true }, options );

    var thisNode = this;
    Node.call( thisNode );

    var expandedProperty = new Property( options.expanded );

    // nodes
    var valueNode = new ValueNode( pHProperty, expandedProperty );
    var expandCollapseBar = new ExpandCollapseBar(
      new Text( pHString, { font: PH_LABEL_FONT, fill: 'white' } ),
      expandedProperty, {
        barWidth: valueNode.width,
        cornerRadius: DISPLAY_CORNER_RADIUS,
        titleFont: PH_LABEL_FONT,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH,
        xMargin: DISPLAY_X_MARGIN,
        yMargin: DISPLAY_Y_MARGIN
      } );
    var verticalLineNode = new Line( 0, 0, 0, 25, { stroke: 'black', lineWidth: 5 } );
    var scaleNode = new PHScaleNode( { size: SCALE_SIZE } );
    var pointerNode = new PointerNode( SCALE_SIZE.width );

    // rendering order
    var meterNode = new Node( { children:[ verticalLineNode, valueNode, scaleNode, pointerNode ] } );
    thisNode.addChild( expandCollapseBar );
    thisNode.addChild( meterNode );

    // layout
    verticalLineNode.centerX = scaleNode.right - ( SCALE_SIZE.width / 2 );
    verticalLineNode.bottom = scaleNode.top + 1;
    valueNode.centerX = verticalLineNode.centerX;
    valueNode.bottom = verticalLineNode.top + 1;
    expandCollapseBar.centerX = valueNode.centerX;
    expandCollapseBar.top = valueNode.top;
    pointerNode.x = scaleNode.right - SCALE_SIZE.width;
    // pointerNode.centerY is set dynamically

    // move the pointer to the pH value
    pHProperty.link( function( value ) {
      pointerNode.visible = ( value !== null );
      pointerNode.centerY = scaleNode.top + ( scaleNode.getBackgroundStrokeWidth() / 2 ) +
                            Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    } );

    expandedProperty.link( function( expanded ) {
       meterNode.visible = expanded;
      expandCollapseBar.visible = !expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, SolutionsPHMeterNode );
} );

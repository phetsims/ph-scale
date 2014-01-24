// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Solutions' screen.
 * Origin is at top left.
 * The meter can be expanded and collapsed, but is otherwise not interactive.
 * Ticks marks on the meter's scale are intended to be aligned with tick marks on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var X_SPACING = 14;
  var Y_SPACING = 10;
  var CORNER_RADIUS = 12;

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * This button also causes the ValueNode to show/hide the value.
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
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
      { fill: 'white', stroke: 'darkGray' } );

    // label above the value
    var labelNode = new Text( pHString, { fill: 'black', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // expanded background
    var backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * X_SPACING );
    var expandedHeight = labelNode.height + valueRectangle.height + ( 3 * Y_SPACING );
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * Y_SPACING );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH, expandedProperty );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = expandedRectangle.top + Y_SPACING;
    valueRectangle.centerX = expandedRectangle.centerX;
    labelNode.left = valueRectangle.left;
    valueRectangle.top = labelNode.bottom + Y_SPACING;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;
    expandCollapseButton.centerY = labelNode.centerY;
    expandCollapseButton.right = valueRectangle.right;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = valueRectangle.visible = valueNode.visible = expanded;
      collapsedRectangle.visible = !expanded;
    } );

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
   * @param {Property<Number>} pHProperty
   * @param {Number} scaleBottom y-offset of the bottom of the scale, in this node's coordinate frame
   * @param {Number} scaleTop y-offset of the top of the scale, in this node's coordinate frame
   * @param {*} options
   * @constructor
   */
  function SolutionsPHMeterNode( pHProperty, scaleBottom, scaleTop, options ) {

    options = _.extend( { expanded: true }, options );

    var thisNode = this;
    Node.call( thisNode );

    var expandedProperty = new Property( options.expanded );

    // nodes
    var valueNode = new ValueNode( pHProperty, expandedProperty );
    //TODO add probe

    // rendering order
    var meterNode = new Node( { children:[ valueNode ] } );
    thisNode.addChild( meterNode );
    //TODO thisNode.addChild( probeNode );

    // layout
    //TODO position probe

    expandedProperty.link( function( expanded ) {
      //TODO probeNode.visible = expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, SolutionsPHMeterNode );
} );

// Copyright 2002-2014, University of Colorado Boulder

//TODO add spinners
/**
 * Component for displaying and changing the pH value of a 'custom' solution.
 * The meter can be expanded and collapsed (to show/hide the value), and the pH value can be changed using spinners.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var DISPLAY_X_SPACING = 14;
  var DISPLAY_Y_SPACING = 10;
  var DISPLAY_CORNER_RADIUS = 12;
  var PH_LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Property<Number>} pHProperty
   * @param {Property<Boolean>} expandedProperty optional
   * @constructor
   */
  function CustomPHMeterNode( pHProperty, options ) {

    options = _.extend( { expanded: true }, options )

    var thisNode = this;
    Node.call( thisNode );

    // pH value
    var valueNode = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var cornerRadius = 12;
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), cornerRadius, cornerRadius,
      { fill: 'white', stroke: 'darkGray' } );

    // label above the value
    var labelNode = new Text( pHString, { fill: 'black', font: PH_LABEL_FONT } );

    // expanded background
    var backgroundOptions = { fill: 'rgb(222,222,222)', stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * DISPLAY_X_SPACING );
    var expandedHeight = labelNode.height + valueRectangle.height + ( 3 * DISPLAY_Y_SPACING );
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, cornerRadius, cornerRadius, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * DISPLAY_Y_SPACING );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, DISPLAY_CORNER_RADIUS, DISPLAY_CORNER_RADIUS, backgroundOptions );

    // expand/collapse button
    var expandedProperty = new Property( options.expanded );
    var expandCollapseButton = new ExpandCollapseButton( PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH, expandedProperty );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = expandedRectangle.top + DISPLAY_Y_SPACING;
    valueRectangle.centerX = expandedRectangle.centerX;
    labelNode.left = valueRectangle.left;
    valueRectangle.top = labelNode.bottom + DISPLAY_Y_SPACING;
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

    thisNode.mutate( options );
  }

  return inherit( Node, CustomPHMeterNode );
} );

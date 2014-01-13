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
  var DISPLAY_X_MARGIN = 14;
  var DISPLAY_Y_MARGIN = 10;
  var DISPLAY_CORNER_RADIUS = 12;
  var PH_LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Property<Number>} pHProperty
   * @param {Property<Boolean>} expandedProperty optional
   * @constructor
   */
  function MeterNode( pHProperty, expandedProperty ) {

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

    // background
    var backgroundYSpacing = 6;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * DISPLAY_X_MARGIN );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * DISPLAY_Y_MARGIN );
    var backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: 'rgb(222,222,222)', stroke: 'black', lineWidth: 2 } );

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
  
  inherit( Node, MeterNode );

  /**
   * @param {Property<Number>} pHProperty
   * @param {*} options
   * @constructor
   */
  function CustomPHMeterNode( pHProperty, options ) {

    options = _.extend( { expanded: true }, options );

    var thisNode = this;
    Node.call( thisNode );

    var expandedProperty = new Property( options.expanded );

    var meterNode = new MeterNode( pHProperty, expandedProperty );
    var expandCollapseBar = new ExpandCollapseBar(
      new Text( pHString, { font: PH_LABEL_FONT, fill: 'black' } ),
      expandedProperty, {
        barLineWidth: 2,
        barWidth: meterNode.width,
        cornerRadius: DISPLAY_CORNER_RADIUS,
        titleFont: PH_LABEL_FONT,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH,
        xMargin: DISPLAY_X_MARGIN,
        yMargin: DISPLAY_Y_MARGIN
      } );

    thisNode.addChild( meterNode );
    thisNode.addChild( expandCollapseBar );

    expandedProperty.link( function( expanded ) {
      meterNode.visible = expanded;
      expandCollapseBar.visible = !expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, CustomPHMeterNode );
} );

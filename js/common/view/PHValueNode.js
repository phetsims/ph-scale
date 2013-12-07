// Copyright 2002-2013, University of Colorado Boulder

/**
 * Displays pH value on a big bulky background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  /**
   * @param {Property<Number>} pHProperty
   * @constructor
   */
  function PHValueNode( pHProperty ) {

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
      { fill: 'white' } );

    // label above the value
    var labelNode = new Text( pHString,
      { fill: 'white', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // background
    var backgroundXMargin = 14;
    var backgroundYMargin = 10;
    var backgroundYSpacing = 6;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * backgroundXMargin );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    this.backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: 'rgb(135,25,75)' } );

    // highlight around the background, effectively stroked inside the background shape
    var highlightLineWidth = 4;
    var outerHighlight = new Rectangle( highlightLineWidth / 2, highlightLineWidth / 2, backgroundWidth - highlightLineWidth, backgroundHeight - highlightLineWidth, cornerRadius, cornerRadius,
      { stroke: 'black', lineWidth: highlightLineWidth } );
    var innerHighlight = new Rectangle( highlightLineWidth, highlightLineWidth, backgroundWidth - (2 * highlightLineWidth), backgroundHeight - (2 * highlightLineWidth), cornerRadius, cornerRadius,
      { stroke: 'white', lineWidth: highlightLineWidth } );
    var highlight = new Node( { children: [ innerHighlight, outerHighlight ], visible: false } );

    // rendering order
    thisNode.addChild( this.backgroundRectangle );
    thisNode.addChild( highlight );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( valueNode );

    // layout
    labelNode.centerX = this.backgroundRectangle.centerX;
    labelNode.top = this.backgroundRectangle.top + backgroundYMargin;
    valueRectangle.centerX = this.backgroundRectangle.centerX;
    valueRectangle.top = labelNode.bottom + backgroundYSpacing;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;

    // pH value
    pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueNode.text = stringNoValue;
        valueNode.centerX = valueRectangle.centerX; // center justified
        highlight.visible = false;
      }
      else {
        valueNode.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueNode.right = valueRectangle.right - valueXMargin; // right justified
        highlight.visible = ( parseFloat( valueNode.text ) === 7 );
      }
    } );
  }

  return inherit( Node, PHValueNode, {
    setBackgroundFill: function( fill ) {
      this.backgroundRectangle.fill = fill;
    }
  } );
} );

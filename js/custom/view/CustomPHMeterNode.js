// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Custom' screen.
 * Origin is at top left.
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
   * @param {PHMeter} meter
   * @param {Solution} solution
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function CustomPHMeterNode( meter, solution, mvt ) {
    var thisNode = this;
    Node.call( thisNode );

    var labelNode = new Text( pHString,
      { fill: 'white', font: new PhetFont( 28 ) } );

    var valueNode = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    var valueXMargin = 8;
    var valueYMargin = 5;
    var cornerRadius = 12;
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), cornerRadius, cornerRadius,
      { fill: 'white', stroke: 'black' } );

    var backgroundXMargin = 14;
    var backgroundYMargin = 7;
    var backgroundYSpacing = 4;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * backgroundXMargin );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    var backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: 'rgb(114,9,56)', stroke: 'black' } );

    // rendering order
    thisNode.addChild( backgroundRectangle );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( valueNode );

    // layout
    labelNode.centerX = backgroundRectangle.centerX;
    labelNode.top = backgroundRectangle.top + backgroundYMargin;
    valueRectangle.centerX = backgroundRectangle.centerX;
    valueRectangle.top = labelNode.bottom + backgroundYSpacing;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;

    // location
    meter.body.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // pH value
    solution.pHProperty.link( function( pH ) {
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

  return inherit( Node, CustomPHMeterNode );
} );

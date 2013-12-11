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
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PHScaleNode = require( 'PH_SCALE/common/view/PHScaleNode' );
  var PHValueNode = require( 'PH_SCALE/common/view/PHValueNode' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  // constants
  var SCALE_SIZE = new Dimension2( 55, 450 );

  //TODO this could be used by BasicsPHMeterNode.IndicatorNode
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
   * @constructor
   */
  function SolutionsPHMeterNode( pHProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new PHValueNode( pHProperty );
    var verticalLineNode = new Line( 0, 0, 0, 25, { stroke: 'black', lineWidth: 5 } );
    var scaleNode = new PHScaleNode( { size: SCALE_SIZE } );
    var pointerNode = new PointerNode( SCALE_SIZE.width );

    // rendering order
    thisNode.addChild( verticalLineNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( scaleNode );
    thisNode.addChild( pointerNode );

    // layout
    verticalLineNode.centerX = scaleNode.right - ( SCALE_SIZE.width / 2 );
    verticalLineNode.bottom = scaleNode.top + 1;
    valueNode.centerX = verticalLineNode.centerX;
    valueNode.bottom = verticalLineNode.top + 1;
    pointerNode.x = scaleNode.right - SCALE_SIZE.width;
    // pointerNode.centerY is set dynamically

    // move the pointer to the pH value
    pHProperty.link( function( value ) {
      pointerNode.visible = ( value !== null );
      pointerNode.centerY = scaleNode.top + ( scaleNode.getBackgroundStrokeWidth() / 2 ) +
                            Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    } );
  }

  return inherit( Node, SolutionsPHMeterNode );
} );

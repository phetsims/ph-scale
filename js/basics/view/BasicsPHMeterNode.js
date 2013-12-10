// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Basics' screen.
 * <p/>
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * <ul>
 * <li>solution in the beaker
 * <li>output of the water faucet
 * <li>output of the drain faucet
 * <li>output of the dropper
 * </ul>
 * <p/>
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MeterBodyNode = require( 'SCENERY_PHET/MeterBodyNode' );
  var MovableDragHandler = require( 'PH_SCALE/common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PHScaleNode = require( 'PH_SCALE/common/view/PHScaleNode' );
  var PHValueNode = require( 'PH_SCALE/common/view/PHValueNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var probeImage = require( 'image!PH_SCALE/pH-meter-probe.png' );

  // constants
  var SCALE_SIZE = new Dimension2( 55, 450 );
  var INDICATOR_ENABLED_COLOR = 'rgb(114,9,56)';
  var INDICATOR_DISABLED_COLOR = 'rgba(0,0,0,0.3)';

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} mvt
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( probe, mvt, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    // probe image file
    var imageNode = new Image( probeImage );
    thisNode.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -radius;
    imageNode.y = -radius;

    // probe location
    probe.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // touch area
    var dx = 0.25 * imageNode.width;
    var dy = 0.25 * imageNode.height;
    thisNode.touchArea = Shape.rectangle( imageNode.x - dx, imageNode.y - dy, imageNode.width + dx + dx, imageNode.height + dy + dy );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( probe, mvt ) );

    var isInNode = function( node ) {
      return node.getBounds().containsPoint( probe.locationProperty.get() );
    };

    thisNode.isInSolution = function() {
      return isInNode( solutionNode );
    };

    thisNode.isInWater = function() {
      return isInNode( waterFluidNode );
    };

    thisNode.isInDrainFluid = function() {
      return isInNode( drainFluidNode );
    };

    thisNode.isInDropperSolution = function() {
      return isInNode( dropperFluidNode );
    };
  }

  inherit( Node, ProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Vector2} bodyLocation
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( bodyLocation, probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, new Shape(), {
      stroke: 'rgb(80,80,80)',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    var updateCurve = function() {

      var scaleCenterX = bodyNode.x + ( SCALE_SIZE.width / 2 );

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( scaleCenterX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.left, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 400, probeNode.left - scaleCenterX ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( -50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    probe.locationProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  /**
   * pH indicator that slides vertically along scale.
   * When there is no pH value, it points to 'neutral' but does not display a value.
   * @param {Property<Number>} pHProperty
   * @param {Number} scaleWidth
   * @constructor
   */
  function IndicatorNode( pHProperty, scaleWidth ) {

    var thisNode = this;
    Node.call( thisNode );

    // dashed line that extends across the scale
    var lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // value
    var valueNode = new PHValueNode( pHProperty );

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
    thisNode.addChild( valueNode );
    thisNode.addChild( lineNode );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
    valueNode.left = arrowNode.right - 1; // overlap to hide seam
    valueNode.centerY = arrowNode.centerY;

    pHProperty.link( function( pH ) {
      // make the indicator look enabled or disabled
      var enabled = ( pH !== null );
      valueNode.setBackgroundFill(  ( enabled ? INDICATOR_ENABLED_COLOR : INDICATOR_DISABLED_COLOR ) );
      arrowNode.visible = lineNode.visible = enabled;
    } );
  }

  inherit( Node, IndicatorNode );

  /**
   * @param {PHMeter} meter
   * @param {Solution} solution
   * @param {Water} water
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BasicsPHMeterNode( meter, solution, water, dropper, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH scale, positioned at meter 'body' location
    var scaleNode = new PHScaleNode( { labelNeutral: true, size: SCALE_SIZE } );
    scaleNode.translation = mvt.modelToViewPosition( meter.bodyLocation );

    // indicator that slides vertically along scale
    var indicatorNode = new IndicatorNode( meter.valueProperty, SCALE_SIZE.width );
    scaleNode.addChild( indicatorNode ); // child of scaleNode, so that it's in the proper coordinate frame
    meter.valueProperty.link( function( value ) {
      indicatorNode.centerY = Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    } );

    var probeNode = new ProbeNode( meter.probe, mvt, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.bodyLocation, meter.probe, scaleNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( scaleNode );
    thisNode.addChild( probeNode );

    var updateValue = function() {
      var value;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        value = solution.pHProperty.get();
      }
      else if ( probeNode.isInWater() ) {
        value = water.pH;
      }
      else if ( probeNode.isInDropperSolution() ) {
        value = dropper.soluteProperty.get().pHProperty.get();
      }
      else {
        value = null;
      }
      meter.valueProperty.set( value );
    };
    meter.probe.locationProperty.link( updateValue );
    solution.soluteProperty.link( updateValue );
    solution.pHProperty.link( updateValue );
    solutionNode.addEventListener( 'bounds', updateValue );
    dropperFluidNode.addEventListener( 'bounds', updateValue );
    waterFluidNode.addEventListener( 'bounds', updateValue );
    drainFluidNode.addEventListener( 'bounds', updateValue );
  }

  return inherit( Node, BasicsPHMeterNode );
} );

// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter, with probe.
 * <p/>
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * <ul>
 * <li>solution in the beaker
 * <li>output of the solvent faucet
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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeterBodyNode = require( 'SCENERY_PHET/MeterBodyNode' );
  var MovableDragHandler = require( 'PH_SCALE/common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );

  // images
  var bodyLeftImage = require( 'image!PH_SCALE/concentration-meter-body-left.png' );
  var bodyCenterImage = require( 'image!PH_SCALE/concentration-meter-body-center.png' );
  var bodyRightImage = require( 'image!PH_SCALE/concentration-meter-body-right.png' );
  var probeImage = require( 'image!PH_SCALE/concentration-meter-probe.png' );

  // constants
  var BODY_IS_DRAGGABLE = true;
  var NO_VALUE = '-';
  var TITLE_TOP = 15; // specific to bodyCenterImage
  var TEXT_X_MARGIN = 35;  // specific to bodyCenterImage
  var VALUE_X_MARGIN = 30; // specific to bodyCenterImage
  var VALUE_CENTER_Y = 84; // specific to bodyCenterImage

  /**
   * Meter body, origin at upper left.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BodyNode( meter, mvt ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    // text nodes
    var titleNode = new Text( pHString, { font: new PhetFont( 18 ), fill: 'white' } );
    var valueNode = new Text( ( 10 ).toFixed( PHScaleConstants.PH_DECIMAL_PLACES ), { font: new PhetFont( 24 ), fill: 'black' } );

    // create a background that fits the text
    var bodyWidth = Math.max( titleNode.width, valueNode.width ) + ( 2 * TEXT_X_MARGIN );
    var backgroundNode = new MeterBodyNode( bodyWidth, bodyLeftImage, bodyCenterImage, bodyRightImage );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( valueNode );

    // layout
    titleNode.centerX = backgroundNode.centerX;
    titleNode.top = TITLE_TOP;
    valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
    valueNode.centerY = VALUE_CENTER_Y;

    if ( BODY_IS_DRAGGABLE ) {
      thisNode.addInputListener( new MovableDragHandler( meter.body, mvt ) );
    }

    // body location
    meter.body.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // displayed value
    meter.valueProperty.link( function( value ) {
      if ( !value || value === NaN ) {
        valueNode.setText( NO_VALUE );
        valueNode.centerX = backgroundNode.centerX; // center justified
      }
      else {
        valueNode.setText( value.toFixed( PHScaleConstants.PH_METER_DECIMAL_PLACES ) );
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    } );
  }

  inherit( Node, BodyNode );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} mvt
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( probe, mvt, solutionNode, dropperFluidNode, solventFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: 'pointer'
    } );

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

    thisNode.isInSolvent = function() {
      return isInNode( solventFluidNode );
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
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, new Shape(), {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    var updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( 50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.locationProperty.link( updateCurve );
    probe.locationProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  /**
   * @param {PHMeter} meter
   * @param {Solution} solution
   * @param {Solvent} solvent
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PHMeterNode( meter, solution, solvent, dropper, solutionNode, dropperFluidNode, solventFluidNode, drainFluidNode, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( meter, mvt );
    var probeNode = new ProbeNode( meter.probe, mvt, solutionNode, dropperFluidNode, solventFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );

    var updateValue = function() {
      var value;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        value = solution.pHProperty.get();
      }
      else if ( probeNode.isInSolvent() ) {
        value = solvent.pH;
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
    solventFluidNode.addEventListener( 'bounds', updateValue );
    drainFluidNode.addEventListener( 'bounds', updateValue );
  }

  return inherit( Node, PHMeterNode );
} );

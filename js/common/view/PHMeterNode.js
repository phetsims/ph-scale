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
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MeterBodyNode = require( 'SCENERY_PHET/MeterBodyNode' );
  var MovableDragHandler = require( 'PH_SCALE/common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var acidicString = require( 'string!PH_SCALE/acidic' );
  var basicString = require( 'string!PH_SCALE/basic' );
  var neutralString = require( 'string!PH_SCALE/neutral' );
  var pattern_pH_0value = require( 'string!PH_SCALE/pattern.ph.0value' );

  // images
  var probeImage = require( 'image!PH_SCALE/pH-meter-probe.png' );

  // constants
  var SCALE_SIZE = new Dimension2( 75, 450 );
  var TICK_LENGTH = 15;
  var NEUTRAL_TICK_LENGTH = 45;
  var TICK_LABEL_X_SPACING = 5;

  /**
   * The body of the meter includes the Acidic-Basic vertical scale,
   * and the indicator that points to a value on the scale.
   * @param meter
   * @param mvt
   * @constructor
   */
  function BodyNode( meter, mvt ) {

    var thisNode = this;
    Node.call( this );

    // gradient background
    var backgroundNode = new Rectangle( 0, 0, SCALE_SIZE.width, SCALE_SIZE.height, {
      fill: new LinearGradient( 0, 0, 0, SCALE_SIZE.height )
            .addColorStop( 0, PHScaleColors.OH )
            .addColorStop( 1, PHScaleColors.H3O ),
      stroke: 'black',
      lineWidth: 2
    } );
    thisNode.addChild( backgroundNode );

    // 'Acidic' label
    var textOptions = { fill: 'white', font: new PhetFont( 40 ) };
    var acidicNode = new Text( acidicString, textOptions );
    acidicNode.rotation = -Math.PI / 2;
    acidicNode.centerX = backgroundNode.centerX;
    acidicNode.centerY = 0.75 * backgroundNode.height;
    thisNode.addChild( acidicNode );

    // 'Basic' label
    var basicNode = new Text( basicString, textOptions );
    basicNode.rotation = -Math.PI / 2;
    basicNode.centerX = backgroundNode.centerX;
    basicNode.centerY = 0.25 * backgroundNode.height;
    thisNode.addChild( basicNode );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    var y = SCALE_SIZE.height;
    var dy = -SCALE_SIZE.height / PHScaleConstants.PH_RANGE.getLength();
    var tickFont = new PhetFont( 28 );
    for ( var pH = PHScaleConstants.PH_RANGE.min; pH <= PHScaleConstants.PH_RANGE.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        var lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.left = backgroundNode.right;
        lineNode.centerY = y;
        thisNode.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          var tickLabelNode = new Text( pH, { font: tickFont } );
          tickLabelNode.left = lineNode.right + TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = lineNode.centerY;
          thisNode.addChild( tickLabelNode );
        }
      }
      y += dy;
    }

    // 'Neutral' line
    var neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
    neutralLineNode.left = backgroundNode.right;
    neutralLineNode.centerY = SCALE_SIZE.height / 2;
    thisNode.addChild( neutralLineNode );
    var neutralLabelNode = new Text( neutralString, { font: new PhetFont( 28 ) } );
    neutralLabelNode.left = neutralLineNode.right + TICK_LABEL_X_SPACING;
    neutralLabelNode.centerY = neutralLineNode.centerY;
    thisNode.addChild( neutralLabelNode );

    // indicator
    var indicatorNode = new IndicatorNode( meter );
    indicatorNode.right = backgroundNode.right;
    thisNode.addChild( indicatorNode );

    // location of the scale
    meter.body.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // move the indicator to point to the proper value on the scale
    meter.valueProperty.link( function( value ) {
      indicatorNode.centerY = Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    });
  }

  inherit( Node, BodyNode );

  /**
   * pH indicator that slides vertically along scale.
   * When there is no pH value, it points to 'neutral' but does not display a value.
   * @param meter
   * @constructor
   */
  function IndicatorNode( meter ) {

    var thisNode = this;
    Node.call( thisNode );

    var lineNode = new Line( 0, 0, SCALE_SIZE.width, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );
    thisNode.addChild( lineNode );

    var arrowNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( -21, -14 )
      .lineTo( -21, 14 )
      .close(), {
        fill: 'black'
    } );
    arrowNode.right = lineNode.left - 5;
    thisNode.addChild( arrowNode );

    var pHValueNode = new Text( '0', { font: new PhetFont( 28 ) } );
    thisNode.addChild( pHValueNode );

    meter.valueProperty.link( function( value ) {
      // value
      pHValueNode.text = value ? StringUtils.format( pattern_pH_0value, ( Util.toFixed( value, PHScaleConstants.PH_METER_DECIMAL_PLACES ) ) ) : "";
      pHValueNode.right = arrowNode.left - 3;
      pHValueNode.centerY = arrowNode.centerY;
      pHValueNode.centerY = arrowNode.centerY;
      // gray out the arrow?
      arrowNode.fill = ( value ? 'black' : 'rgba(0,0,0,0.3)' );
      // hide the line?
      lineNode.visible = ( value ? true : false );
    } );
  }

  inherit( Node, IndicatorNode );

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
    var indicatorNode = new IndicatorNode( meter, bodyNode );
    var probeNode = new ProbeNode( meter.probe, mvt, solutionNode, dropperFluidNode, solventFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( indicatorNode );
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

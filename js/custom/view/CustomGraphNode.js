// Copyright 2002-2013, University of Colorado Boulder

//TODO lots of duplication with SolutionsGraphNode
/**
 * The graph for the 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ABSwitch = require( 'PH_SCALE/common/view/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var linearString = require( 'string!PH_SCALE/linear' );
  var logarithmicString = require( 'string!PH_SCALE/logarithmic' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );

  // constants
  var GRAPH_SIZE = new Dimension2( 360, 600 );
  var Y_SPACING = 20;

  /**
   * @param {Solution} solution
   * @param {Property<GraphUnits>} graphUnitsProperty
   * @param {Property<GraphScale>} graphScaleProperty
   * @constructor
   */
  function CustomGraphNode( solution, graphUnitsProperty, graphScaleProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // guide for approximate size of graph
    var guideNode = new Rectangle( 0, 0, GRAPH_SIZE.width, GRAPH_SIZE.height, {
      stroke: 'rgb(240,240,240)', //TODO remove this later so that the guide is invisible
      lineWidth: 2
    } );

    var unitsSwitch = new ABSwitch( graphUnitsProperty, GraphUnits.MOLES_PER_LITER, molesPerLiterString, GraphUnits.MOLES, molesString, {
      font: new PhetFont( 18 ),
      size: new Dimension2( 50, 25 ) } );

    //TODO use sun.PushButton
    var zoomButtonLength = 40;
    var zoomButtonCornerRadius = 10;
    var zoomInButton = new Rectangle( 0, 0, zoomButtonLength, zoomButtonLength, zoomButtonCornerRadius, zoomButtonCornerRadius, { stroke: 'black' } );
    var zoomOutButton = new Rectangle( 0, 0, zoomButtonLength, zoomButtonLength, zoomButtonCornerRadius, zoomButtonCornerRadius, { stroke: 'black' } );
    var zoomParent = new Node( { children: [ zoomInButton, zoomOutButton ]} );
    zoomOutButton.left = zoomInButton.right + 10;
    zoomOutButton.centerY = zoomInButton.centerY;

    var scaleSwitch = new ABSwitch( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicString, GraphScale.LINEAR, linearString, {
      font: new PhetFont( 18 ),
      size: new Dimension2( 50, 25 ) } );

    var scaleHeight = GRAPH_SIZE.height - unitsSwitch.height - zoomParent.height - scaleSwitch.height - ( 3 * Y_SPACING );
    var logarithmicGraph = new LogarithmicGraph( solution, graphUnitsProperty, {
      scaleHeight: scaleHeight,
      isInteractive: true
    } );

    // rendering order
    thisNode.addChild( guideNode );
    thisNode.addChild( unitsSwitch );
    thisNode.addChild( zoomParent );
    thisNode.addChild( scaleSwitch );
    thisNode.addChild( logarithmicGraph );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    logarithmicGraph.centerX = guideNode.centerX;
    logarithmicGraph.top = unitsSwitch.bottom + Y_SPACING;
    scaleSwitch.centerX = guideNode.centerX;
    scaleSwitch.bottom = guideNode.bottom;
    zoomParent.centerX = guideNode.centerX;
    zoomParent.bottom = scaleSwitch.top - Y_SPACING;
  }

  return inherit( Node, CustomGraphNode );
} );

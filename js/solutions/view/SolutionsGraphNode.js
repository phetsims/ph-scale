// Copyright 2002-2013, University of Colorado Boulder

/**
 * The graph for the 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ABSwitch = require( 'PH_SCALE/common/view/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LogConcentrationGraph = require( 'PH_SCALE/common/view/graph/LogConcentrationGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );

  // constants
  var GRAPH_SIZE = new Dimension2( 325, 550 );
  var Y_SPACING = 20;

  /**
   * @param {Solution} solution
   * @param {Property<GraphUnits>} graphUnitsProperty
   * @constructor
   */
  function SolutionsGraphNode( solution, graphUnitsProperty ) {

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

    var scaleHeight = GRAPH_SIZE.height - unitsSwitch.height - Y_SPACING;
    var concentrationGraph = new LogConcentrationGraph( solution, {
      scaleHeight: scaleHeight,
      isInteractive: false
    } );

    //TODO add quantityGraph
    var quantityGraph = new Rectangle( 0, 0, 75, scaleHeight, 20, 20, { stroke: 'black', lineWidth: 2 } );

    // rendering order
    thisNode.addChild( guideNode );
    thisNode.addChild( concentrationGraph );
    thisNode.addChild( quantityGraph );
    thisNode.addChild( unitsSwitch );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    concentrationGraph.centerX = unitsSwitch.centerX;
    concentrationGraph.top = unitsSwitch.bottom + Y_SPACING;
    quantityGraph.centerX = concentrationGraph.centerX;
    quantityGraph.top = concentrationGraph.top;

    // toggle visibility of graphs depending on which units are selected
    graphUnitsProperty.link( function( graphUnits ) {
      concentrationGraph.visible = ( graphUnits === GraphUnits.MOLES_PER_LITER );
      quantityGraph.visible = ( graphUnits === GraphUnits.MOLES );
    } );
  }

  return inherit( Node, SolutionsGraphNode );
} );

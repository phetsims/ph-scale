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
  var GraphUnits = require( 'PH_SCALE/common/view/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearConcentrationGraph = require( 'PH_SCALE/common/view/LinearConcentrationGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );

  // constants
  var GRAPH_SIZE = new Dimension2( 325, 610 );
  var Y_SPACING = 15;

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
      size: new Dimension2( 40, 20 ) } );

    var concentrationGraph = new LinearConcentrationGraph( solution, GRAPH_SIZE.height - unitsSwitch.height - Y_SPACING );

    // rendering order
    thisNode.addChild( guideNode );
    thisNode.addChild( concentrationGraph );
    thisNode.addChild( unitsSwitch );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    concentrationGraph.centerX = unitsSwitch.centerX;
    concentrationGraph.top = unitsSwitch.bottom + Y_SPACING;
  }

  return inherit( Node, SolutionsGraphNode );
} );

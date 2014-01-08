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
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

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
    var guideStroke = ( window.phetcommon.getQueryParameter( 'dev' ) ) ? 'rgb(240,240,240)' : null;
    var guideNode = new Rectangle( 0, 0, GRAPH_SIZE.width, GRAPH_SIZE.height, {
      stroke: guideStroke,
      lineWidth: 2
    } );

    var unitsSwitch = new ABSwitch( graphUnitsProperty,
      GraphUnits.MOLES_PER_LITER, concentrationString + '\n(' + molesPerLiterString + ')',
      GraphUnits.MOLES, quantityString + '\n(' + molesString + ')', {
        font: new PhetFont( 18 ),
        size: new Dimension2( 50, 25 )
      } );

    var scaleHeight = GRAPH_SIZE.height - unitsSwitch.height - Y_SPACING;
    var logarithmicGraph = new LogarithmicGraph( solution, graphUnitsProperty, {
      scaleHeight: scaleHeight,
      isInteractive: false
    } );

    // rendering order
    thisNode.addChild( guideNode );
    thisNode.addChild( logarithmicGraph );
    thisNode.addChild( unitsSwitch );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    logarithmicGraph.centerX = unitsSwitch.centerX;
    logarithmicGraph.top = unitsSwitch.bottom + Y_SPACING;
  }

  return inherit( Node, SolutionsGraphNode );
} );

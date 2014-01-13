// Copyright 2002-2013, University of Colorado Boulder

/**
 * The graph for the 'Solutions' screen.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * The graph indicators are not interactive because the stock solutions (solutes) are immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ABSwitch = require( 'PH_SCALE/common/view/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var graphString = require( 'string!PH_SCALE/graph' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  // constants
  var GRAPH_SIZE = new Dimension2( 325, 550 );
  var Y_SPACING = 20;

  /**
   * @param {Solution} solution
   * @param {*} options
   * @constructor
   */
  function SolutionsGraphNode( solution, options ) {

    options = _.extend( {
      expanded: true,
      units: GraphUnits.MOLES_PER_LITER
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // guide for approximate size of graph
    var guideStroke = ( window.phetcommon.getQueryParameter( 'dev' ) ) ? 'rgb(240,240,240)' : null;
    var guideNode = new Rectangle( 0, 0, GRAPH_SIZE.width, GRAPH_SIZE.height, {
      stroke: guideStroke,
      lineWidth: 2
    } );

    var unitsProperty = new Property( options.units );
    var unitsSwitch = new ABSwitch( unitsProperty,
      GraphUnits.MOLES_PER_LITER, concentrationString + '\n(' + molesPerLiterString + ')',
      GraphUnits.MOLES, quantityString + '\n(' + molesString + ')', {
        font: new PhetFont( 18 ),
        size: new Dimension2( 50, 25 )
      } );

    var scaleHeight = GRAPH_SIZE.height - unitsSwitch.height - Y_SPACING;
    var logarithmicGraph = new LogarithmicGraph( solution, unitsProperty, {
      scaleHeight: scaleHeight,
      isInteractive: false
    } );

    // parent for all parts of the graph
    var graphNode = new Node();
    thisNode.addChild( graphNode );
    graphNode.addChild( guideNode );
    graphNode.addChild( logarithmicGraph );
    graphNode.addChild( unitsSwitch );

    // layout of the graph (without expand/collapse bar)
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    logarithmicGraph.centerX = unitsSwitch.centerX;
    logarithmicGraph.top = unitsSwitch.bottom + Y_SPACING;

    var expandedProperty = new Property( options.expanded );

    // expand/collapse bar
    var expandCollapseBar = new ExpandCollapseBar(
      new Text( graphString, { font: new PhetFont( { size: 18, weight: 'bold' } ), fill: 'white' } ),
      expandedProperty, {
        barWidth: graphNode.width,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
      } );
    thisNode.addChild( expandCollapseBar );
    graphNode.centerX = expandCollapseBar.centerX;
    graphNode.top = expandCollapseBar.bottom + 10;

    expandedProperty.link( function( expanded ) {
      graphNode.visible = expanded;
    } );
  }

  return inherit( Node, SolutionsGraphNode );
} );

// Copyright 2002-2013, University of Colorado Boulder

/**
 * The graph for the 'Custom' screen.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * Indicators for hydronium and hydroxide are interactive.
 * Origin is at top-level of the expand/collapse bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'SUN/ExpandCollapseBar' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  /**
   * @param {Solution} solution
   * @param {*} options
   * @constructor
   */
  function CustomGraphNode( solution, options ) {

    options = _.extend( {
      expanded: true,
      units: GraphUnits.MOLES_PER_LITER
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // units switch
    var graphUnitsProperty = new Property( options.units );
    var textOptions = { font: new PhetFont( { size: 18, weight: 'bold' } ) };
    var graphUnitsSwitch = new ABSwitch( graphUnitsProperty,
      GraphUnits.MOLES_PER_LITER, new MultiLineText( concentrationString + '\n(' + molesPerLiterString + ')', textOptions ),
      GraphUnits.MOLES, new MultiLineText( quantityString + '\n(' + molesString + ')', textOptions ),
      { size: new Dimension2( 50, 25 ) } );
    graphUnitsSwitch.setScaleMagnitude( Math.min( 1, 300 / graphUnitsSwitch.width ) ); // scale for i18n

    // expand/collapse bar
    var expandedProperty = new Property( options.expanded );
    var expandCollapseBar = new ExpandCollapseBar(
      graphUnitsSwitch,
      expandedProperty, {
        minWidth: 350,
        barFill: PHScaleColors.PANEL_FILL,
        barLineWidth: 2,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
      } );

    // vertical line that connects graph to expand/collapse bar
    var lineNode = new Line( 0, 0, 0, 30, { stroke: 'black' } );

    // logarithmic graph, switchable between 'concentration' and 'quantity'
    var logarithmicGraph = new LogarithmicGraph( solution, graphUnitsProperty, {
      scaleHeight: 575,
      isInteractive: true
    } );

    // rendering order
    thisNode.addChild( expandCollapseBar );
    thisNode.addChild( lineNode );
    thisNode.addChild( logarithmicGraph );

    // layout
    lineNode.centerX = expandCollapseBar.centerX;
    lineNode.top = expandCollapseBar.bottom - 1;
    logarithmicGraph.centerX = lineNode.centerX;
    logarithmicGraph.y = lineNode.bottom - 1; // y, not top

    expandedProperty.link( function( expanded ) {
      logarithmicGraph.visible = lineNode.visible = expanded;
    } );
  }

  return inherit( Node, CustomGraphNode );
} );

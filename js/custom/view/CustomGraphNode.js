// Copyright 2002-2013, University of Colorado Boulder

//TODO some duplication with SolutionsGraphNode
/**
 * The graph for the 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGraph = require( 'PH_SCALE/common/view/graph/LinearGraph' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var linearString = require( 'string!PH_SCALE/linear' );
  var logarithmicString = require( 'string!PH_SCALE/logarithmic' );
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
      units: GraphUnits.MOLES_PER_LITER,
      graphScale: GraphScale.LOGARITHMIC
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    var textOptions = { font: new PhetFont( { size: 18, weight: 'bold' } ) };

    // units switch
    var graphUnitsProperty = new Property( options.units );
    var graphUnitsSwitch = new ABSwitch( graphUnitsProperty,
      GraphUnits.MOLES_PER_LITER, new MultiLineText( concentrationString + '\n(' + molesPerLiterString + ')', textOptions ),
      GraphUnits.MOLES, new MultiLineText( quantityString + '\n(' + molesString + ')', textOptions ),
      { size: new Dimension2( 50, 25 ) } );

    //TODO use sun.PushButton
    // zoom buttons for the linear graph
    var zoomButtonLength = 40;
    var zoomButtonCornerRadius = 10;
    var zoomInButton = new Rectangle( 0, 0, zoomButtonLength, zoomButtonLength, zoomButtonCornerRadius, zoomButtonCornerRadius, { stroke: 'black' } );
    var zoomOutButton = new Rectangle( 0, 0, zoomButtonLength, zoomButtonLength, zoomButtonCornerRadius, zoomButtonCornerRadius, { stroke: 'black' } );
    var zoomButtons = new Node( { children: [ zoomInButton, zoomOutButton ]} );
    zoomOutButton.left = zoomInButton.right + 10;
    zoomOutButton.centerY = zoomInButton.centerY;

    // switch between 'Logarithmic' and 'Linear'
    var graphScaleProperty = new Property( options.graphScale );
    var graphScaleSwitch = new ABSwitch( graphScaleProperty,
      GraphScale.LOGARITHMIC, new Text( logarithmicString, textOptions ),
      GraphScale.LINEAR, new Text( linearString, textOptions ),
      { size: new Dimension2( 50, 25 ) } );

    // logarithmic graph, switchable between 'concentration' and 'quantity'
    var scaleHeight = 475;
    var logarithmicGraph = new LogarithmicGraph( solution, graphUnitsProperty, {
      scaleHeight: scaleHeight,
      isInteractive: true
    } );

    // linear graph, switchable between 'concentration' and 'quantity'
    var linearGraph = new LinearGraph( solution, graphUnitsProperty, {
      scaleHeight: scaleHeight,
      isInteractive: true
    } );

    // vertical line that connects graph to expand/collapse bar
    var lineNode = new Line( 0, 0, 0, 30, { stroke: 'black' } );

    // parent for all parts of the graph
    var graphNode = new Node();
    thisNode.addChild( graphNode );
    graphNode.addChild( lineNode );
    graphNode.addChild( logarithmicGraph );
    graphNode.addChild( linearGraph );
    graphNode.addChild( zoomButtons );
    graphNode.addChild( graphScaleSwitch );

    // layout
    logarithmicGraph.centerX = lineNode.centerX;
    logarithmicGraph.top = lineNode.bottom - 1;
    linearGraph.centerX = logarithmicGraph.centerX;
    linearGraph.top = logarithmicGraph.top;
    zoomButtons.centerX = logarithmicGraph.centerX;
    zoomButtons.top = lineNode.bottom + scaleHeight + 20;
    graphScaleSwitch.centerX = zoomButtons.centerX;
    graphScaleSwitch.top = zoomButtons.bottom + 10;

    // expand/collapse bar
    var expandedProperty = new Property( options.expanded );
    var expandCollapseBar = new ExpandCollapseBar(
      graphUnitsSwitch,
      expandedProperty, {
        barFill: PHScaleColors.PANEL_FILL,
        barWidth: 350,
        barLineWidth: 2,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
      } );
    thisNode.addChild( expandCollapseBar );
    graphNode.centerX = expandCollapseBar.centerX;
    graphNode.top = expandCollapseBar.bottom;

    expandedProperty.link( function( expanded ) {
      graphNode.visible = expanded;
    } );

    // handle scale changes
    graphScaleProperty.link( function( graphScale ) {
      logarithmicGraph.visible = ( graphScale === GraphScale.LOGARITHMIC );
      linearGraph.visible = zoomButtons.visible = ( graphScale === GraphScale.LINEAR );
    });
  }

  return inherit( Node, CustomGraphNode );
} );

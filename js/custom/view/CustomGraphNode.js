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
  var ABSwitch = require( 'PH_SCALE/common/view/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

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

    // units switch
    var unitsProperty = new Property( options.units );
    var unitsSwitch = new ABSwitch( unitsProperty,
      GraphUnits.MOLES_PER_LITER, concentrationString + '\n(' + molesPerLiterString + ')',
      GraphUnits.MOLES, quantityString + '\n(' + molesString + ')', {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      size: new Dimension2( 50, 25 )
      } );

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
    var scaleSwitch = new ABSwitch( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicString, GraphScale.LINEAR, linearString, {
      font: new PhetFont( 18 ),
      size: new Dimension2( 50, 25 )
    } );

    // logarithmic graph, switchable between 'concentration' and 'quantity'
    var scaleHeight = 475;
    var logarithmicGraph = new LogarithmicGraph( solution, unitsProperty, {
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
    graphNode.addChild( zoomButtons );
    graphNode.addChild( scaleSwitch );

    // layout
    logarithmicGraph.centerX = lineNode.centerX;
    logarithmicGraph.top = lineNode.bottom - 1;
    zoomButtons.centerX = logarithmicGraph.centerX;
    zoomButtons.top = lineNode.bottom + scaleHeight + 20;
    scaleSwitch.centerX = zoomButtons.centerX;
    scaleSwitch.top = zoomButtons.bottom + 10;

    // expand/collapse bar
    var expandedProperty = new Property( options.expanded );
    var expandCollapseBar = new ExpandCollapseBar(
      unitsSwitch,
      expandedProperty, {
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
      zoomButtons.visible = ( graphScale === GraphScale.LINEAR );
      //TODO switch to Linear graph
    });
  }

  return inherit( Node, CustomGraphNode );
} );

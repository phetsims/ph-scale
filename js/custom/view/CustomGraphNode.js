// Copyright 2002-2013, University of Colorado Boulder

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
  var GraphScale = require( 'PH_SCALE/common/view/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var linearString = require( 'string!PH_SCALE/linear' );
  var logarithmicString = require( 'string!PH_SCALE/logarithmic' );
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );

  // constants
  var GRAPH_SIZE = new Dimension2( 325, 610 );

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
      size: new Dimension2( 40, 20 ) } );

    var scaleSwitch = new ABSwitch( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicString, GraphScale.LINEAR, linearString, {
      font: new PhetFont( 18 ),
      size: new Dimension2( 40, 20 ) } );

    // rendering order
    thisNode.addChild( guideNode );
    thisNode.addChild( unitsSwitch );
    thisNode.addChild( scaleSwitch );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top;
    scaleSwitch.centerX = guideNode.centerX;
    scaleSwitch.bottom = guideNode.bottom;
  }

  return inherit( Node, CustomGraphNode );
} );

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
  var GraphUnits = require( 'PH_SCALE/common/view/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var molesString = require( 'string!PH_SCALE/units.moles' );
  var molesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );

  // constants
  var GRAPH_SIZE = new Dimension2( 325, 600 );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function CustomGraphNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // guide for approximate size of graph
    var guideNode = new Rectangle( 0, 0, GRAPH_SIZE.width, GRAPH_SIZE.height, {
      stroke: 'rgb(200,200,200)', //TODO remove this later so that the guide is invisible
      lineWidth: 2
    } );

    var unitsSwitch = new ABSwitch( new Property( GraphUnits.MOLES_PER_LITER ), GraphUnits.MOLES_PER_LITER, molesPerLiterString, GraphUnits.MOLES, molesString, {
      font: new PhetFont( 18 ),
      size: new Dimension2( 40, 20 ) } );

    // rendering order
    thisNode.addChild( unitsSwitch );
    thisNode.addChild( guideNode );

    // layout
    unitsSwitch.centerX = guideNode.centerX;
    unitsSwitch.top = guideNode.top + 5;
  }

  return inherit( Node, CustomGraphNode );
} );

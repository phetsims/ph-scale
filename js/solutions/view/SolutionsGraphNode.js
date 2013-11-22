// Copyright 2002-2013, University of Colorado Boulder

/**
 * The graph for the 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function SolutionsGraphNode() {

    var thisNode = this;
    Node.call( thisNode );

    //TODO placeholder for approximate size of graph
    thisNode.addChild( new Rectangle( 0, 0, 275, 530, {
      stroke: 'black',
      lineWidth: 2
    } ) );
  }

  return inherit( Node, SolutionsGraphNode );
} );

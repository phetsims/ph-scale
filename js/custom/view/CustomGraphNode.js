// Copyright 2002-2013, University of Colorado Boulder

/**
 * The graph for the 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function CustomGraphNode() {

    var thisNode = this;
    Node.call( thisNode );

    //TODO placeholder for approximate size of graph
    thisNode.addChild( new Rectangle( 0, 0, 325, 530, {
      stroke: 'black',
      lineWidth: 2
    } ) );
  }

  return inherit( Node, CustomGraphNode );
} );

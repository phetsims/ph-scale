// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of H3O+/OH- ratio.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Beaker} beaker
   * @param {Solution} solution
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function RatioNode( beaker, solution, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    //TODO replace this placeholder
    var textNode = new Text( 'ratio view goes here', { font: new PhetFont( 22 ) } );
    thisNode.addChild( textNode );
    textNode.centerX = mvt.modelToViewX( beaker.location.x );
    textNode.centerY = mvt.modelToViewY( beaker.location.y - 0.75 * beaker.size.height );
  }

  return inherit( Node, RatioNode );
} );

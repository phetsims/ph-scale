// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of H3O/OH ratio.
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function RatioNode( solution ) {
    Node.call( this );
    //TODO implement this
    this.addChild( new Text( 'ratio view goes here', { font: new PhetFont( 22 ) } ) );
  }

  return inherit( Node, RatioNode );
} );

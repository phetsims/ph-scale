// Copyright 2013-2015, University of Colorado Boulder

/**
 * H3O+ (hydronium) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HydrogenNode = require( 'PH_SCALE/common/view/molecules/HydrogenNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OxygenNode = require( 'PH_SCALE/common/view/molecules/OxygenNode' );
  var phScale = require( 'PH_SCALE/phScale' );

  /**
   * @param {Object} options
   * @constructor
   */
  function H3ONode( options ) {

    Node.call( this );

    // atoms
    var oxygen = new OxygenNode();
    var hydrogen1 = new HydrogenNode();
    var hydrogen2 = new HydrogenNode();
    var hydrogen3 = new HydrogenNode();

    // rendering order
    this.addChild( hydrogen3 );
    this.addChild( oxygen );
    this.addChild( hydrogen1 );
    this.addChild( hydrogen2 );

    // layout
    hydrogen1.centerX = oxygen.left;
    hydrogen1.centerY = oxygen.centerY - ( 0.1 * oxygen.height );
    hydrogen2.centerX = oxygen.centerX + ( 0.4 * oxygen.width );
    hydrogen2.centerY = oxygen.top + ( 0.1 * oxygen.height );
    hydrogen3.centerX = oxygen.centerX + ( 0.2 * oxygen.width );
    hydrogen3.centerY = oxygen.bottom - ( 0.1 * oxygen.height );

    this.mutate( options );
  }

  phScale.register( 'H3ONode', H3ONode );

  return inherit( Node, H3ONode );
} );

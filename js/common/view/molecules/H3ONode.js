// Copyright 2013-2020, University of Colorado Boulder

/**
 * H3O+ (hydronium) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HydrogenNode = require( 'PH_SCALE/common/view/molecules/HydrogenNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OxygenNode = require( 'PH_SCALE/common/view/molecules/OxygenNode' );
  const phScale = require( 'PH_SCALE/phScale' );

  class H3ONode extends Node {

    /**
     * @param {Object} options
     */
    constructor( options ) {

      super();

      // atoms
      const oxygen = new OxygenNode();
      const hydrogen1 = new HydrogenNode();
      const hydrogen2 = new HydrogenNode();
      const hydrogen3 = new HydrogenNode();

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
  }

  return phScale.register( 'H3ONode', H3ONode );
} );

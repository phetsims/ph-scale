// Copyright 2013-2020, University of Colorado Boulder

/**
 * OH- (hydroxide) molecule.
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

  class OHNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      super();

      // atoms
      const oxygen = new OxygenNode();
      const hydrogen = new HydrogenNode();

      // rendering order
      this.addChild( oxygen );
      this.addChild( hydrogen );

      // layout
      hydrogen.left = oxygen.right - ( 0.2 * oxygen.width );
      hydrogen.centerY = oxygen.centerY - ( 0.1 * oxygen.height );

      this.mutate( options );
    }
  }

  return phScale.register( 'OHNode', OHNode );
} );

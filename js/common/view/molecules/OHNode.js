// Copyright 2013-2017, University of Colorado Boulder

/**
 * OH- (hydroxide) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HydrogenNode = require( 'PH_SCALE/common/view/molecules/HydrogenNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OxygenNode = require( 'PH_SCALE/common/view/molecules/OxygenNode' );
  const phScale = require( 'PH_SCALE/phScale' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OHNode( options ) {

    Node.call( this );

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

  phScale.register( 'OHNode', OHNode );

  return inherit( Node, OHNode );
} );

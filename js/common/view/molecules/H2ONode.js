// Copyright 2013-2020, University of Colorado Boulder

/**
 * H2O (water) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../../scenery/js/imports.js';
import phScale from '../../../phScale.js';
import HydrogenNode from './HydrogenNode.js';
import OxygenNode from './OxygenNode.js';

class H2ONode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    super();

    // atoms
    const oxygen = new OxygenNode();
    const hydrogen1 = new HydrogenNode();
    const hydrogen2 = new HydrogenNode();

    // rendering order
    this.addChild( hydrogen2 );
    this.addChild( oxygen );
    this.addChild( hydrogen1 );

    // layout
    hydrogen1.left = oxygen.right - ( 0.2 * oxygen.width );
    hydrogen1.centerY = oxygen.centerY - ( 0.1 * oxygen.height );
    hydrogen2.centerX = oxygen.centerX + ( 0.1 * oxygen.width );
    hydrogen2.centerY = oxygen.bottom;

    this.mutate( options );
  }
}

phScale.register( 'H2ONode', H2ONode );
export default H2ONode;
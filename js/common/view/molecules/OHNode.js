// Copyright 2013-2020, University of Colorado Boulder

/**
 * OH- (hydroxide) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import phScale from '../../../phScale.js';
import HydrogenNode from './HydrogenNode.js';
import OxygenNode from './OxygenNode.js';

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

phScale.register( 'OHNode', OHNode );
export default OHNode;
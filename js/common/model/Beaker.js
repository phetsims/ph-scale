// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import phScale from '../../phScale.js';

class Beaker {

  /**
   * @param {Vector2} position bottom center
   * @param {Dimension2} size
   * @param {Object} [options]
   */
  constructor( position, size, options ) {

    options = merge( {
      volume: 1.2 // L
    }, options );

    // @Public
    this.position = position;
    this.size = size;
    this.volume = options.volume;

    // @public convenience properties
    this.left = position.x - ( size.width / 2 );
    this.right = position.x + ( size.width / 2 );
    this.bounds = new Bounds2( this.left, position.y - size.height, this.right, position.y );
  }
}

phScale.register( 'Beaker', Beaker );
export default Beaker;
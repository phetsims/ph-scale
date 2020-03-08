// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';

class Beaker {

  /**
   * @param {Vector2} position
   * @param {Object} [options]
   */
  constructor( position, options ) {

    options = merge( {
      volume: PHScaleConstants.BEAKER_VOLUME, // L
      size: PHScaleConstants.BEAKER_SIZE
    }, options );

    // @public (read-only)
    this.position = position;
    this.size = options.size;
    this.volume = options.volume;

    // @public (read-only) convenience properties
    this.left = this.position.x - ( this.size.width / 2 );
    this.right = this.position.x + ( this.size.width / 2 );
    this.bounds = new Bounds2( this.left, this.position.y - this.size.height, this.right, this.position.y );
  }
}

phScale.register( 'Beaker', Beaker );
export default Beaker;
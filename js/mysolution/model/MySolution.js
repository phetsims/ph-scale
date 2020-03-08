// Copyright 2020, University of Colorado Boulder

/**
 * MySolution is the model of the solution in the My Solution screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';

class MySolution {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      pH: 7,
      tandem: Tandem.REQUIRED
    }, options );

    this.pHProperty = new NumberProperty( options.pH, {
      range: PHScaleConstants.PH_RANGE,
      tandem: options.tandem.createTandem( 'pHProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.pHProperty.reset();
  }
}


phScale.register( 'MySolution', MySolution );
export default MySolution;
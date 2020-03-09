// Copyright 2020, University of Colorado Boulder

/**
 * MySolution is the model of the solution in the My Solution screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolutionMixin from '../../common/model/SolutionMixin.js';
import Water from '../../common/model/Water.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';

class MySolution extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      pH: 7,
      volume: 0.5, // L
      maxVolume: 1.2, // L

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public pH of the solution in the beaker
    this.pHProperty = new NumberProperty( options.pH, {
      range: PHScaleConstants.PH_RANGE,
      tandem: options.tandem.createTandem( 'pHProperty' )
    } );

    // @public volume of the solution in the beaker
    this.volumeProperty = new NumberProperty( options.volume, {
      isValidValue: volume => ( volume > 0 && volume <= options.maxVolume ),
      units: 'L',
      tandem: options.tandem.createTandem( 'volumeProperty' ),
      phetioReadOnly: true
    } );

    // @public
    this.colorProperty = new Property( Water.color, {
      // DO NOT INSTRUMENT FOR PhET-iO
    } );

    SolutionMixin.mixInto( this );
  }

  /**
   * @public
   */
  reset() {
    this.pHProperty.reset();
    this.volumeProperty.reset();
  }
}

phScale.register( 'MySolution', MySolution );
export default MySolution;
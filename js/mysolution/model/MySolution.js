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
      tandem: options.tandem.createTandem( 'pHProperty' ),
      phetioDocumentation: 'pH of the solution'
    } );

    // @public total volume of the solution in the beaker
    this.totalVolumeProperty = new NumberProperty( options.volume, {
      isValidValue: volume => ( volume > 0 && volume <= options.maxVolume ),
      units: 'L',
      tandem: options.tandem.createTandem( 'totalVolumeProperty' ),
      phetioStudioControl: false, // see https://github.com/phetsims/ph-scale/issues/119#issuecomment-595450329
      phetioDocumentation: 'total volume of the solution'
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
    this.totalVolumeProperty.reset();
  }
}

phScale.register( 'MySolution', MySolution );
export default MySolution;
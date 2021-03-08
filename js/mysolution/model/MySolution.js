// Copyright 2020, University of Colorado Boulder

/**
 * MySolution is the model of the solution in the My Solution screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolutionDerivedQuantities from '../../common/model/SolutionDerivedQuantities.js';
import Water from '../../common/model/Water.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';

class MySolution extends PhetioObject {

  /**
   * @param {Object} [options]
   * @mixes SolutionDerivedQuantities
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
      phetioDocumentation: 'pH of the solution',
      phetioHighFrequency: true
    } );

    // @public total volume of the solution in the beaker
    this.totalVolumeProperty = new NumberProperty( options.volume, {
      units: 'L',
      tandem: options.tandem.createTandem( 'totalVolumeProperty' ),
      range: new Range( 0.01, options.maxVolume ), // must be > 0 !!
      phetioDocumentation: 'total volume of the solution',
      phetioHighFrequency: true
    } );

    // @public
    this.colorProperty = new Property( Water.color, {
      // DO NOT INSTRUMENT FOR PhET-iO
    } );

    // @public
    this.derivedQuantities = new SolutionDerivedQuantities( this.pHProperty, this.totalVolumeProperty, {
      tandem: options.tandem // Properties created by SolutionDerivedQuantities should appear as if they are children of MySolution.
    } );
  }

  /**
   * @public
   */
  reset() {
    this.pHProperty.reset();
    this.totalVolumeProperty.reset();
    // this.derivedQuantities does not need to be reset because all of its Properties are derived.
  }
}

phScale.register( 'MySolution', MySolution );
export default MySolution;
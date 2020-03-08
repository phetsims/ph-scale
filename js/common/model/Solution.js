// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';
import PHModel from './PHModel.js';
import Water from './Water.js';

// constants
const MIN_VOLUME = Math.pow( 10, -PHScaleConstants.VOLUME_DECIMAL_PLACES );

class Solution extends PhetioObject {

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {Object} [options]
   */
  constructor( soluteProperty, options ) {

    options = merge( {

      soluteVolume: 0, // initial volume of solute, in L
      waterVolume: 0, // initial volume of water, in L
      maxVolume: 1, // maximum total volume (solute + water), in L

      // phet-io
      tandem: Tandem.OPTIONAL, //TODO #119 make this Tandem.REQUIRED
      phetioState: false,
      phetioDocumentation: 'solution in the beaker'
    }, options );

    assert && assert( options.soluteVolume + options.waterVolume <= options.maxVolume );

    super( options );

    // @public
    this.soluteProperty = soluteProperty;

    // Create a PhET-iO linked element that points to where soluteProperty lives (in Dropper).
    // This makes it easier to find soluteProperty in the Studio tree.
    this.addLinkedElement( this.soluteProperty, {
      tandem: options.tandem.createTandem( 'soluteProperty' )
    } );

    // @public
    this.soluteVolumeProperty = new NumberProperty( options.soluteVolume, {
      units: 'L',
      tandem: options.tandem.createTandem( 'soluteVolumeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'volume of solute in the solution'
    } );

    // @public
    this.waterVolumeProperty = new NumberProperty( options.waterVolume, {
      units: 'L',
      tandem: options.tandem.createTandem( 'waterVolumeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'volume of water in the solution'
    } );

    // @public (read-only)
    this.maxVolume = options.maxVolume;

    /*
     * @public
     * See issue #25.
     * True when changes to water volume and solute volume should be ignored, because they will both be changing,
     * which currently happens only during draining. To prevent bogus intermediate values (for example, pH and total volume),
     * clients who observe both waterVolumeProperty and soluteVolumeProperty should consult the ignoreVolumeUpdate flag before updating.
     */
    this.ignoreVolumeUpdate = false;

    // @public volume
    this.volumeProperty = new DerivedProperty(
      [ this.soluteVolumeProperty, this.waterVolumeProperty ],
      () => ( this.ignoreVolumeUpdate ) ? this.volumeProperty.get() : this.computeVolume(), {
        units: 'L',
        tandem: options.tandem.createTandem( 'volumeProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'total volume of the solution'
      } );

    // @public pH, null if no value
    this.pHProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteVolumeProperty, this.waterVolumeProperty ],
      () => {
        if ( this.ignoreVolumeUpdate ) {
          return this.pHProperty.get();
        }
        else {
          let pH = this.computePH();
          if ( pH !== null ) {
            pH = Utils.toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ); // constrain to the pH meter format, see issue #4
          }
          return pH;
        }
      }, {
        tandem: options.tandem.createTandem( 'pHProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'the pH of the solution'
      } );

    // @public color
    this.colorProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteVolumeProperty, this.waterVolumeProperty ],
      ( solute, soluteVolume, waterVolume ) => {
        if ( soluteVolume + waterVolume === 0 ) {
          return Color.BLACK; // no solution, should never see this color displayed
        }
        else if ( soluteVolume === 0 || this.isEquivalentToWater() ) {
          return Water.color;
        }
        else {
          return solute.computeColor( soluteVolume / ( soluteVolume + waterVolume ) );
        }
      } );

    // When the solute changes, reset to initial volumes.
    // This is short-circuited while PhET-iO state is being restored. Otherwise the restored state would be changed.
    // See https://github.com/phetsims/ph-scale/issues/132
    this.soluteProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.waterVolumeProperty.reset();
        this.soluteVolumeProperty.reset();
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.soluteProperty.reset();
    this.soluteVolumeProperty.reset();
    this.waterVolumeProperty.reset();
  }

  //----------------------------------------------------------------------------
  // Volume (Liters)
  //----------------------------------------------------------------------------

  // @private Returns the amount of volume that is available to fill.
  getFreeVolume() {
    return this.maxVolume - this.computeVolume();
  }

  // @public Convenience function for adding solute
  addSolute( deltaVolume ) {
    if ( deltaVolume > 0 ) {
      this.soluteVolumeProperty.set( Math.max( MIN_VOLUME, this.soluteVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) ) );
    }
  }

  // @public Convenience function for adding water
  addWater( deltaVolume ) {
    if ( deltaVolume > 0 ) {
      this.waterVolumeProperty.set( Math.max( MIN_VOLUME, this.waterVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) ) );
    }
  }

  /**
   * Drains a specified amount of solution.
   * @param {number} deltaVolume amount of solution to drain, in liters
   * @public
   */
  drainSolution( deltaVolume ) {
    if ( deltaVolume > 0 ) {
      const totalVolume = this.computeVolume();
      if ( totalVolume > 0 ) {
        if ( totalVolume - deltaVolume < MIN_VOLUME ) {
          // drain the remaining solution
          this.setVolumeAtomic( 0, 0 );
        }
        else {
          // drain equal percentages of water and solute
          const waterVolume = this.waterVolumeProperty.get();
          const soluteVolume = this.soluteVolumeProperty.get();
          this.setVolumeAtomic( waterVolume - ( deltaVolume * waterVolume / totalVolume ), soluteVolume - ( deltaVolume * soluteVolume / totalVolume ) );
        }
      }
    }
  }

  /**
   * Sets volume atomically, to prevent pH value from going through an intermediate state.
   * See documentation of ignoreVolumeUpdate above.
   *
   * @param {number} waterVolume liters
   * @param {number} soluteVolume liters
   * @private
   */
  setVolumeAtomic( waterVolume, soluteVolume ) {

    // ignore the first notification if both volumes are changing
    this.ignoreVolumeUpdate = ( waterVolume !== this.waterVolumeProperty.get() ) && ( soluteVolume !== this.soluteVolumeProperty.get() );
    this.waterVolumeProperty.set( waterVolume );
    this.ignoreVolumeUpdate = false; // don't ignore the second notification, so that observers will update
    this.soluteVolumeProperty.set( soluteVolume );
  }

  //----------------------------------------------------------------------------
  // Computations for derived properties
  //----------------------------------------------------------------------------

  /**
   * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
   * Eg, the value displayed to the user is '7.00'.
   * @private
   */
  isEquivalentToWater() {
    return Utils.toFixedNumber( this.computePH(), PHScaleConstants.PH_METER_DECIMAL_PLACES ) === Water.pH;
  }

  /**
   * Computes total volume for this solution.
   * @returns {number} liters
   * @private Used in internal computations to prevent incorrect intermediate values, see issue #40
   */
  computeVolume() {
    return ( this.soluteVolumeProperty.get() + this.waterVolumeProperty.get() );
  }

  /**
   * Compute pH for this solution.
   * @returns {number|null} pH, null if total volume is zero
   * @private Used in internal computations to prevent incorrect intermediate values, see issue #40
   */
  computePH() {
    return PHModel.computePH( this.soluteProperty.get().pH, this.soluteVolumeProperty.get(), this.waterVolumeProperty.get() );
  }

  //----------------------------------------------------------------------------
  // Number of molecules
  //----------------------------------------------------------------------------

  // @public
  getMoleculesH3O() {
    return PHModel.computeMolecules( PHModel.pHToConcentrationH3O( this.computePH() ), this.computeVolume() );
  }

  // @public
  getMoleculesOH() {
    return PHModel.computeMolecules( PHModel.pHToConcentrationOH( this.computePH() ), this.computeVolume() );
  }

  // @public
  getMoleculesH2O() {
    return PHModel.computeMolecules( PHModel.volumeToConcentrationH20( this.volumeProperty.value ), this.computeVolume() );
  }
}

phScale.register( 'Solution', Solution );
export default Solution;
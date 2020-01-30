// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const merge = require( 'PHET_CORE/merge' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PHModel = require( 'PH_SCALE/common/model/PHModel' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Utils = require( 'DOT/Utils' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // constants
  const MIN_VOLUME = Math.pow( 10, -PHScaleConstants.VOLUME_DECIMAL_PLACES );

  class Solution {

    /**
     * @param {Property.<Solute>} soluteProperty
     * @param {number} soluteVolume liters
     * @param {number} waterVolume liters
     * @param {number} maxVolume liters
     * @param {Object} [options]
     */
    constructor( soluteProperty, soluteVolume, waterVolume, maxVolume, options ) {
      assert && assert( soluteVolume + waterVolume <= maxVolume );

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public
      this.soluteProperty = soluteProperty;
      this.soluteVolumeProperty = new NumberProperty( soluteVolume, {
        tandem: options.tandem.createTandem( 'soluteVolumeProperty' ),
        phetioReadOnly: true
      } );
      this.waterVolumeProperty = new NumberProperty( waterVolume, {
        tandem: options.tandem.createTandem( 'waterVolumeProperty' ),
        phetioReadOnly: true
      } );
      this.maxVolume = maxVolume;

      /*
       * @public
       * See issue #25.
       * True when changes to water volume and solute volume should be ignored, because they will both be changing,
       * which currently happens only during draining. To prevent bogus intermediate values (for example, pH and total volume),
       * clients who observe both waterVolumeProperty and soluteVolumeProperty should consult the ignoreVolumeUpdate flag before updating.
       */
      this.ignoreVolumeUpdate = false;

      // @public volume
      this.volumeProperty = new DerivedProperty( [ this.soluteVolumeProperty, this.waterVolumeProperty ],
        () => ( this.ignoreVolumeUpdate ) ? this.volumeProperty.get() : this.computeVolume(), {
          tandem: options.tandem.createTandem( 'waterVolumeProperty' ),
          phetioType: DerivedPropertyIO( NumberIO )
        }
      );

      // @public pH, null if no value
      this.pHProperty = new DerivedProperty( [ this.soluteProperty, this.soluteVolumeProperty, this.waterVolumeProperty ],
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
          phetioType: DerivedPropertyIO( NullableIO( NumberIO ) )
        });

      // @public color
      //TODO #92 does this need to be instrumented?
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

      // solute
      this.soluteProperty.link( () => {

        // reset to volumes that were specified in the constructor
        this.waterVolumeProperty.set( waterVolume );
        this.soluteVolumeProperty.set( soluteVolume );
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

    /**
     * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
     * Eg, the value displayed to the user is '7.00'.
     * @public
     */
    isEquivalentToWater() {
      const pHString = Utils.toFixed( this.computePH(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return ( parseFloat( pHString ) === Water.pH ) && ( this.waterVolumeProperty.get() > 0 );
    }

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    // @private
    isEmpty() { return this.computeVolume() === 0; }

    // @private
    isFull() { return this.computeVolume() === this.maxVolume; }

    // @private Returns the amount of volume that is available to fill.
    getFreeVolume() { return this.maxVolume - this.computeVolume(); }

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
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    // @public
    getConcentrationH3O() {
      return PHModel.pHToConcentrationH3O( this.computePH() );
    }

    // @public
    getConcentrationOH() {
      return PHModel.pHToConcentrationOH( this.computePH() );
    }

    // @public
    getConcentrationH2O() {
      return ( this.isEmpty() ? 0 : 55 );
    }

    //----------------------------------------------------------------------------
    // Number of molecules
    //----------------------------------------------------------------------------

    // @public
    getMoleculesH3O() {
      return PHModel.computeMolecules( this.getConcentrationH3O(), this.computeVolume() );
    }

    // @public
    getMoleculesOH() {
      return PHModel.computeMolecules( this.getConcentrationOH(), this.computeVolume() );
    }

    // @public
    getMoleculesH2O() {
      return PHModel.computeMolecules( this.getConcentrationH2O(), this.computeVolume() );
    }

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    // @public
    getMolesH3O() {
      return PHModel.computeMoles( this.getConcentrationH3O(), this.computeVolume() );
    }

    // @public
    getMolesOH() {
      return PHModel.computeMoles( this.getConcentrationOH(), this.computeVolume() );
    }

    // @public
    getMolesH2O() {
      return PHModel.computeMoles( this.getConcentrationH2O(), this.computeVolume() );
    }
  }

  return phScale.register( 'Solution', Solution );
} );
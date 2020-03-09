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
      tandem: Tandem.OPTIONAL, // because Solution is not instrumented in MySolutionModel
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

    // @public (read-only)
    this.maxVolume = options.maxVolume;

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

    // @private
    // Used to update total volume atomically when draining solution, see https://github.com/phetsims/ph-scale/issues/25
    this.ignoreVolumeUpdate = false;

    // @public volume
    this.volumeProperty = new DerivedProperty(
      [ this.soluteVolumeProperty, this.waterVolumeProperty ],
      ( soluteVolume, waterVolume ) => ( this.ignoreVolumeUpdate ) ? this.volumeProperty.get() : ( soluteVolume + waterVolume ), {
        units: 'L',
        tandem: options.tandem.createTandem( 'volumeProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'total volume of the solution'
      } );

    // @public pH, null if no value
    this.pHProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteVolumeProperty, this.waterVolumeProperty ],
      ( solute, soluteVolume, waterVolume ) => {
        if ( this.ignoreVolumeUpdate ) {
          return this.pHProperty.get();
        }
        else {
          let pH = PHModel.computePH( solute.pH, soluteVolume, waterVolume );
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
        if ( this.ignoreVolumeUpdate ) {
          return this.colorProperty.value;
        }
        else if ( soluteVolume + waterVolume === 0 ) {
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

    // Concentration (mol/L) ------------------------------------------------

    // The concentration (mol/L) of H2O in the solution
    this.concentrationH2OProperty = new DerivedProperty(
      [ this.volumeProperty ],
      volume => PHModel.volumeToConcentrationH20( volume ), {
        tandem: options.tandem.createTandem( 'concentrationH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>2</sub>O in the solution'
      } );

    // The concentration (mol/L) of H3O+ in the solution
    this.concentrationH3OProperty = new DerivedProperty(
      [ this.pHProperty ],
      pH => PHModel.pHToConcentrationH3O( pH ), {
        tandem: options.tandem.createTandem( 'concentrationH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>3</sub>O<sup>+</sup> in the solution'
      } );

    // The concentration (mol/L) of OH- in the solution
    this.concentrationOHProperty = new DerivedProperty(
      [ this.pHProperty ],
      pH => PHModel.pHToConcentrationOH( pH ), {
        tandem: options.tandem.createTandem( 'concentrationOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of OH<sup>-</sup> in the solution'
      } );

    // Quantity (mol) ------------------------------------------------

    // The quantity (mol) of H2O in the solution
    this.quantityH2OProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, this.volumeProperty ],
      ( concentrationH2O, volume ) => PHModel.computeMoles( concentrationH2O, volume ), {
        tandem: options.tandem.createTandem( 'quantityH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>2</sub>O in the solution'
      } );

    // The quantity (mol) of H3O+ in the solution
    this.quantityH3OProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, this.volumeProperty ],
      ( concentrationH3O, volume ) => PHModel.computeMoles( concentrationH3O, volume ), {
        tandem: options.tandem.createTandem( 'quantityH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>3</sub>O<sup>+</sup> in the solution'
      } );

    // The quantity (mol) of OH- in the solution
    this.quantityOHProperty = new DerivedProperty(
      [ this.concentrationOHProperty, this.volumeProperty ],
      ( concentrationOH, volume ) => PHModel.computeMoles( concentrationOH, volume ), {
        tandem: options.tandem.createTandem( 'quantityOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of OH<sup>-</sup> in the solution'
      } );

    // Molecule counts ------------------------------------------------

    // @public number of H2O molecules in the solution
    this.numberOfH2OMoleculesProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, this.volumeProperty ],
      ( concentrationH2O, volume ) => PHModel.computeMolecules( concentrationH2O, volume ), {
        tandem: options.tandem.createTandem( 'numberOfH2OMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>2</sub>O molecules in the solution'
      } );

    // @public number of H3O+ molecules in the solution
    this.numberOfH3OMoleculesProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, this.volumeProperty ],
      ( concentrationH3O, volume ) => PHModel.computeMolecules( concentrationH3O, volume ), {
        tandem: options.tandem.createTandem( 'numberOfH3OMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>3</sub>O<sup>+</sup> molecules in the solution'
      } );

    // @public number of OH- molecules in the solution
    this.numberOfOHMoleculesProperty = new DerivedProperty(
      [ this.concentrationOHProperty, this.volumeProperty ],
      ( concentrationOH, volume ) => PHModel.computeMolecules( concentrationOH, volume ), {
        tandem: options.tandem.createTandem( 'numberOfOHMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of OH<sup>-</sup> molecules in the solution'
      } );
  }

  /**
   * @public
   */
  reset() {
    this.soluteVolumeProperty.reset();
    this.waterVolumeProperty.reset();
  }

  //----------------------------------------------------------------------------
  // Volume (Liters)
  //----------------------------------------------------------------------------

  // @private Returns the amount of volume that is available to fill.
  getFreeVolume() {
    return this.maxVolume - this.volumeProperty.value;
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
      const totalVolume = this.volumeProperty.value;
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
   * This is used when draining solution, so that equal parts of solute and water are removed atomically.
   * See documentation of ignoreVolumeUpdate above, and https://github.com/phetsims/ph-scale/issues/25.
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

  /**
   * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
   * Eg, the value displayed to the user is '7.00'.
   * @private
   */
  isEquivalentToWater() {
    return Utils.toFixedNumber( this.pHProperty.value, PHScaleConstants.PH_METER_DECIMAL_PLACES ) === Water.pH;
  }
}

phScale.register( 'Solution', Solution );
export default Solution;
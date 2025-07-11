// Copyright 2013-2025, University of Colorado Boulder

/**
 * PHModel is the base-class model for the 'Macro' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';
import Beaker from './Beaker.js';
import Dropper from './Dropper.js';
import Faucet from './Faucet.js';
import Solute from './Solute.js';
import Solution from './Solution.js';
import Water from './Water.js';
import PHScalePreferences from './PHScalePreferences.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { log10 } from '../../../../dot/js/util/log10.js';

// constants
const AVOGADROS_NUMBER = 6.023E23; // number of particles in one mole of solution

// null means 'no value', typically when we have no solution because the volume is zero.
export type PHValue = number | null;

// null means 'no value', typically when we have no solution because the volume is zero.
export type ConcentrationValue = number | null;

type SelfOptions<T extends Solution> = {

  // L, automatically fill beaker with this much solute when the solute changes
  autofillVolume?: number;

  // used to instantiate the solution
  createSolution: ( soluteProperty: Property<Solute>, maxVolume: number, tandem: Tandem ) => T;
};

export type PHModelOptions<T extends Solution> = SelfOptions<T> & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PHModel<T extends Solution> implements TModel {

  // solute choices, in order that they'll appear in the combo box
  // The order is alphabetical (English names), see https://github.com/phetsims/ph-scale/issues/101
  public readonly solutes: Solute[];

  // the beaker, everything else is positioned relative to it
  public readonly beaker: Beaker;

  public readonly dropper: Dropper;

  // solution in the beaker
  public readonly solution: T;

  // water faucet, at the beaker's top-right
  public readonly waterFaucet: Faucet;

  // drain faucet, at the beaker's bottom-left
  public readonly drainFaucet: Faucet;

  // how much (L) to autofill when the solute changes
  private readonly autofillVolume: number;

  public readonly isAutofillingProperty: Property<boolean>;

  public constructor( providedOptions: PHModelOptions<T> ) {

    const options = optionize<PHModelOptions<T>, SelfOptions<T>>()( {

      // SelfOptions
      autofillVolume: 0.5
    }, providedOptions );

    this.solutes = [
      Solute.BATTERY_ACID,
      Solute.BLOOD,
      Solute.CHICKEN_SOUP,
      Solute.COFFEE,
      Solute.DRAIN_CLEANER,
      Solute.HAND_SOAP,
      Solute.MILK,
      Solute.ORANGE_JUICE,
      Solute.SODA,
      Solute.SPIT,
      Solute.VOMIT,
      Solute.WATER
    ];

    this.beaker = new Beaker( PHScaleConstants.BEAKER_POSITION );

    const yDropper = this.beaker.position.y - this.beaker.size.height - 15;
    this.dropper = new Dropper( Solute.WATER, this.solutes, new Vector2( this.beaker.position.x - 50, yDropper ), {
      tandem: options.tandem.createTandem( 'dropper' )
    } );

    this.solution = options.createSolution( this.dropper.soluteProperty, this.beaker.volume,
      options.tandem.createTandem( 'solution' ) );

    this.waterFaucet = new Faucet(
      new Vector2( this.beaker.right - 50, this.beaker.position.y - this.beaker.size.height - 45 ),
      this.beaker.right + 400, {
        enabled: this.solution.totalVolumeProperty.value < this.beaker.volume,
        tandem: options.tandem.createTandem( 'waterFaucet' )
      } );

    this.drainFaucet = new Faucet(
      new Vector2( this.beaker.left - 75, this.beaker.position.y + 43 ),
      this.beaker.left, {
        enabled: this.solution.totalVolumeProperty.value > 0,
        tandem: options.tandem.createTandem( 'drainFaucet' )
      } );

    this.autofillVolume = options.autofillVolume;

    this.isAutofillingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isAutofillingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the beaker is in the process of being automatically filled with solute'
    } );

    // animate the dropper adding solute to the beaker
    this.dropper.soluteProperty.link( () => {

      // Do not autofill when state is being restored, see https://github.com/phetsims/ph-scale/issues/223.
      if ( !isSettingPhetioStateProperty.value ) {

        // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
        this.waterFaucet.enabledProperty.value = false;
        this.drainFaucet.enabledProperty.value = false;

        // animate the dropper adding solute to the beaker
        this.startAutofill();
      }
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.solution.totalVolumeProperty.link( volume => {
      this.updateFaucetsAndDropper();
    } );

    PHScalePreferences.autoFillEnabledProperty.link( enabled => {
      // Stop autofill if it was in progress. This is most noticeable when the user disables autofill in the home screen
      // before navigating to a sim screen.
      !enabled && this.stopAutofill();
    } );
  }

  public reset(): void {
    this.dropper.reset();
    this.solution.reset();
    this.waterFaucet.reset();
    this.drainFaucet.reset();
    this.startAutofill();
  }

  /**
   * Enables faucets and dropper based on amount of solution in the beaker.
   */
  private updateFaucetsAndDropper(): void {
    const volume = this.solution.totalVolumeProperty.value;
    this.waterFaucet.enabledProperty.value = ( volume < this.beaker.volume );
    this.drainFaucet.enabledProperty.value = ( volume > 0 );
    this.dropper.enabledProperty.value = ( volume < this.beaker.volume );
  }

  /**
   * Moves time forward by the specified delta, in seconds.
   */
  public step( dt: number ): void {
    if ( this.isAutofillingProperty.value ) {
      this.stepAutofill( dt );
    }
    else {
      this.solution.addSolute( this.dropper.flowRateProperty.value * dt );
      this.solution.addWater( this.waterFaucet.flowRateProperty.value * dt );
      this.solution.drainSolution( this.drainFaucet.flowRateProperty.value * dt );
    }
  }

  /**
   * Starts the autofill animation.
   */
  private startAutofill(): void {
    if ( PHScalePreferences.autoFillEnabledProperty.value && this.autofillVolume > 0 ) {
      this.isAutofillingProperty.value = true;
      this.dropper.isDispensingProperty.value = true;
      this.dropper.flowRateProperty.value = 0.75; // faster than standard flow rate
    }
    else {
      this.updateFaucetsAndDropper();
    }
  }

  /**
   * Advances the autofill animation by dt, in seconds.
   */
  private stepAutofill( dt: number ): void {
    this.solution.addSolute( Math.min( this.dropper.flowRateProperty.value * dt,
      this.autofillVolume - this.solution.totalVolumeProperty.value ) );
    if ( this.solution.totalVolumeProperty.value === this.autofillVolume ) {
      this.stopAutofill();
    }
  }

  /**
   * Stops the autofill animation.
   */
  private stopAutofill(): void {
    this.isAutofillingProperty.value = false;
    this.dropper.isDispensingProperty.value = false;
    this.updateFaucetsAndDropper();
  }

  /**
   * General algorithm for pH.
   * @param solutePH
   * @param soluteVolume liters
   * @param waterVolume liters
   * @returns pH, null if total volume is zero
   */
  public static computePH( solutePH: number, soluteVolume: number, waterVolume: number ): PHValue {
    let pH;
    const totalVolume = soluteVolume + waterVolume;
    if ( totalVolume === 0 ) {
      pH = null;
    }
    else if ( waterVolume === 0 ) {
      pH = solutePH; // to prevent floating-point error in log10 computations
    }
    else if ( soluteVolume === 0 ) {
      pH = Water.pH; // to prevent floating-point error in log10 computations
    }
    else if ( solutePH < 7 ) {
      pH = -log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -Water.pH ) * waterVolume ) / totalVolume );
    }
    else {
      pH = 14 + log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, Water.pH - 14 ) * waterVolume ) / totalVolume );
    }
    return pH;
  }

  /**
   * Compute pH from H3O+ concentration.
   * @param concentration
   * @returns pH, null if concentration is zero
   */
  public static concentrationH3OToPH( concentration: ConcentrationValue ): PHValue {
    return ( concentration === null || concentration === 0 ) ? null : -log10( concentration );
  }

  /**
   * Compute pH from OH- concentration.
   * @param concentration
   * @returns pH, null if concentration is zero
   */
  public static concentrationOHToPH( concentration: ConcentrationValue ): PHValue {
    const pH = PHModel.concentrationH3OToPH( concentration );
    return ( pH === null ) ? null : 14 - pH;
  }

  /**
   * Compute pH from moles of H3O+.
   * @param moles
   * @param volume volume of the solution in liters
   * @returns pH, null if moles or volume is zero
   */
  public static molesH3OToPH( moles: number, volume: number ): PHValue {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationH3OToPH( moles / volume );
  }

  /**
   * Compute pH from moles of OH-.
   * @param moles
   * @param volume volume of the solution in liters
   * @returns pH, null if moles or volume is zero
   */
  public static molesOHToPH( moles: number, volume: number ): PHValue {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationOHToPH( moles / volume );
  }

  /**
   * Computes concentration of H20 from volume.
   * @param volume
   * @returns concentration in moles/L, null if volume is 0
   */
  public static volumeToConcentrationH20( volume: number ): PHValue {
    return ( volume === 0 ) ? null : Water.concentration;
  }

  /**
   * Computes concentration of H3O+ from pH.
   *
   * @param pH null means 'no value'
   * @returns concentration in moles/L, null means no concentration
   */
  public static pHToConcentrationH3O( pH: PHValue ): ConcentrationValue {
    return ( pH === null ) ? null : Math.pow( 10, -pH );
  }

  /**
   * Computes concentration of OH- from pH.
   * @param pH null means 'no value'
   * @returns concentration in moles/L, null means no concentration
   */
  public static pHToConcentrationOH( pH: PHValue ): ConcentrationValue {
    return ( pH === null ) ? null : PHModel.pHToConcentrationH3O( 14 - pH );
  }

  /**
   * Computes the number of particles in solution.
   */
  public static computeParticleCount( concentration: ConcentrationValue, volume: number ): number {
    return ( concentration === null ) ? 0 : ( concentration * volume * AVOGADROS_NUMBER );
  }

  /**
   * Computes moles in solution.
   */
  public static computeMoles( concentration: ConcentrationValue, volume: number ): number {
    return ( concentration === null ) ? 0 : ( concentration * volume );
  }

  /**
   * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
   * Eg, the value displayed to the user is '7.00'.
   */
  public static isEquivalentToWater( pH: PHValue ): boolean {
    return ( pH !== null ) &&
           ( toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ) === Water.pH );
  }
}

phScale.register( 'PHModel', PHModel );
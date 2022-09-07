// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model for the 'Macro' screen. Also serves as the supertype for the 'Micro' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Beaker from '../../common/model/Beaker.js';
import Dropper from '../../common/model/Dropper.js';
import Faucet from '../../common/model/Faucet.js';
import Solute from '../../common/model/Solute.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import PHScaleQueryParameters from '../../common/PHScaleQueryParameters.js';
import phScale from '../../phScale.js';
import MacroPHMeter from './MacroPHMeter.js';
import MacroSolution from './MacroSolution.js';

type SelfOptions = {

  // L, automatically fill beaker with this much solute when the solute changes
  autofillVolume?: number;

  // whether to instantiate this.pHMeter
  includePHMeter?: boolean;

  // used to instantiate the solution
  createSolution?: ( soluteProperty: Property<Solute>, maxVolume: number, tandem: Tandem ) => MacroSolution;
};

export type MacroModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MacroModel {

  // solute choices, in order that they'll appear in the combo box
  // The order is alphabetical (English names), see https://github.com/phetsims/ph-scale/issues/101
  public readonly solutes: Solute[];

  // the beaker, everything else is positioned relative to it
  public readonly beaker: Beaker;

  public readonly dropper: Dropper;

  // solution in the beaker
  public readonly solution: MacroSolution;

  // water faucet, at the beaker's top-right
  public readonly waterFaucet: Faucet;

  // drain faucet, at the beaker's bottom-left
  public readonly drainFaucet: Faucet;

  // optional pH meter, to the left of the drain faucet
  public readonly pHMeter: MacroPHMeter | null;

  // whether the autofill feature is enabled, see https://github.com/phetsims/ph-scale/issues/104
  private readonly autofillEnabledProperty: Property<boolean>;

  // how much (L) to autofill when the solute changes
  private readonly autofillVolume: number;

  public readonly isAutofillingProperty: Property<boolean>;

  public constructor( providedOptions: MacroModelOptions ) {

    const options = optionize<MacroModelOptions, SelfOptions>()( {

      // SelfOptions
      autofillVolume: 0.5,
      includePHMeter: true,
      createSolution: ( solutionProperty, maxVolume, tandem ) => new MacroSolution( solutionProperty, {
        maxVolume: maxVolume,
        tandem: tandem
      } )
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
    this.dropper = new Dropper( Solute.WATER,
      new Vector2( this.beaker.position.x - 50, yDropper ),
      new Bounds2( this.beaker.left + 40, yDropper, this.beaker.right - 200, yDropper ), {
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

    this.pHMeter = null;
    if ( options.includePHMeter ) {
      const pHMeterPosition = new Vector2( this.drainFaucet.position.x - 300, 75 );
      this.pHMeter = new MacroPHMeter(
        pHMeterPosition,
        new Vector2( pHMeterPosition.x + 150, this.beaker.position.y ),
        PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds, {
          tandem: options.tandem.createTandem( 'pHMeter' )
        } );
    }

    this.autofillEnabledProperty = new BooleanProperty( PHScaleQueryParameters.autofill, {
      tandem: options.tandem.createTandem( 'autofillEnabledProperty' ),
      phetioDocumentation: 'whether solute is automatically added to the beaker when the solute is changed'
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
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

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
  }

  public reset(): void {
    this.dropper.reset();
    this.solution.reset();
    this.waterFaucet.reset();
    this.drainFaucet.reset();
    this.pHMeter && this.pHMeter.reset();
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
    if ( this.autofillEnabledProperty.value && this.autofillVolume > 0 ) {
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
}

phScale.register( 'MacroModel', MacroModel );
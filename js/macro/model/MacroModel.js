// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'Macro' screen. Also serves as the supertype for the 'Micro' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
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

class MacroModel {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      autofillVolume: 0.5, // L, automatically fill beaker with this much solute when the solute changes
      includePHMeter: true, // whether to instantiate this.pHMeter

      // {function(solutionProperty:Property,Object:options)} used to instantiate the solution
      createSolution: ( solutionProperty, options ) => new MacroSolution( solutionProperty, options )
    }, options );

    // @public solute choices, in order that they'll appear in the combo box
    // The order is alphabetical (English names), see https://github.com/phetsims/ph-scale/issues/101
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

    // @public Beaker, everything else is positioned relative to it
    this.beaker = new Beaker( PHScaleConstants.BEAKER_POSITION );

    // Dropper above the beaker
    const yDropper = this.beaker.position.y - this.beaker.size.height - 15;
    // @public
    this.dropper = new Dropper( Solute.WATER,
      new Vector2( this.beaker.position.x - 50, yDropper ),
      new Bounds2( this.beaker.left + 40, yDropper, this.beaker.right - 200, yDropper ), {
        tandem: tandem.createTandem( 'dropper' )
      } );

    // @public Solution in the beaker
    this.solution = options.createSolution( this.dropper.soluteProperty, {
      maxVolume: this.beaker.volume,
      tandem: tandem.createTandem( 'solution' )
    } );

    // @public Water faucet at the beaker's top-right
    this.waterFaucet = new Faucet(
      new Vector2( this.beaker.right - 50, this.beaker.position.y - this.beaker.size.height - 45 ),
      this.beaker.right + 400, {
        enabled: this.solution.totalVolumeProperty.get() < this.beaker.volume,
        tandem: tandem.createTandem( 'waterFaucet' )
      } );

    // @public Drain faucet at the beaker's bottom-left.
    this.drainFaucet = new Faucet(
      new Vector2( this.beaker.left - 75, this.beaker.position.y + 43 ),
      this.beaker.left, {
        enabled: this.solution.totalVolumeProperty.get() > 0,
        tandem: tandem.createTandem( 'drainFaucet' )
      } );

    // @public optional pH meter to the left of the drain faucet
    this.pHMeter = null;
    if ( options.includePHMeter ) {
      const pHMeterPosition = new Vector2( this.drainFaucet.position.x - 300, 75 );
      this.pHMeter = new MacroPHMeter(
        pHMeterPosition,
        new Vector2( pHMeterPosition.x + 150, this.beaker.position.y ),
        PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds, {
          tandem: tandem.createTandem( 'pHMeter' )
        } );
    }

    // @private whether the autofill feature is enabled.
    // See https://github.com/phetsims/ph-scale/issues/104
    this.autofillEnabledProperty = new BooleanProperty( PHScaleQueryParameters.autofill, {
      tandem: tandem.createTandem( 'autofillEnabledProperty' ),
      phetioDocumentation: 'whether solute is automatically added to the beaker when the solute is changed'
    } );

    // @private autofill when the solute changes
    this.autofillVolume = options.autofillVolume;

    // @public (read-only)
    this.isAutofillingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isAutofillingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the beaker is in the process of being automatically filled with solute'
    } );

    // animate the dropper adding solute to the beaker
    this.dropper.soluteProperty.link( () => {

      // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
      this.waterFaucet.enabledProperty.set( false );
      this.drainFaucet.enabledProperty.set( false );

      // animate the dropper adding solute to the beaker
      this.startAutofill();
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.solution.totalVolumeProperty.link( volume => {
      this.updateFaucetsAndDropper();
    } );
  }

  /**
   * @public
   */
  reset() {
    this.dropper.reset();
    this.solution.reset();
    this.waterFaucet.reset();
    this.drainFaucet.reset();
    this.pHMeter && this.pHMeter.reset();
    this.startAutofill();
  }

  /**
   * Enables faucets and dropper based on amount of solution in the beaker.
   * @private
   */
  updateFaucetsAndDropper() {
    const volume = this.solution.totalVolumeProperty.get();
    this.waterFaucet.enabledProperty.set( volume < this.beaker.volume );
    this.drainFaucet.enabledProperty.set( volume > 0 );
    this.dropper.enabledProperty.set( volume < this.beaker.volume );
  }

  /**
   * Moves time forward by the specified amount.
   * @param deltaSeconds clock time change, in seconds.
   * @public
   */
  step( deltaSeconds ) {
    if ( this.isAutofillingProperty.get() ) {
      this.stepAutofill( deltaSeconds );
    }
    else {
      this.solution.addSolute( this.dropper.flowRateProperty.get() * deltaSeconds );
      this.solution.addWater( this.waterFaucet.flowRateProperty.get() * deltaSeconds );
      this.solution.drainSolution( this.drainFaucet.flowRateProperty.get() * deltaSeconds );
    }
  }

  /**
   * Starts the autofill animation.
   * @private
   */
  startAutofill() {

    // This is short-circuited while PhET-iO state is being restored. Otherwise autofill would activate and change
    // the restored state. See https://github.com/phetsims/ph-scale/issues/132
    if ( this.autofillEnabledProperty.get() && this.autofillVolume > 0 && !phet.joist.sim.isSettingPhetioStateProperty.get() ) {
      this.isAutofillingProperty.set( true );
      this.dropper.isDispensingProperty.set( true );
      this.dropper.flowRateProperty.set( 0.75 ); // faster than standard flow rate
    }
    else {
      this.updateFaucetsAndDropper();
    }
  }

  /**
   * Advances the autofill animation.
   * @param deltaSeconds clock time change, in seconds
   * @private
   */
  stepAutofill( deltaSeconds ) {
    this.solution.addSolute( Math.min( this.dropper.flowRateProperty.get() * deltaSeconds, this.autofillVolume - this.solution.totalVolumeProperty.get() ) );
    if ( this.solution.totalVolumeProperty.get() === this.autofillVolume ) {
      this.stopAutofill();
    }
  }

  /**
   * Stops the autofill animation.
   * @private
   */
  stopAutofill() {
    this.isAutofillingProperty.set( false );
    this.dropper.isDispensingProperty.set( false );
    this.updateFaucetsAndDropper();
  }
}

phScale.register( 'MacroModel', MacroModel );
export default MacroModel;
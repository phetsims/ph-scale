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
import SoluteInstances from '../../common/model/SoluteInstances.js';
import Solution from '../../common/model/Solution.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import PHScaleQueryParameters from '../../common/PHScaleQueryParameters.js';
import phScale from '../../phScale.js';
import PHMeter from './PHMeter.js';

class MacroModel {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      autoFillVolume: 0.5 // L, automatically fill beaker with this much solute when the solute changes
    }, options );

    // @public solute choices, in order that they'll appear in the combo box
    // The order is alphabetical (English names), see https://github.com/phetsims/ph-scale/issues/101
    this.solutes = [
      SoluteInstances.BATTERY_ACID,
      SoluteInstances.BLOOD,
      SoluteInstances.CHICKEN_SOUP,
      SoluteInstances.COFFEE,
      SoluteInstances.DRAIN_CLEANER,
      SoluteInstances.HAND_SOAP,
      SoluteInstances.MILK,
      SoluteInstances.ORANGE_JUICE,
      SoluteInstances.SODA,
      SoluteInstances.SPIT,
      SoluteInstances.VOMIT,
      SoluteInstances.WATER
    ];

    // @public Beaker, everything else is positioned relative to it
    this.beaker = new Beaker( PHScaleConstants.BEAKER_POSITION );

    // Dropper above the beaker
    const yDropper = this.beaker.position.y - this.beaker.size.height - 15;
    // @public
    this.dropper = new Dropper( SoluteInstances.WATER,
      new Vector2( this.beaker.position.x - 50, yDropper ),
      new Bounds2( this.beaker.left + 40, yDropper, this.beaker.right - 200, yDropper ), {
        tandem: tandem.createTandem( 'dropper' )
      } );

    // @public Solution in the beaker
    this.solution = new Solution( this.dropper.soluteProperty, {
      maxVolume: this.beaker.volume,
      tandem: tandem.createTandem( 'solution' )
    } );

    // @public Water faucet at the beaker's top-right
    this.waterFaucet = new Faucet(
      new Vector2( this.beaker.right - 50, this.beaker.position.y - this.beaker.size.height - 45 ),
      this.beaker.right + 400, {
        enabled: this.solution.volumeProperty.get() < this.beaker.volume,
        tandem: tandem.createTandem( 'waterFaucet' )
      } );

    // @public Drain faucet at the beaker's bottom-left.
    this.drainFaucet = new Faucet(
      new Vector2( this.beaker.left - 75, this.beaker.position.y + 43 ),
      this.beaker.left, {
        enabled: this.solution.volumeProperty.get() > 0,
        tandem: tandem.createTandem( 'drainFaucet' )
      } );

    // @public pH meter to the left of the drain faucet
    const pHMeterPosition = new Vector2( this.drainFaucet.position.x - 300, 75 );
    this.pHMeter = new PHMeter(
      pHMeterPosition,
      new Vector2( pHMeterPosition.x + 150, this.beaker.position.y ),
      PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds, {
        tandem: tandem.createTandem( 'pHMeter' )
      } );

    // @private whether the auto-fill feature is enabled.
    // See https://github.com/phetsims/ph-scale/issues/104
    this.autoFillEnabledProperty = new BooleanProperty( PHScaleQueryParameters.autoFill, {
      tandem: tandem.createTandem( 'autoFillEnabledProperty' ),
      phetioDocumentation: 'whether solute is automatically added to the beaker when the solute is changed'
    } );

    // @private auto-fill when the solute changes
    this.autoFillVolume = options.autoFillVolume;

    // @public (read-only)
    this.isAutoFillingProperty = new BooleanProperty( false );

    this.dropper.soluteProperty.link( () => {

      // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
      this.waterFaucet.enabledProperty.set( false );
      this.drainFaucet.enabledProperty.set( false );

      // animate the dropper adding solute to the beaker
      this.startAutoFill();
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.solution.volumeProperty.link( volume => {
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
    this.pHMeter.reset();
    this.startAutoFill();
  }

  /**
   * Enables faucets and dropper based on amount of solution in the beaker.
   * @private
   */
  updateFaucetsAndDropper() {
    const volume = this.solution.volumeProperty.get();
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
    if ( this.isAutoFillingProperty.value ) {
      this.stepAutoFill( deltaSeconds );
    }
    else {
      this.solution.addSolute( this.dropper.flowRateProperty.get() * deltaSeconds );
      this.solution.addWater( this.waterFaucet.flowRateProperty.get() * deltaSeconds );
      this.solution.drainSolution( this.drainFaucet.flowRateProperty.get() * deltaSeconds );
    }
  }

  /**
   * Starts the auto-fill animation.
   * @private
   */
  startAutoFill() {

    // This is short-circuited while PhET-iO state is being restored. Otherwise autoFill would activate and change
    // the restored state. See https://github.com/phetsims/ph-scale/issues/132
    if ( this.autoFillEnabledProperty.value && this.autoFillVolume > 0 && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
      this.isAutoFillingProperty.value = true;
      this.dropper.dispensingProperty.set( true );
      this.dropper.flowRateProperty.set( 0.75 ); // faster than standard flow rate
    }
  }

  /**
   * Advances the auto-fill animation.
   * @param deltaSeconds clock time change, in seconds
   * @private
   */
  stepAutoFill( deltaSeconds ) {
    this.solution.addSolute( Math.min( this.dropper.flowRateProperty.get() * deltaSeconds, this.autoFillVolume - this.solution.volumeProperty.get() ) );
    if ( this.solution.volumeProperty.get() === this.autoFillVolume ) {
      this.stopAutoFill();
    }
  }

  /**
   * Stops the auto-fill animation.
   * @private
   */
  stopAutoFill() {
    this.isAutoFillingProperty.value = false;
    this.dropper.dispensingProperty.set( false );
    this.updateFaucetsAndDropper();
  }
}

phScale.register( 'MacroModel', MacroModel );
export default MacroModel;
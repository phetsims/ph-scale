// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'Macro' screen. Also serves as the supertype for the 'Micro' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Beaker = require( 'PH_SCALE/common/model/Beaker' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Dropper = require( 'PH_SCALE/common/model/Dropper' );
  const Faucet = require( 'PH_SCALE/common/model/Faucet' );
  const merge = require( 'PHET_CORE/merge' );
  const PHMeter = require( 'PH_SCALE/macro/model/PHMeter' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Solution = require( 'PH_SCALE/common/model/Solution' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

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

      // @public solute choices, in order that they'll appear in the combo box (decreasing pH value)
      this.solutes = [
        Solute.DRAIN_CLEANER,
        Solute.HAND_SOAP,
        Solute.BLOOD,
        Solute.SPIT,
        Solute.WATER,
        Solute.MILK,
        Solute.CHICKEN_SOUP,
        Solute.COFFEE,
        Solute.ORANGE_JUICE,
        Solute.SODA,
        Solute.VOMIT,
        Solute.BATTERY_ACID
      ];

      // @public Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
      //TODO #92 is there any reason to instrument the Beaker model?
      this.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

      // Dropper above the beaker
      const yDropper = this.beaker.position.y - this.beaker.size.height - 15;
      // @public
      this.dropper = new Dropper( Solute.WATER,
        new Vector2( this.beaker.position.x - 50, yDropper ),
        new Bounds2( this.beaker.left + 40, yDropper, this.beaker.right - 200, yDropper ), {
        tandem: tandem.createTandem( 'dropper' )
        } );

      // @public Solution in the beaker
      this.solution = new Solution( this.dropper.soluteProperty, 0, 0, this.beaker.volume );

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

      // @private auto-fill when the solute changes
      this.autoFillVolume = options.autoFillVolume;

      // @public (read-only)
      //TODO #92 any reason to instrument this?
      this.isAutoFillingProperty = new BooleanProperty( false );

      this.dropper.soluteProperty.link( () => {

        // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
        //TODO #92 this might be handled better via interruptSubtreeInput
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
      this.beaker.reset();
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
      this.isAutoFillingProperty.value = true;
      this.dropper.dispensingProperty.set( true );
      this.dropper.flowRateProperty.set( 0.75 ); // faster than standard flow rate
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

  return phScale.register( 'MacroModel', MacroModel );
} );

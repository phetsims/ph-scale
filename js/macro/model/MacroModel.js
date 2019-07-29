// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the 'Macro' screen. Also serves as the supertype for the 'Micro' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Dropper = require( 'PH_SCALE/common/model/Dropper' );
  var Faucet = require( 'PH_SCALE/common/model/Faucet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHMeter = require( 'PH_SCALE/macro/model/PHMeter' );
  var phScale = require( 'PH_SCALE/phScale' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function MacroModel( options ) {

    options = _.extend( {
      autoFillVolume: 0.5 // L, automatically fill beaker with this much solute when the solute changes
    }, options );

    var self = this;

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
    this.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

    // Dropper above the beaker
    var yDropper = this.beaker.location.y - this.beaker.size.height - 15;
    // @public
    this.dropper = new Dropper( Solute.WATER,
      new Vector2( this.beaker.location.x - 50, yDropper ),
      new Bounds2( this.beaker.left + 40, yDropper, this.beaker.right - 200, yDropper ) );

    // @public Solution in the beaker
    this.solution = new Solution( this.dropper.soluteProperty, 0, 0, this.beaker.volume );

    // @public Water faucet at the beaker's top-right
    this.waterFaucet = new Faucet( new Vector2( this.beaker.right - 50, this.beaker.location.y - this.beaker.size.height - 45 ),
      this.beaker.right + 400,
      { enabled: this.solution.volumeProperty.get() < this.beaker.volume } );

    // @public Drain faucet at the beaker's bottom-left.
    this.drainFaucet = new Faucet( new Vector2( this.beaker.left - 75, this.beaker.location.y + 43 ), this.beaker.left,
      { enabled: this.solution.volumeProperty.get() > 0 } );

    // pH meter to the left of the drain faucet
    var pHMeterLocation = new Vector2( this.drainFaucet.location.x - 300, 75 );
    this.pHMeter = new PHMeter( pHMeterLocation, new Vector2( pHMeterLocation.x + 150, this.beaker.location.y ),
      PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds );

    // auto-fill when the solute changes
    this.autoFillVolume = options.autoFillVolume; // @private

    // @public (read-only)
    this.isAutoFillingProperty = new BooleanProperty( false );

    this.dropper.soluteProperty.link( function() {
      // disable the faucets to cancel any multi-touch interaction that may be in progress, see issue #28
      self.waterFaucet.enabledProperty.set( false );
      self.drainFaucet.enabledProperty.set( false );
      // animate the dropper adding solute to the beaker
      self.startAutoFill();
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.solution.volumeProperty.link( function( volume ) {
      self.updateFaucetsAndDropper();
    } );
  }

  phScale.register( 'MacroModel', MacroModel );

  return inherit( Object, MacroModel, {

    // @public
    reset: function() {
      this.beaker.reset();
      this.dropper.reset();
      this.solution.reset();
      this.waterFaucet.reset();
      this.drainFaucet.reset();
      this.pHMeter.reset();
      this.startAutoFill();
    },

    /*
     * Enables faucets and dropper based on amount of solution in the beaker.
     * @private
     */
    updateFaucetsAndDropper: function() {
      var volume = this.solution.volumeProperty.get();
      this.waterFaucet.enabledProperty.set( volume < this.beaker.volume );
      this.drainFaucet.enabledProperty.set( volume > 0 );
      this.dropper.enabledProperty.set( volume < this.beaker.volume );
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     * @public
     */
    step: function( deltaSeconds ) {
      if ( this.isAutoFillingProperty.value ) {
        this.stepAutoFill( deltaSeconds );
      }
      else {
        this.solution.addSolute( this.dropper.flowRateProperty.get() * deltaSeconds );
        this.solution.addWater( this.waterFaucet.flowRateProperty.get() * deltaSeconds );
        this.solution.drainSolution( this.drainFaucet.flowRateProperty.get() * deltaSeconds );
      }
    },

    /**
     * Starts the auto-fill animation.
     * @private
     */
    startAutoFill: function() {
      this.isAutoFillingProperty.value = true;
      this.dropper.dispensingProperty.set( true );
      this.dropper.flowRateProperty.set( 0.75 ); // faster than standard flow rate
    },

    /**
     * Advances the auto-fill animation.
     * @param deltaSeconds clock time change, in seconds
     * @private
     */
    stepAutoFill: function( deltaSeconds ) {
      this.solution.addSolute( Math.min( this.dropper.flowRateProperty.get() * deltaSeconds, this.autoFillVolume - this.solution.volumeProperty.get() ) );
      if ( this.solution.volumeProperty.get() === this.autoFillVolume ) {
        this.stopAutoFill();
      }
    },

    /**
     * Stops the auto-fill animation.
     * @private
     */
    stopAutoFill: function() {
      this.isAutoFillingProperty.value = false;
      this.dropper.dispensingProperty.set( false );
      this.updateFaucetsAndDropper();
    }
  } );
} );

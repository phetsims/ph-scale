// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Util = require( 'DOT/Util' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23;

  /**
   * @param {Property<Solute>} soluteProperty
   * @param {number} soluteVolume liters
   * @param {Water} water
   * @param {number} waterVolume liters
   * @param {number} maxVolume liters
   * @param {*} options
   */
  function Solution( soluteProperty, soluteVolume, water, waterVolume, maxVolume, options ) {
    assert && assert( soluteVolume + waterVolume <= maxVolume );

    options = _.extend( {
      emptyWhenSoluteChanges: true // whether to empty the solution when the solute changes
    }, options );

    var thisSolution = this;

    thisSolution.soluteProperty = soluteProperty;
    thisSolution.soluteVolumeProperty = new Property( soluteVolume );
    thisSolution.water = water;
    thisSolution.waterVolumeProperty = new Property( waterVolume );
    thisSolution.maxVolume = maxVolume;

    // volume
    thisSolution.volumeProperty = new DerivedProperty( [ thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function( soluteVolume, waterVolume ) {
        return soluteVolume + waterVolume;
      }
    );

    // pH, null if no value
    thisSolution.pHProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      this.computePH.bind( this ) );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.pHProperty ],
      thisSolution.computeColor.bind( this ) );

    // solute
    thisSolution.soluteProperty.link( function() {
      if ( options.emptyWhenSoluteChanges ) {
        thisSolution.waterVolumeProperty.set( 0 );
        thisSolution.soluteVolumeProperty.set( 0 );
      }
    } );
  }

  Solution.prototype = {

    // @override
    reset: function() {
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.waterVolumeProperty.reset();
    },

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    isEmpty: function() { return this.volumeProperty.get() === 0; },

    isFull: function() { return this.volumeProperty.get() === this.maxVolume; },

    // Returns the amount of volume that is available to fill.
    getFreeVolume: function() { return this.maxVolume - this.volumeProperty.get(); },

    // Convenience function for adding solute
    addSolute: function( deltaVolume ) {
      this.soluteVolumeProperty.set( this.soluteVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) );
    },

    // Convenience function for adding water
    addWater: function( deltaVolume ) {
      this.waterVolumeProperty.set( this.waterVolumeProperty.get() + Math.min( deltaVolume, this.getFreeVolume() ) );
    },

    /**
     * Drains a specified amount of solution.
     * @param {Number} deltaVolume amount of solution to drain, in liters
     */
    drainSolution: function( deltaVolume ) {
      var totalVolume = this.volumeProperty.get();
      if ( totalVolume > 0 ) {
        if ( deltaVolume >= totalVolume ) {
          // drain the remaining solution
          this.waterVolumeProperty.set( 0 );
          this.soluteVolumeProperty.set( 0 );
        }
        else {
          // drain equal percentages of water and solute
          var waterVolume = this.waterVolumeProperty.get();
          var soluteVolume = this.soluteVolumeProperty.get();
          this.waterVolumeProperty.set( waterVolume - ( deltaVolume * waterVolume / totalVolume ) );
          this.soluteVolumeProperty.set( soluteVolume - ( deltaVolume * soluteVolume / totalVolume ) );
        }
      }
    },

    //----------------------------------------------------------------------------
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    //TODO this should be converted to Solution.concentrationH3O_to_pH, then let LogarithmicGraph create the custom solute
    setConcentrationH3O: function( c ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = -Util.log10( c );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getConcentrationH3O: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -pH );
    },

    //TODO this should be converted to Solution.concentrationOH_to_pH, then let LogarithmicGraph create the custom solute
    setConcentrationOH: function( c ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = 14 + Util.log10( c );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getConcentrationOH: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -( 14 - pH ) );
    },

    getConcentrationH2O: function() {
      return ( this.isEmpty() ? 0 : 55 );
    },

    //----------------------------------------------------------------------------
    // Number of molecules
    //----------------------------------------------------------------------------

    getMoleculesH3O: function() {
      return Solution.computeMolecules( this.getConcentrationH3O(), this.volumeProperty.get() );
    },

    getMoleculesOH: function() {
      return Solution.computeMolecules( this.getConcentrationOH(), this.volumeProperty.get() );
    },

    getMoleculesH2O: function() {
      return Solution.computeMolecules( this.getConcentrationH2O(), this.volumeProperty.get() );
    },

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    //TODO this should be converted to Solution.molesH3O_to_pH, then let LogarithmicGraph create the custom solute
    setMolesH3O: function( m ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = -Util.log10( m / this.volumeProperty.get() );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getMolesH3O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH3O() );
    },

    //TODO this should be converted to Solution.molesOH_to_pH, then let LogarithmicGraph create the custom solute
    setMolesOH: function( m ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = 14 + Util.log10( m / this.volumeProperty.get() );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getMolesOH: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationOH() );
    },

    getMolesH2O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH2O() );
    },

    //----------------------------------------------------------------------------
    // private
    //----------------------------------------------------------------------------

    // Computes the solution's pH.
    computePH: function() {

      var solutePH = this.soluteProperty.get().pH;
      var soluteVolume = this.soluteVolumeProperty.get();
      var waterPH = this.water.pH;
      var waterVolume = this.waterVolumeProperty.get();

      var pH;
      if ( soluteVolume + waterVolume === 0 ) {
        pH = null;
      }
      else if ( solutePH < 7 ) {
        pH = -Util.log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -waterPH ) * waterVolume ) / ( soluteVolume + waterVolume ) );
      }
      else {
        pH = 14 + Util.log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, waterPH - 14 ) * waterVolume ) / ( soluteVolume + waterVolume ) );
      }
      return pH;
    },

    // Computes the solution's color.
    computeColor: function() {
      if ( this.volumeProperty.get() === 0 || this.soluteVolumeProperty.get() === 0 || this.isEquivalentToWater() ) {
        return this.water.color;
      }
      else {
        return this.soluteProperty.get().computeColor( this.soluteVolumeProperty.get() / this.volumeProperty.get() );
      }
    },

    /*
     * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
     * Eg, the value displayed to the user is '7.00'.
     */
    isEquivalentToWater: function() {
      var pHString = Util.toFixed( this.pHProperty.get(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return ( parseFloat( pHString ) === this.water.pH ) && ( this.waterVolumeProperty.get() > 0 );
    }
  };

  /**
   * Computes the number of molecules in solution.
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   */
  Solution.computeMolecules = function( concentration, volume ) {
    return concentration * AVOGADROS_NUMBER * volume;
  };

  /**
   * Computes moles in solution.
   * @param {number} volume L
   * @param {number} concentration moles/L
   * @returns {number} moles
   */
  Solution.computeMoles = function( volume, concentration ) {
    return volume * concentration;
  };

  return Solution;
} );
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var log10 = require( 'DOT/Util' ).log10;
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23;

  /**
   * @param {Property<Solute>} soluteProperty
   * @param {number} soluteVolume liters
   * @param {Water} water
   * @param {number} waterVolume liters
   * @param {number} maxVolume liters
   */
  function Solution( soluteProperty, soluteVolume, water, waterVolume, maxVolume ) {
    assert && assert( soluteVolume + waterVolume <= maxVolume );

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
      function( solute, soluteVolume, waterVolume ) {
        return Solution.computePH( solute.pHProperty.get(), soluteVolume, thisSolution.water.pH, waterVolume );
      }
    );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function() {
        return Solution.computeColor(
          thisSolution.soluteProperty.get().color, thisSolution.soluteProperty.get().dilutedColor, thisSolution.soluteVolumeProperty.get(),
          thisSolution.water.color, thisSolution.waterVolumeProperty.get() );
      }
    );

    // solute
    thisSolution.soluteProperty.link( function() {
      thisSolution.waterVolumeProperty.set( 0 );
      thisSolution.soluteVolumeProperty.set( 0 );
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

    //----------------------------------------------------------------------------
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    setConcentrationH3O: function( c ) {
      this.soluteProperty.get().pHProperty.set( -log10( c ) );
    },

    getConcentrationH3O: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -pH );
    },

    setConcentrationOH: function( c ) {
      this.soluteProperty.get().pHProperty.set( 14 - ( -log10( c ) ) );
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

    setMolesH3O: function( m ) {
      this.soluteProperty.get().pHProperty.set( -log10( m / this.volumeProperty.get() ) );
    },

    getMolesH3O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH3O() );
    },

    setMolesOH: function( m ) {
      this.soluteProperty.get().pHProperty.set( 14 - ( -log10( m / this.volumeProperty.get() ) ) );
    },

    getMolesOH: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationOH() );
    },

    getMolesH2O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH2O() );
    }
  };

  /**
   * Computes the pH of a solution.
   * Combining acids and bases is not supported by this model.
   * @param solutePH
   * @param soluteVolume
   * @param waterPH
   * @param waterVolume
   * @returns {number|null} null if the solution's volume is zero
   */
  Solution.computePH = function( solutePH, soluteVolume, waterPH, waterVolume ) {
    var pH;
    if ( soluteVolume + waterVolume === 0 ) {
      pH = null;
    }
    else if ( solutePH < 7 ) {
      assert && assert( waterPH <= 7 ); // combining acids and bases is not supported
      pH = -log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -waterPH ) * waterVolume ) / ( soluteVolume + waterVolume ) );
    }
    else {
      assert && assert( waterPH >= 7 ); // combining acids and bases is not supported
      pH = 14 + log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, waterPH - 14 ) * waterVolume ) / ( soluteVolume + waterVolume ) );
    }
    return pH;
  };

  /**
   * Computes the color of a solution.
   * @param {Color} soluteColor
   * @param {Color} soluteDilutedColor
   * @param {Number} soluteVolume
   * @param {Color} waterColor
   * @param {Number} waterVolume
   * @returns {Color} waterColor if the solution's volume is zero
   */
  Solution.computeColor = function( soluteColor, soluteDilutedColor, soluteVolume, waterColor, waterVolume ) {
    var color;
    var solutionVolume = soluteVolume + waterVolume;
    if ( solutionVolume === 0 || soluteVolume === 0 ) {
      color = waterColor;
    }
    else {
      color = Color.interpolateRBGA( soluteDilutedColor, soluteColor, soluteVolume / solutionVolume );
    }
    return color;
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
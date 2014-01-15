// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is the core model of pH Scale. All fundamental computations are encapsulated here.
 * Throughout this model, a null pH value means 'no value'.
 * This is the case when the solution volume is zero (beaker is empty).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Util = require( 'DOT/Util' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23; // number of molecules in one mole of solution

  return {

    /**
     * Computes a solution's pH.
     *
     * @param {Solution} solution
     * @return {Number} pH, null if solution's total volume is zero
     */
    solutionToPH: function( solution ) {

      var solutePH = solution.soluteProperty.get().pH;
      var soluteVolume = solution.soluteVolumeProperty.get();
      var waterPH = solution.water.pH;
      var waterVolume = solution.waterVolumeProperty.get();

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

    /**
     * Compute pH from H3O+ concentration.
     *
     * @param {Number} concentration
     * @returns {number} pH, null if concentration is zero
     */
    concentrationH3OToPH: function( concentration ) {
      return ( concentration === 0 ) ? null : -Util.log10( concentration );
    },

    /**
     * Compute pH from OH- concentration.
     *
     * @param {Number} concentration
     * @returns {number} pH, null if concentration is zero
     */
    concentrationOHToPH: function( concentration ) {
      return ( concentration === 0 ) ? null : 14 - this.concentrationH3OToPH( concentration );
    },

    /**
     * Compute pH from moles of H3O+.
     *
     * @param {Number} moles
     * @param {Number} volume volume of the solution in liters
     * @returns {Number} pH, null if moles or volume is zero
     */
    molesH3OToPH: function( moles, volume ) {
      return ( moles === 0 || volume === 0 ) ? null : this.concentrationH3OToPH( moles / volume );
    },

    /**
     * Compute pH from moles of OH-.
     *
     * @param {Number} moles
     * @param {Number} volume volume of the solution in liters
     * @returns {Number} pH, null if moles or volume is zero
     */
    molesOHToPH: function( moles, volume ) {
      return ( moles === 0 || volume === 0 ) ? null : this.concentrationOHToPH( moles / volume );
    },

    /**
     * Computes concentration of H3O+ from pH.
     *
     * @param {Number} pH null mean 'no value'
     * @returns {Number} concentration in moles/L
     */
    pHToConcentrationH3O: function( pH ) {
      return ( pH === null ) ? 0 : Math.pow( 10, -pH );
    },

    /**
     * Computes concentration of OH- from pH.
     *
     * @param {Number} pH null means 'no value'
     * @returns {Number} concentration in moles/L
     */
    pHToConcentrationOH: function( pH ) {
      return ( pH === null ) ? 0 : Math.pow( 10, -( 14 - pH ) );
    },

    /**
     * Computes the number of molecules in solution.
     *
     * @param {number} concentration moles/L
     * @param {number} volume L
     * @returns {number} moles
     */
    computeMolecules: function( concentration, volume ) {
      return concentration * volume * AVOGADROS_NUMBER;
    },

    /**
     * Computes moles in solution.
     *
     * @param {number} concentration moles/L
     * @param {number} volume L
     * @returns {number} moles
     */
    computeMoles: function( concentration, volume ) {
      return concentration * volume;
    }
  };
} );
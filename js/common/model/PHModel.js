// Copyright 2014-2020, University of Colorado Boulder

/**
 * This is the core model of pH Scale. All fundamental computations are encapsulated here.
 * Throughout this model, a null pH value means 'no value'.
 * This is the case when the solution volume is zero (beaker is empty).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import phScale from '../../phScale.js';
import Water from './Water.js';

// constants
const AVOGADROS_NUMBER = 6.023E23; // number of molecules in one mole of solution

const PHModel = {

  /**
   * General algorithm for pH.
   *
   * @param {number} solutePH
   * @param {number} soluteVolume liters
   * @param {number} waterVolume liters
   * @returns {number|null} pH, null if total volume is zero
   * @public
   */
  computePH( solutePH, soluteVolume, waterVolume ) {
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
      pH = -Utils.log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -Water.pH ) * waterVolume ) / totalVolume );
    }
    else {
      pH = 14 + Utils.log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, Water.pH - 14 ) * waterVolume ) / totalVolume );
    }
    return pH;
  },

  /**
   * Compute pH from H3O+ concentration.
   *
   * @param {number} concentration
   * @returns {number} pH, null if concentration is zero
   * @public
   */
  concentrationH3OToPH( concentration ) {
    return ( concentration === 0 ) ? null : -Utils.log10( concentration );
  },

  /**
   * Compute pH from OH- concentration.
   *
   * @param {number} concentration
   * @returns {number} pH, null if concentration is zero
   * @public
   */
  concentrationOHToPH( concentration ) {
    return ( concentration === 0 ) ? null : 14 - PHModel.concentrationH3OToPH( concentration );
  },

  /**
   * Compute pH from moles of H3O+.
   *
   * @param {number} moles
   * @param {number} volume volume of the solution in liters
   * @returns {number} pH, null if moles or volume is zero
   * @public
   */
  molesH3OToPH( moles, volume ) {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationH3OToPH( moles / volume );
  },

  /**
   * Compute pH from moles of OH-.
   *
   * @param {number} moles
   * @param {number} volume volume of the solution in liters
   * @returns {number} pH, null if moles or volume is zero
   * @public
   */
  molesOHToPH( moles, volume ) {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationOHToPH( moles / volume );
  },

  /**
   * Computes concentration of H20 from volume.
   *
   * @param {number} volume
   * @returns {number} concentration in moles/L
   * @public
   */
  volumeToConcentrationH20( volume ) {
    return ( volume === 0 ) ? null : Water.concentration;
  },

  /**
   * Computes concentration of H3O+ from pH.
   *
   * @param {number} pH null mean 'no value'
   * @returns {number} concentration in moles/L
   * @public
   */
  pHToConcentrationH3O( pH ) {
    return ( pH === null ) ? null : Math.pow( 10, -pH );
  },

  /**
   * Computes concentration of OH- from pH.
   *
   * @param {number} pH null means 'no value'
   * @returns {number} concentration in moles/L
   * @public
   */
  pHToConcentrationOH( pH ) {
    return ( pH === null ) ? null : PHModel.pHToConcentrationH3O( 14 - pH );
  },

  /**
   * Computes the number of molecules in solution.
   *
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   * @public
   */
  computeMolecules( concentration, volume ) {
    return concentration * volume * AVOGADROS_NUMBER;
  },

  /**
   * Computes moles in solution.
   *
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   * @public
   */
  computeMoles( concentration, volume ) {
    return concentration * volume;
  }
};

phScale.register( 'PHModel', PHModel );
export default PHModel;
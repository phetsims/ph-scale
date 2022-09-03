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
   * @param solutePH
   * @param soluteVolume liters
   * @param waterVolume liters
   * @returns pH, null if total volume is zero
   */
  computePH( solutePH: number, soluteVolume: number, waterVolume: number ): number | null {
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
   * @param concentration
   * @returns pH, null if concentration is zero
   */
  concentrationH3OToPH( concentration: number ): number | null {
    return ( concentration === 0 ) ? null : -Utils.log10( concentration );
  },

  /**
   * Compute pH from OH- concentration.
   * @param concentration
   * @returns pH, null if concentration is zero
   */
  concentrationOHToPH( concentration: number ): number | null {
    const pH = PHModel.concentrationH3OToPH( concentration );
    return ( pH === null || concentration === 0 ) ? null : 14 - pH;
  },

  /**
   * Compute pH from moles of H3O+.
   * @param moles
   * @param volume volume of the solution in liters
   * @returns pH, null if moles or volume is zero
   */
  molesH3OToPH( moles: number, volume: number ): number | null {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationH3OToPH( moles / volume );
  },

  /**
   * Compute pH from moles of OH-.
   * @param moles
   * @param volume volume of the solution in liters
   * @returns pH, null if moles or volume is zero
   */
  molesOHToPH( moles: number, volume: number ): number | null {
    return ( moles === 0 || volume === 0 ) ? null : PHModel.concentrationOHToPH( moles / volume );
  },

  /**
   * Computes concentration of H20 from volume.
   * @param volume
   * @returns concentration in moles/L, null if volume is 0
   */
  volumeToConcentrationH20( volume: number ): number | null {
    return ( volume === 0 ) ? null : Water.concentration;
  },

  /**
   * Computes concentration of H3O+ from pH.
   *
   * @param pH null means 'no value'
   * @returns concentration in moles/L, null means no concentration
   */
  pHToConcentrationH3O( pH: number | null ): number | null {
    return ( pH === null ) ? null : Math.pow( 10, -pH );
  },

  /**
   * Computes concentration of OH- from pH.
   * @param pH null means 'no value'
   * @returns concentration in moles/L, null means no concentration
   */
  pHToConcentrationOH( pH: number | null ): number | null {
    return ( pH === null ) ? null : PHModel.pHToConcentrationH3O( 14 - pH );
  },

  /**
   * Computes the number of molecules in solution.
   */
  computeMolecules( concentration: number | null, volume: number ): number {
    return ( concentration === null ) ? 0 : ( concentration * volume * AVOGADROS_NUMBER );
  },

  /**
   * Computes moles in solution.
   */
  computeMoles( concentration: number | null, volume: number ): number {
    return ( concentration === null ) ? 0 : ( concentration * volume );
  }
};

phScale.register( 'PHModel', PHModel );
export default PHModel;
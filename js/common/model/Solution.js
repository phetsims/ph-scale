// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent is constant, solute is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var log10 = require( 'DOT/Util' ).log10;
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23;

  /**
   * @param {Solute} solute the default solute
   * @param {number} soluteVolume liters
   * @param {Solvent} solvent
   * @param {number} solventVolume liters
   * @param {number} maxVolume liters
   */
  function Solution( solute, soluteVolume, solvent, solventVolume, maxVolume ) {
    assert && assert( soluteVolume + solventVolume <= maxVolume );

    var thisSolution = this;

    thisSolution.solvent = solvent;
    thisSolution.maxVolume = maxVolume;

    PropertySet.call( thisSolution, { solute: solute, soluteVolume: soluteVolume, solventVolume: solventVolume } );

    thisSolution.addDerivedProperty( 'pH', [ 'solute', 'soluteVolume', 'solventVolume' ],
      function( solute, soluteVolume, solventVolume ) {
        return Solution.computePH( solute.pH, soluteVolume, thisSolution.solvent.pH, solventVolume );
      }
    );

    thisSolution.addDerivedProperty( 'color', [ 'solute', 'soluteVolume', 'solventVolume' ],
      function( solute, soluteVolume, solventVolume ) {
        return Solution.computeColor( solute.color, soluteVolume, thisSolution.solvent.color, solventVolume );
      } );
  }

  return inherit( PropertySet, Solution, {

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    //TODO does this need to be constrained to 2 decimal places, as in Java sim?
    getVolume: function() { return this.soluteVolume + this.solventVolume; },

    isEmpty: function() { return this.getVolume() === 0; },

    isFull: function() { return this.getVolume() === this.maxVolume; },

    //----------------------------------------------------------------------------
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    setConcentrationH3O: function( c ) {
      this.solute.pH = -log10( c );
    },

    getConcentrationH3O: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -pH );
    },

    setConcentrationOH: function( c ) {
      this.solute.pH = 14 - ( -log10( c ) );
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
      return Solution.computeMolecules( this.getConcentrationH3O(), this.getVolume() );
    },

    getMoleculesOH: function() {
      return Solution.computeMolecules( this.getConcentrationOH(), this.getVolume() );
    },

    getMoleculesH2O: function() {
      return Solution.computeMolecules( this.getConcentrationH2O(), this.getVolume() );
    },

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    setMolesH3O: function( m ) {
      this.solute.pH = -log10( m / this.getVolume() );
    },

    getMolesH3O: function() {
      return Solution.computeMoles( this.getVolume(), this.getConcentrationH3O() );
    },

    setMolesOH: function( m ) {
      this.solute.pH = 14 - ( -log10( m / this.getVolume() ) );
    },

    getMolesOH: function() {
      return Solution.computeMoles( this.getVolume(), this.getConcentrationOH() );
    },

    getMolesH2O: function() {
      return Solution.computeMoles( this.getVolume(),  this.getConcentrationH2O() );
    }
  }, {
    // static properties

    /**
     * Computes the pH of a solution.
     * Combining acids and bases is not supported by this model.
     * @param solutePH
     * @param soluteVolume
     * @param solventPH
     * @param solventVolume
     * @returns {number|null} null if the solution's volume is zero
     */
    computePH: function( solutePH, soluteVolume, solventPH, solventVolume ) {
      assert && assert( solutePH <= 7 && solventPH <= 7 ) || ( solutePH >= 7 && solventPH >= 7 ); // combining acids and bases is not supported
      var pH;
      if ( soluteVolume + solventVolume === 0 ) {
        pH = null;
      }
      else if ( solutePH < 7 ) {
        pH = -log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -solventPH ) * solventVolume ) / ( soluteVolume + solventVolume ) );
      }
      else {
        pH = 14 + log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, solventPH - 14 ) * solventVolume ) / ( soluteVolume + solventVolume ) );
      }
      return pH;
    },

    /**
     * Computes the color of a solution.
     * @param soluteColor
     * @param soluteVolume
     * @param solventColor
     * @param solventVolume
     * @returns {number|null} liters, null if the solution's volume is zero
     */
    computeColor: function( soluteColor, soluteVolume, solventColor, solventVolume ) {
      var color = null;
      var volume = soluteVolume + solventVolume;
      if ( volume > 0 ) {
        if ( soluteVolume === 0 ) {
          // all solvent
          color = solventColor;
        }
        else if ( solventVolume === 0 ) {
          // no solvent
          color = soluteColor;
        }
        else {
          // dilute solute with solvent
          color = soluteColor.withAlpha( soluteColor.a * ( soluteVolume / volume ) );
        }
      }
      return color;
    },

    /**
     * Computes the number of molecules in solution.
     * @param {number} concentration moles/L
     * @param {number} volume L
     * @returns {number} moles
     */
    computeMolecules: function( concentration, volume ) {
      return concentration * AVOGADROS_NUMBER * volume;
    },

    /**
     * Computes moles in solution.
     * @param {number} volume L
     * @param {number} concentration moles/L
     * @returns {number} moles
     */
    computeMoles: function( volume, concentration ) {
      return volume * concentration;
    }
  } );
} );
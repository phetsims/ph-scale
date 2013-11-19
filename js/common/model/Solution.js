// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent is constant, solute is variable.
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
   * @param {Solvent} solvent
   * @param {number} solventVolume liters
   * @param {number} maxVolume liters
   */
  function Solution( soluteProperty, soluteVolume, solvent, solventVolume, maxVolume ) {
    assert && assert( soluteVolume + solventVolume <= maxVolume );

    var thisSolution = this;

    thisSolution.soluteProperty = soluteProperty;
    thisSolution.soluteVolumeProperty = new Property( soluteVolume );
    thisSolution.solvent = solvent;
    thisSolution.solventVolumeProperty = new Property( solventVolume );
    thisSolution.maxVolume = maxVolume;

    // volume
    thisSolution.volumeProperty = new DerivedProperty( [ thisSolution.soluteVolumeProperty, thisSolution.solventVolumeProperty ],
      function( soluteVolume, solventVolume ) {
        return Math.min( maxVolume, soluteVolume + solventVolume );
      }
    );

    // pH, null if no value
    thisSolution.pHProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.solventVolumeProperty ],
      function( solute, soluteVolume, solventVolume ) {
        return Solution.computePH( solute.pHProperty.get(), soluteVolume, thisSolution.solvent.pH, solventVolume );
      }
    );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.solventVolumeProperty ],
      function() {
        return Solution.computeColor(
          thisSolution.soluteProperty.get().color, thisSolution.soluteProperty.get().dilutedColor, thisSolution.soluteVolumeProperty.get(),
          thisSolution.solvent.color, thisSolution.solventVolumeProperty.get() )
      }
    );

    // solute
    thisSolution.soluteProperty.link( function() {
      var soluteVolume = thisSolution.volumeProperty.get();
      thisSolution.solventVolumeProperty.set( 0 );
      thisSolution.soluteVolumeProperty.set( 0 );
    } );
  }

  Solution.prototype = {

    // @override
    reset: function() {
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.solventVolumeProperty.reset();
    },

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    //TODO is this necessary? Can it be replaced with this.volumeProperty.get()? Or visa versa?
    /**
     * Gets the volume of the liquid.
     * <p>
     * This is a clunky way to constrain the volume to a fixed number
     * of decimal places, so that student calculations will match displayed values.
     * The success of this approach relies on this method being called in all cases
     * where volume is needed.  That includes public interfaces used by clients,
     * and private methods within this class.
     *
     * @return
     */
    getVolume: function() {
      return Util.toFixedNumber( this.soluteVolumeProperty.get() + this.solventVolumeProperty.get(), PHScaleConstants.VOLUME_DECIMAL_PLACES );
    },

    isEmpty: function() { return this.getVolume() === 0; },

    isFull: function() { return this.getVolume() === this.maxVolume; },

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
      this.soluteProperty.get().pHProperty.set( -log10( m / this.getVolume() ) );
    },

    getMolesH3O: function() {
      return Solution.computeMoles( this.getVolume(), this.getConcentrationH3O() );
    },

    setMolesOH: function( m ) {
      this.soluteProperty.get().pHProperty.set( 14 - ( -log10( m / this.getVolume() ) ) );
    },

    getMolesOH: function() {
      return Solution.computeMoles( this.getVolume(), this.getConcentrationOH() );
    },

    getMolesH2O: function() {
      return Solution.computeMoles( this.getVolume(), this.getConcentrationH2O() );
    }
  };

  /**
   * Computes the pH of a solution.
   * Combining acids and bases is not supported by this model.
   * @param solutePH
   * @param soluteVolume
   * @param solventPH
   * @param solventVolume
   * @returns {number|null} null if the solution's volume is zero
   */
  Solution.computePH = function( solutePH, soluteVolume, solventPH, solventVolume ) {
    var pH;
    if ( soluteVolume + solventVolume === 0 ) {
      pH = null;
    }
    else if ( solutePH < 7 ) {
      assert && assert( solventPH <= 7 ); // combining acids and bases is not supported
      pH = -log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -solventPH ) * solventVolume ) / ( soluteVolume + solventVolume ) );
    }
    else {
      assert && assert( solventPH >= 7 ); // combining acids and bases is not supported
      pH = 14 + log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, solventPH - 14 ) * solventVolume ) / ( soluteVolume + solventVolume ) );
    }
    return pH; //TODO constrain to PHScaleConstants.PH_DECIMAL_PLACES, as in Java sim?
  };

  /**
   * Computes the color of a solution.
   * @param {Color} soluteColor
   * @param {Color} soluteDilutedColor
   * @param {Number} soluteVolume
   * @param {Color} solventColor
   * @param {Number} solventVolume
   * @returns {Color} solventColor if the solution's volume is zero
   */
  Solution.computeColor = function( soluteColor, soluteDilutedColor, soluteVolume, solventColor, solventVolume ) {
    var color;
    var solutionVolume = soluteVolume + solventVolume;
    if ( solutionVolume === 0 || soluteVolume === 0 ) {
      color = solventColor;
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
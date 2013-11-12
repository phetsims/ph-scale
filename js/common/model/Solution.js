// Copyright 2002-2013, University of Colorado Boulder

//TODO move some of this into a CustomSolution subtype
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
  var Fluid = require( 'PH_SCALE/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var log10 = require( 'DOT/Util' ).log10;
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var toFixed = require( 'DOT/Util' ).toFixed;

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
    Fluid.call( thisSolution, new Color( 255, 255, 255 ) ); // use a bogus initial color, it will be derived below

    thisSolution.soluteProperty = new Property( solute );
    thisSolution.soluteVolumeProperty = new Property( soluteVolume );
    thisSolution.solvent = solvent;
    thisSolution.solventVolumeProperty = new Property( solventVolume );
    thisSolution.maxVolume = maxVolume;

    // pH, null if no value
    thisSolution.pHProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.solventVolumeProperty ],
      function( solute, soluteVolume, solventVolume ) {
        return Solution.computePH( solute.pH, soluteVolume, thisSolution.solvent.pH, solventVolume );
      }
    );

    // color
    var updateColor = function() {
      thisSolution.colorProperty.set( Solution.computeColor( solute.colorProperty.get(), soluteVolume, thisSolution.solvent.colorProperty.get(), solventVolume ) );
    };
    thisSolution.soluteProperty.link( updateColor );
    thisSolution.soluteVolumeProperty.link( updateColor );
    thisSolution.solventVolumeProperty.link( updateColor );
  }

  return inherit( Fluid, Solution, {

    // @override
    reset: function() {
      Fluid.prototype.reset.call( this );
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.solventVolumeProperty.reset();
    },

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

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
    getVolume: function() { return toFixed( this.soluteVolume + this.solventVolume, PHScaleConstants.VOLUME_DECIMAL_PLACES ); },

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
      return Solution.computeMoles( this.getVolume(), this.getConcentrationH2O() );
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
      return pH; //TODO constrain to PHScaleConstants.PH_DECIMAL_PLACES, as in Java sim?
    },

    /**
     * Computes the color of a solution.
     * @param soluteColor
     * @param soluteVolume
     * @param solventColor
     * @param solventVolume
     * @returns {color} solventColor if the solution's volume is zero
     */
    computeColor: function( soluteColor, soluteVolume, solventColor, solventVolume ) {
      var color;
      var solutionVolume = soluteVolume + solventVolume;
      if ( solutionVolume === 0 || soluteVolume === 0 ) {
        color = solventColor;
      }
      else {
        // dilute solute with solvent
        color = soluteColor.withAlpha( soluteColor.a * ( soluteVolume / solutionVolume ) );
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
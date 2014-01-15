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
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Util = require( 'DOT/Util' );

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
      function() { return PHModel.solutionToPH( thisSolution ); } );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.pHProperty ],
      function( solute, pH ) {
        if ( thisSolution.volumeProperty.get() === 0 || thisSolution.soluteVolumeProperty.get() === 0 || thisSolution.isEquivalentToWater() ) {
          return thisSolution.water.color;
        }
        else {
          return solute.computeColor( thisSolution.soluteVolumeProperty.get() / thisSolution.volumeProperty.get() );
        }
      } );

    // solute
    thisSolution.soluteProperty.link( function() {
      if ( options.emptyWhenSoluteChanges ) {
        thisSolution.waterVolumeProperty.set( 0 );
        thisSolution.soluteVolumeProperty.set( 0 );
      }
    } );
  }

  Solution.prototype = {

    reset: function() {
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.waterVolumeProperty.reset();
    },

    /*
     * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
     * Eg, the value displayed to the user is '7.00'.
     */
    isEquivalentToWater: function() {
      var pHString = Util.toFixed( this.pHProperty.get(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return ( parseFloat( pHString ) === this.water.pH ) && ( this.waterVolumeProperty.get() > 0 );
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

    //TODO move responsibility for creating the custom solute to LogarithmicGraph
    setConcentrationH3O: function( c ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = Util.clamp( PHModel.concentrationH3OToPH( c ), PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getConcentrationH3O: function() {
      return PHModel.pHToConcentrationH3O( this.pHProperty.get() );
    },

    //TODO move responsibility for creating the custom solute to LogarithmicGraph
    setConcentrationOH: function( c ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = Util.clamp( PHModel.concentrationOHToPH( c ), PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getConcentrationOH: function() {
      return PHModel.pHToConcentrationOH( this.pHProperty.get() );
    },

    getConcentrationH2O: function() {
      return ( this.isEmpty() ? 0 : 55 );
    },

    //----------------------------------------------------------------------------
    // Number of molecules
    //----------------------------------------------------------------------------

    getMoleculesH3O: function() {
      return PHModel.computeMolecules( this.getConcentrationH3O(), this.volumeProperty.get() );
    },

    getMoleculesOH: function() {
      return PHModel.computeMolecules( this.getConcentrationOH(), this.volumeProperty.get() );
    },

    getMoleculesH2O: function() {
      return PHModel.computeMolecules( this.getConcentrationH2O(), this.volumeProperty.get() );
    },

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    //TODO move responsibility for creating the custom solute to LogarithmicGraph
    setMolesH3O: function( m ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = Util.clamp( PHModel.molesH3OToPH( m, this.volumeProperty.get() ), PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getMolesH3O: function() {
      return PHModel.computeMoles( this.getConcentrationH3O(), this.volumeProperty.get() );
    },

    //TODO move responsibility for creating the custom solute to LogarithmicGraph
    setMolesOH: function( m ) {
      if ( this.volumeProperty.get() !== 0 ) {
        var pH = Util.clamp( PHModel.molesOHToPH( m, this.volumeProperty.get() ), PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );
        this.soluteProperty.set( Solute.createCustom( pH ) );
      }
    },

    getMolesOH: function() {
      return PHModel.computeMoles( this.getConcentrationOH(), this.volumeProperty.get() );
    },

    getMolesH2O: function() {
      return PHModel.computeMoles( this.getConcentrationH2O(), this.volumeProperty.get() );
    }
  };

  return Solution;
} );
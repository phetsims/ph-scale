// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Dropper = require( 'PH_SCALE/common/model/Dropper' );
  var Faucet = require( 'PH_SCALE/common/model/Faucet' );
  var PHMeter = require( 'PH_SCALE/common/model/PHMeter' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Solvent = require( 'PH_SCALE/common/model/Solvent' );
  var Vector2 = require( 'DOT/Vector2' );

  function BasicsModel() {

    var thisModel = this;

    // solute choices, in order that they'll appear in the combo box
    thisModel.solutes = [
       Solute.DRAIN_CLEANER,
       Solute.HAND_SOAP,
       Solute.BLOOD,
       Solute.SPIT,
       Solute.MILK,
       Solute.COFFEE,
       Solute.BEER,
       Solute.LIME_SODA,
       Solute.VOMIT,
       Solute.BATTERY_ACID
    ];

    thisModel.solvent = Solvent.WATER;
    thisModel.beaker = new Beaker( new Vector2( 330, 600 ), new Dimension2( 400, 325 ) );
    thisModel.dropper = new Dropper( thisModel.solutes[0], new Vector2( thisModel.beaker.location.x + 40, 260 ), new Bounds2( 250, 260, 460, 260 ) );
    thisModel.solution = new Solution( thisModel.dropper.soluteProperty, 0, thisModel.solvent, 0, thisModel.beaker.volume );
    thisModel.solventFaucet = new Faucet( new Vector2( 185, 190 ), -400,
      { enabled: thisModel.solution.volumeProperty.get() < thisModel.beaker.volume } );
    thisModel.drainFaucet = new Faucet( new Vector2( thisModel.beaker.right + 100, 652 ), thisModel.beaker.right,
      { enabled: thisModel.solution.volumeProperty.get() > 0 } );
    thisModel.pHMeter = new PHMeter( new Vector2( 810, 20 ), new Bounds2( 10, 150, 835, 680 ), new Vector2( 605, 405 ), new Bounds2( 30, 150, 966, 680 ) );

    // Enable faucets and dropper based on amount of solution in the beaker.
    thisModel.solution.volumeProperty.link( function( volume ) {
      thisModel.solventFaucet.enabledProperty.set( volume < thisModel.beaker.volume );
      thisModel.drainFaucet.enabledProperty.set( volume > 0 );
      thisModel.dropper.enabledProperty.set( !thisModel.dropper.emptyProperty.get() && ( volume < thisModel.beaker.volume ) );
    } );
  }

  BasicsModel.prototype = {

    reset: function() {
      this.beaker.reset();
      this.dropper.reset();
      this.solution.reset();
      this.solventFaucet.reset();
      this.drainFaucet.reset();
      this.pHMeter.reset();
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      this.addSolute( deltaSeconds );
      this.addSolvent( deltaSeconds );
      this.drainSolution( deltaSeconds );
    },

    // private: Add solute from the dropper
    addSolute: function( deltaSeconds ) {
      var deltaVolume = this.dropper.flowRateProperty.get() * deltaSeconds;
      if ( deltaVolume > 0 ) {
        this.solution.soluteVolumeProperty.set( this.solution.soluteVolumeProperty.get() + deltaVolume );
      }
    },

    // private: Add solvent from the input faucet
    addSolvent: function( deltaSeconds ) {
      var deltaVolume = this.solventFaucet.flowRateProperty.get() * deltaSeconds;
      if ( deltaVolume > 0 ) {
        this.solution.solventVolumeProperty.set( this.solution.solventVolumeProperty.get() + deltaVolume );
      }
    },

    // private: Drain solution from the output faucet. Equal percentages of solvent and solute are drained.
    drainSolution: function( deltaSeconds ) {
      if ( this.solution.volumeProperty.get() > 0 ) {
        var deltaVolume = this.drainFaucet.flowRateProperty.get() * deltaSeconds;
        if ( deltaVolume >= this.solution.volumeProperty.get() ) {
          // drain the remaining solution
          this.solution.solventVolumeProperty.set( 0 );
          this.solution.soluteVolumeProperty.set( 0 );
        }
        else {
          this.drainPercentage( deltaVolume, this.solution.solventVolumeProperty );
          this.drainPercentage( deltaVolume, this.solution.soluteVolumeProperty );
        }
      }
    },

    // private: Drains a percentage of some component of that makes up the total volume.
    drainPercentage: function( deltaVolume, componentVolumeProperty ) {
      componentVolumeProperty.set( Math.max( 0, componentVolumeProperty.get() - ( deltaVolume * componentVolumeProperty.get() / this.solution.volumeProperty.get() ) ) );
    }
  };

  return BasicsModel;
} );
